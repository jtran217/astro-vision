"""
extract_clips.py - Video Clip Extraction Pipeline

This script extracts short video clips from volleyball footage based on tagged events
in a manifest.csv file. It creates individual training clips centered around specific
volleyball actions (serves, spikes, passes, etc.) for machine learning training.

Main workflow:
1. Read manifest.csv with tagged volleyball events
2. For each event, extract a video clip with configurable pre/post windows
3. Use FFmpeg to create clips with consistent encoding
4. Generate descriptive filenames for easy organization
5. Create clips_index.csv for downstream ML training scripts

Purpose: Converts tagged volleyball moments into individual training clips,
enabling computer vision models to learn volleyball action recognition.

Usage:
    python extract_clips.py --manifest manifest.csv --video-root videos --out-dir clips

Output:
    clips/game1_spike_succ_Johnny_Tran_45200_1.mp4  (individual clips)
    clips/clips_index.csv                            (index for ML training)
"""

import argparse,csv,math,os,subprocess,sys
from collections import defaultdict
from pathlib import Path

def sanitize(s: str, maxlen: int = 80) -> str:
    """Safe chunk for filenames: keep alnum/_- and collapse spaces."""
    s = (s or "").strip().replace(" ", "_")
    out = []
    for ch in s:
        if ch.isalnum() or ch in ("_", "-", "."):
            out.append(ch)
    return "".join(out)[:maxlen] or "na"

def ensure_dir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)

def build_out_name(event_id: str, player: str, action: str, outcome: str,
                   video_filename: str, t_sec: float) -> str:
    """Create a readable, mostly unique filename for the clip."""
    base = f"{Path(video_filename).stem}"
    return sanitize(f"{base}_{action}_{'succ' if str(outcome)=='1' else 'fail'}_{sanitize(player,40)}_{int(round(t_sec*1000))}_{event_id}.mp4")

def cut_clip_ffmpeg(src: Path, dst: Path, start: float, dur: float,
                    overwrite: bool = False, crf: int = 23, preset: str = "veryfast") -> int:
    """
    Use ffmpeg to cut [start, start+dur) from src into dst.
    Returns ffmpeg exit code (0 = success).
    Re-encodes (libx264) to avoid keyframe issues; drops audio for speed.
    """
    if dst.exists() and not overwrite:
        return 0
    cmd = [
        "ffmpeg",
        "-hide_banner", "-loglevel", "error",
        "-ss", f"{start:.3f}",
        "-i", str(src),
        "-t", f"{dur:.3f}",
        "-c:v", "libx264",
        "-preset", preset,
        "-crf", str(crf),
        "-an",
        str(dst),
    ]
    return subprocess.call(cmd)

def main():
    ap = argparse.ArgumentParser(description="Extract event-centered clips from manifest.csv using ffmpeg")
    ap.add_argument("--manifest", required=True, help="Path to manifest.csv")
    ap.add_argument("--video-root", required=True, help="Directory containing source videos")
    ap.add_argument("--out-dir", required=True, help="Directory to write clips and clips_index.csv")
    ap.add_argument("--pre", type=float, default=1.0, help="Seconds before t_event_sec (default 1.0)")
    ap.add_argument("--post", type=float, default=2.0, help="Seconds after t_event_sec (default 2.0)")
    ap.add_argument("--limit", type=int, default=0, help="Max total clips (0 = no limit)")
    ap.add_argument("--per-action-limit", type=int, default=0, help="Max clips per action class (0 = no limit)")
    ap.add_argument("--overwrite", action="store_true", help="Overwrite existing clip files")
    args = ap.parse_args()

    manifest = Path(args.manifest)
    video_root = Path(args.video_root)
    out_dir = Path(args.out_dir)
    ensure_dir(out_dir)

    # Where we’ll log what we produced (handy for training scripts):
    index_path = out_dir / "clips_index.csv"
    wrote_header = not index_path.exists()

    total_in = 0
    total_out = 0
    per_action_counts = defaultdict(int)
    per_video_missing = defaultdict(int)
    per_video_ok = defaultdict(int)

    # Open once to append index rows as we go
    index_f = open(index_path, "a", newline="", encoding="utf-8")
    index_w = csv.DictWriter(
        index_f,
        fieldnames=[
            "clip_path", "video_filename", "t_event_sec",
            "pre", "post", "action", "outcome", "player", "event_id"
        ],
    )
    if wrote_header:
        index_w.writeheader()

    with open(manifest, newline="", encoding="utf-8") as f:
        r = csv.DictReader(f)
        required = {"event_id","video_filename","t_event_sec","action","player","outcome"}
        missing_headers = required - set(r.fieldnames or [])
        if missing_headers:
            print(f"❌ Missing headers in manifest: {sorted(missing_headers)}")
            sys.exit(2)

        for row in r:
            total_in += 1
            # Respect overall and per-action limits
            if args.limit and total_out >= args.limit:
                break
            action = (row["action"] or "").strip().lower()
            if args.per_action_limit and per_action_counts[action] >= args.per_action_limit:
                continue

            # Resolve source video
            video_filename = row["video_filename"].strip()
            src = video_root / video_filename
            if not src.exists():
                per_video_missing[video_filename] += 1
                continue

            try:
                t = float(row["t_event_sec"])
            except Exception:
                continue

            # Compute clip window (clamp to 0)
            pre = max(0.0, float(args.pre))
            post = max(0.0, float(args.post))
            start = max(0.0, t - pre)
            dur = pre + post
            # If event is very early and we clamped start to 0, extend duration to still include the post window
            if t - pre < 0:
                dur = t + post  # from 0 to (t+post)

            out_name = build_out_name(
                event_id=row["event_id"],
                player=row["player"],
                action=action,
                outcome=row["outcome"],
                video_filename=video_filename,
                t_sec=t,
            )
            dst = out_dir / out_name

            code = cut_clip_ffmpeg(src, dst, start, dur, overwrite=args.overwrite)
            if code != 0:
                # ffmpeg failed; skip
                continue

            # Write index entry for training pipelines
            index_w.writerow({
                "clip_path": str(dst),
                "video_filename": video_filename,
                "t_event_sec": f"{t:.3f}",
                "pre": f"{pre:.3f}",
                "post": f"{post:.3f}",
                "action": action,
                "outcome": row["outcome"],
                "player": row["player"],
                "event_id": row["event_id"],
            })

            total_out += 1
            per_action_counts[action] += 1
            per_video_ok[video_filename] += 1

    index_f.close()

    # Summary
    print(f"Scanned manifest rows: {total_in}")
    print(f"Wrote clips: {total_out} → {index_path.name}")
    if per_action_counts:
        print("Per-action counts:", dict(per_action_counts))
    if per_video_missing:
        miss = sum(per_video_missing.values())
        print(f"Missing source videos for {miss} events across {len(per_video_missing)} files:")
        for k, v in sorted(per_video_missing.items(), key=lambda x: -x[1])[:5]:
            print(f"  {k}: {v} missing")

if __name__ == "__main__":
    main()