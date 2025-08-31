"""
make_splits.py - ML Dataset Splitting Pipeline

This script takes extracted volleyball clips and creates train/validation/test splits
for machine learning training. It ensures balanced distribution of volleyball actions
across all splits using stratified sampling.

Main workflow:
1. Read clips_index.csv (output from extract_clips.py)
2. Group clips by volleyball action type (serve, spike, pass, etc.)
3. Apply per-action limits if specified
4. Split each action group into train/val/test with specified ratios
5. Write separate CSV files for each split

Purpose: Creates proper ML datasets with balanced action representation across splits,
preventing data leakage and ensuring fair evaluation.

Usage:
    python make_splits.py --index clips_index.csv --out-dir data/splits
    
Output:
    data/splits/train.csv - Training set (70% by default)
    data/splits/val.csv   - Validation set (15% by default) 
    data/splits/test.csv  - Test set (15% by default)
"""

import argparse, csv, random
from collections import defaultdict
from pathlib import Path

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", required=True, help="Path to clips_index.csv")
    ap.add_argument("--out-dir", required=True, help="Where to write splits/")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--per-action-cap", type=int, default=0, help="0=no cap")
    ap.add_argument("--val-frac", type=float, default=0.15)
    ap.add_argument("--test-frac", type=float, default=0.15)
    args = ap.parse_args()

    random.seed(args.seed)
    out_dir = Path(args.out_dir); out_dir.mkdir(parents=True, exist_ok=True)

    # Load rows
    rows = []
    with open(args.index, newline="", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r:
            rows.append({
                "clip_path": row["clip_path"],
                "action": (row["action"] or "").strip().lower(),
                "outcome": row["outcome"].strip(),
                "player": row["player"],
                "video_filename": row["video_filename"],
                "t_event_sec": row["t_event_sec"],
            })

    # Group by action (for stratified split)
    by_action = defaultdict(list)
    for row in rows:
        by_action[row["action"]].append(row)

    train, val, test = [], [], []
    for action, items in by_action.items():
        random.shuffle(items)
        if args.per_action_cap and len(items) > args.per_action_cap:
            items = items[:args.per_action_cap]

        n = len(items)
        n_test = int(round(n * args.test_frac))
        n_val  = int(round(n * args.val_frac))
        n_train = n - n_val - n_test

        test  += items[:n_test]
        val   += items[n_test:n_test+n_val]
        train += items[n_test+n_val:]

    def write_split(name, data):
        path = out_dir / f"{name}.csv"
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(train[0].keys()))
            w.writeheader()
            w.writerows(data)
        return path

    p_train = write_split("train", train)
    p_val   = write_split("val", val)
    p_test  = write_split("test", test)

    # Quick summary
    def counts(ds):
        c = defaultdict(int)
        for r in ds: c[r["action"]] += 1
        return dict(sorted(c.items(), key=lambda x: x[0]))
    print("✅ splits written:")
    print("  train:", p_train, counts(train))
    print("  val  :", p_val,   counts(val))
    print("  test :", p_test,  counts(test))

if __name__ == "__main__":
    main()