
"""
Baseline: classify action using the center frame of each clip.
- Uses OpenCV to grab 1 frame per clip.
- Trains ResNet-18 for action classification.
- Ignores 'outcome' for now (we can add a second head later).
"""
import argparse, csv, os, random
from pathlib import Path

import cv2
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import models, transforms

class FrameDataset(Dataset):
    def __init__(self, split_csv, class_to_idx, img_size=224, max_per_class=0, seed=42):
        self.samples = []
        random.seed(seed)
        with open(split_csv, newline="", encoding="utf-8") as f:
            r = csv.DictReader(f)
            by_class = {}
            for row in r:
                a = row["action"]
                by_class.setdefault(a, []).append(row)
            for a, items in by_class.items():
                random.shuffle(items)
                if max_per_class and len(items) > max_per_class:
                    items = items[:max_per_class]
                self.samples.extend(items)

        self.class_to_idx = class_to_idx
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485,0.456,0.406],
                                 std=[0.229,0.224,0.225]),
        ])

    def __len__(self): return len(self.samples)

    def _read_center_frame(self, path):
        cap = cv2.VideoCapture(path)
        if not cap.isOpened(): return None
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 1
        center_idx = max(0, frame_count // 2)
        cap.set(cv2.CAP_PROP_POS_FRAMES, center_idx)
        ok, frame = cap.read()
        cap.release()
        if not ok or frame is None: return None
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return frame

    def __getitem__(self, idx):
        row = self.samples[idx]
        img = self._read_center_frame(row["clip_path"])
        if img is None:
            # if broken, try first frame
            cap = cv2.VideoCapture(row["clip_path"])
            ok, img = cap.read(); cap.release()
            if not ok or img is None:
                img = (255 * torch.rand(224,224,3).numpy()).astype("uint8")
            else:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        x = self.transform(img)
        y = self.class_to_idx[row["action"]]
        return x, y

def train_one_epoch(model, loader, opt, loss_fn, device):
    model.train()
    total, correct, loss_sum = 0, 0, 0.0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        opt.zero_grad()
        logits = model(x)
        loss = loss_fn(logits, y)
        loss.backward(); opt.step()
        loss_sum += loss.item() * x.size(0)
        pred = logits.argmax(1)
        correct += (pred == y).sum().item()
        total += x.size(0)
    return loss_sum/total, correct/total

@torch.no_grad()
def evaluate(model, loader, loss_fn, device):
    model.eval()
    total, correct, loss_sum = 0, 0, 0.0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        logits = model(x)
        loss = loss_fn(logits, y)
        loss_sum += loss.item() * x.size(0)
        pred = logits.argmax(1)
        correct += (pred == y).sum().item()
        total += x.size(0)
    return loss_sum/total, correct/total

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--splits-dir", required=True, help="Dir with train.csv/val.csv/test.csv")
    ap.add_argument("--epochs", type=int, default=5)
    ap.add_argument("--batch-size", type=int, default=32)
    ap.add_argument("--img-size", type=int, default=224)
    ap.add_argument("--max-per-class", type=int, default=0, help="cap per class for quick runs")
    ap.add_argument("--lr", type=float, default=1e-3)
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    random.seed(args.seed); torch.manual_seed(args.seed)

    # Build label space from train split
    train_csv = Path(args.splits_dir) / "train.csv"
    val_csv   = Path(args.splits_dir) / "val.csv"
    test_csv  = Path(args.splits_dir) / "test.csv"

    actions = set()
    with open(train_csv, newline="", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r: actions.add((row["action"] or "").strip().lower())
    actions = sorted(actions)
    class_to_idx = {a:i for i,a in enumerate(actions)}
    print("Classes:", class_to_idx)

    # Datasets/Loaders
    train_ds = FrameDataset(train_csv, class_to_idx, img_size=args.img_size, max_per_class=args.max_per_class, seed=args.seed)
    val_ds   = FrameDataset(val_csv,   class_to_idx, img_size=args.img_size, max_per_class=0, seed=args.seed)
    test_ds  = FrameDataset(test_csv,  class_to_idx, img_size=args.img_size, max_per_class=0, seed=args.seed)

    train_ld = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True, num_workers=2, pin_memory=True)
    val_ld   = DataLoader(val_ds,   batch_size=args.batch_size, shuffle=False, num_workers=2, pin_memory=True)
    test_ld  = DataLoader(test_ds,  batch_size=args.batch_size, shuffle=False, num_workers=2, pin_memory=True)

    # Model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.fc = nn.Linear(model.fc.in_features, len(class_to_idx))
    model.to(device)

    opt = torch.optim.AdamW(model.parameters(), lr=args.lr)
    loss_fn = nn.CrossEntropyLoss()

    best_val = 0.0
    for epoch in range(1, args.epochs+1):
        tr_loss, tr_acc = train_one_epoch(model, train_ld, opt, loss_fn, device)
        va_loss, va_acc = evaluate(model, val_ld, loss_fn, device)
        print(f"Epoch {epoch:02d} | train loss {tr_loss:.4f} acc {tr_acc:.3f} | val loss {va_loss:.4f} acc {va_acc:.3f}")
        if va_acc > best_val:
            best_val = va_acc
            torch.save({"model": model.state_dict(),
                        "class_to_idx": class_to_idx},
                       Path(args.splits_dir) / "baseline_resnet18.pt")

    te_loss, te_acc = evaluate(model, test_ld, loss_fn, device)
    print(f"TEST  | loss {te_loss:.4f} acc {te_acc:.3f}")

if __name__ == "__main__":
    main()
