import argparse,csv,re

IN_COLS = {
    "event_id":  ["Event ID", "event_id", "id"],
    "timestamp": ["Timestamp", "Timestamq", "timestamp"], 
    "time":      ["Time", "time"],
    "event_type":["Event Type", "Action", "event_type"],
    "player":    ["Player", "player", "athlete"],
    "outcome":   ["Outcome", "outcome", "result"],
    "video_id":  ["Video ID", "video_id", "video"],
}

def first(row,names):
    for n in names:
        if n in row and str(row[n].strip() != ""):
            return row[n]
    return ""

_TIME = re.compile(r"^\s*(\d+):(\d+)(?:\.(\d+))?\s*$")

def parse_time_to_seconds(time_str,ts_value):
    if ts_value:
        try:
            return float(ts_value)
        except ValueError:
            pass
    if time_str:
        m = _TIME.match(time_str)
        if m:
            mm,ss,ms = m.groups()
            return int(mm)*60 + int(ss) + (float(f"0.{ms}") if ms else 0.0)
        try: return float(time_str)
        except ValueError: pass
    raise ValueError("Unparsable time")

ACTION_MAP = {
    "hit":"spike","attack":"spike",
    "assist":"set",
    "receive":"pass",
}

def canonicalize_action(raw):
    k = (raw or "").strip().lower()
    return ACTION_MAP.get(k,k)

def normalize_outcome(raw):
    k = (raw or "").strip().lower()
    if k in {"successful","success","true","1","yes","made","win","won"}: return 1
    if k in {"failure","fail","false","0","no","miss","lost"}: return 0
    return 0

_EXT = re.compile(r"\.(mp4|mov|m4v)\b", re.I)
def video_id_to_filename(video_id):
    s = (video_id or "").strip()
    m = _EXT.search(s)
    return s[:m.end()] if m else s

def transform_csv(in_path,out_path):
    total = written = skipped = 0
    counts = {}
    seen = set()
    
    with open(in_path,newline="",encoding="utf-8-sig") as fin, \
        open(out_path,"w",newline="",encoding="utf-8") as fout:
            r = csv.DictReader(fin)
            w = csv.DictWriter(fout, fieldnames=[
            "event_id","video_id","video_filename","t_event_sec","action","player","outcome"
        ])
            w.writeheader()

            for row in r:
                total+=1
                try:
                    event_id = first(row, IN_COLS["event_id"])
                    ts_val   = first(row, IN_COLS["timestamp"])
                    time_str = first(row, IN_COLS["time"])
                    raw_act  = first(row, IN_COLS["event_type"])
                    player   = first(row, IN_COLS["player"])
                    outc     = first(row, IN_COLS["outcome"])
                    vid_id   = first(row, IN_COLS["video_id"])

                    t_sec = parse_time_to_seconds(time_str, ts_val)
                    action = canonicalize_action(raw_act)
                    outcome = normalize_outcome(outc)
                    vid_file = video_id_to_filename(vid_id) 
                    key = (vid_id, round(t_sec, 3), action, player)
                    
                    if key in seen:
                        skipped += 1
                        continue
                    seen.add(key)

                    w.writerow({
                        "event_id": event_id,
                        "video_id": vid_id,
                        "video_filename": vid_file,
                        "t_event_sec": f"{t_sec:.3f}",
                        "action": action,
                        "player": player,
                        "outcome": outcome,
                    })
                    written += 1
                    counts[action] = counts.get(action, 0) + 1
                except Exception:
                    skipped+=1
                    continue
            print(f"Read {total} rows → wrote {written}, skipped {skipped}")
            if counts: print("Action counts:", counts)


def main():
    ap = argparse.ArgumentParser(description="Normalize tag CSV into ML-friendly manifest.csv")
    ap.add_argument("--in",  dest="in_path", required=True, help="Path to raw CSV export")
    ap.add_argument("--out", dest="out_path", required=True, help="Where to write manifest.csv")
    args = ap.parse_args()
    transform_csv(args.in_path, args.out_path)

if __name__ == "__main__":
    main()

        
        
