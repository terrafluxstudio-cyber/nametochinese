"""
Fetch Arabic person names from zh.wikipedia (BFS).
Covers major Arab countries: Egypt, Saudi Arabia, Iraq, Syria, Jordan,
Palestine, Lebanon, UAE, Morocco, Tunisia, Libya, Algeria, Yemen, Qatar, Kuwait.
Run from project root:
  python3 scripts/fetch_arabic_wiki.py
"""
import csv, time, json, re, urllib.request, urllib.parse
from collections import deque

try:
    import opencc
    _c = opencc.OpenCC('t2s')
    def to_s(s): return _c.convert(s)
except ImportError:
    def to_s(s): return s

ZH_API = "https://zh.wikipedia.org/w/api.php"
OUTPUT = "data/arabic_wikidata.csv"
LANG   = "ar"
MAX_DEPTH = 4

ROOTS = [
    # Egypt (largest Arab country, richest wiki coverage)
    "埃及人", "埃及政治人物", "埃及总统", "埃及音乐家", "埃及演员", "埃及运动员",
    # Saudi Arabia
    "沙特阿拉伯人", "沙特阿拉伯政治人物", "沙特阿拉伯王室",
    # Iraq
    "伊拉克人", "伊拉克政治人物",
    # Syria
    "叙利亚人", "叙利亚政治人物",
    # Jordan
    "约旦人", "约旦政治人物", "约旦王室",
    # Palestine
    "巴勒斯坦人", "巴勒斯坦政治人物",
    # Lebanon
    "黎巴嫩人", "黎巴嫩政治人物", "黎巴嫩音乐家",
    # UAE
    "阿联酋人", "阿联酋政治人物",
    # North Africa
    "摩洛哥人", "摩洛哥政治人物",
    "突尼斯人", "突尼斯政治人物",
    "利比亚人", "利比亚政治人物",
    "阿尔及利亚人", "阿尔及利亚政治人物",
    # Yemen
    "也门人", "也门政治人物",
    # Qatar / Kuwait / Bahrain / Oman
    "卡塔尔人", "科威特人", "巴林人", "阿曼人",
    # Broader
    "阿拉伯世界政治人物",
    "伊斯兰哲学家", "伊斯兰学者",
    "阿拉伯裔美国人",
]

def zh_api(params, retries=3):
    params["format"] = "json"
    url = ZH_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "nametochinese-bot/1.0 (terrafluxstudio@gmail.com)"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            if attempt < retries - 1: time.sleep(2 ** attempt)
            else: print(f"  API error: {e}"); return {}

def get_members(cat, cmtype="page"):
    results, cont = [], None
    while True:
        params = {"action":"query","list":"categorymembers","cmtitle":f"Category:{cat}","cmtype":cmtype,"cmlimit":"500"}
        if cont: params["cmcontinue"] = cont
        data = zh_api(params)
        members = data.get("query", {}).get("categorymembers", [])
        results.extend(members)
        cont = data.get("continue", {}).get("cmcontinue")
        if not cont: break
        time.sleep(0.25)
    return results

def get_langlinks(titles_batch):
    if not titles_batch: return {}
    params = {"action":"query","prop":"langlinks","lllang":LANG,"lllimit":"500","titles":"|".join(titles_batch[:50])}
    data = zh_api(params)
    pages = data.get("query", {}).get("pages", {})
    result = {}
    for page in pages.values():
        zh_title = page.get("title", "")
        for ll in page.get("langlinks", []):
            if ll.get("lang") == LANG:
                result[zh_title] = ll.get("*", ""); break
    return result

def is_chinese(s): return any('一' <= c <= '鿿' for c in s)

def is_arabic(s):
    return bool(re.search(r'[؀-ۿ]', s))

def bfs_collect_pages(roots, max_depth):
    visited_cats, all_pages = set(), set()
    queue = deque((r, 0) for r in roots)
    cat_count = 0
    while queue:
        cat, depth = queue.popleft()
        if cat in visited_cats: continue
        visited_cats.add(cat); cat_count += 1
        pages = get_members(cat, "page")
        valid = [p["title"] for p in pages if is_chinese(p["title"])]
        all_pages.update(valid)
        if cat_count % 20 == 0: print(f"  [{cat_count} cats] {len(all_pages)} pages")
        if depth < max_depth:
            for sc in get_members(cat, "subcat"):
                sc_name = sc["title"].replace("Category:", "")
                if sc_name not in visited_cats: queue.append((sc_name, depth + 1))
        time.sleep(0.2)
    print(f"  Total: {cat_count} cats, {len(all_pages)} pages")
    return all_pages

def main():
    print("Phase 1: BFS...")
    all_pages = bfs_collect_pages(ROOTS, MAX_DEPTH)
    print(f"\nPhase 2: Fetching {LANG} langlinks for {len(all_pages)} pages...")
    seen, rows, titles = set(), [], list(all_pages)
    for i in range(0, len(titles), 50):
        try: links = get_langlinks(titles[i:i+50])
        except Exception as e: print(f"  batch {i//50} error: {e}"); time.sleep(3); continue
        for zh_title, native in links.items():
            if not native or not is_arabic(native): continue
            # Strip parenthetical notes
            native = re.sub(r'\s*\(.*?\)', '', native).strip()
            if native in seen or not native: continue
            seen.add(native)
            rows.append((native, to_s(zh_title), ""))
        if i % 500 == 0 and i > 0: print(f"  {i}/{len(titles)} done, {len(rows)} pairs")
        time.sleep(0.25)
    print(f"\nTotal: {len(rows)} Arabic↔Chinese pairs")
    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(["arabic", "chinese", "gender"])
        writer.writerows(rows)
    print(f"Saved → {OUTPUT}")
    for r in rows[:8]: print(f"  {r[0]} → {r[1]}")

if __name__ == "__main__":
    main()
