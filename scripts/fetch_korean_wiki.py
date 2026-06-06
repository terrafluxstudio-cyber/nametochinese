"""
Thorough fetch of Korean person names from zh.wikipedia.
BFS walks subcategory tree from 各職業韓國人 + sports/politics/entertainment roots,
collects pages, then fetches ko (Hangul) + en (romanization) langlinks.

Output CSV: korean (Hangul), chinese (zh title, simplified), english (romanization), gender

Run from project root:
  python3 scripts/fetch_korean_wiki.py
"""

import csv
import time
import json
import urllib.request
import urllib.parse
from collections import deque

try:
    import opencc
    _converter = opencc.OpenCC('t2s')
    def to_simplified(s): return _converter.convert(s)
except ImportError:
    def to_simplified(s): return s

ZH_API = "https://zh.wikipedia.org/w/api.php"
OUTPUT = "data/korean_wiki.csv"
MAX_DEPTH = 4

ROOTS = [
    "各職業韓國人",
    "韓國運動員",
    "韩国男子运动员",
    "韩国女子运动员",
    "韓國政治人物",
    "大韩民国总统",
    "韓國演員",
    "韓國歌手",
    "韓國男演員",
    "韓國女演員",
    "韓國電視劇演員",
    "韓國電影導演",
    "韓國作家",
    "韓國科學家",
    "韓國企業家",
    "韩国学者",
    "朝鮮王朝人物",
    "大韓帝國人物",
]


def zh_api(params, retries=4):
    params["format"] = "json"
    url = ZH_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={
        "User-Agent": "nametochinese-bot/1.0 (terrafluxstudio@gmail.com)"
    })
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 5 * (attempt + 1)
                print(f"    429 rate-limited, waiting {wait}s...")
                time.sleep(wait)
            elif attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                print(f"    HTTP error: {e}")
                return {}
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                print(f"    error: {e}")
                return {}
    return {}


def get_members(category, cmtype="page"):
    results = []
    cont = None
    while True:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": f"Category:{category}",
            "cmtype": cmtype,
            "cmlimit": "500",
        }
        if cont:
            params["cmcontinue"] = cont
        data = zh_api(params)
        members = data.get("query", {}).get("categorymembers", [])
        results.extend(members)
        cont = data.get("continue", {}).get("cmcontinue")
        if not cont:
            break
        time.sleep(0.4)
    return results


def get_ko_en_langlinks(titles_batch):
    """Fetch ALL langlinks for batch, extract ko + en."""
    if not titles_batch:
        return {}
    params = {
        "action": "query",
        "prop": "langlinks",
        "lllimit": "500",
        "titles": "|".join(titles_batch[:50]),
    }
    data = zh_api(params)
    pages = data.get("query", {}).get("pages", {})
    result = {}
    for page in pages.values():
        zh_title = page.get("title", "")
        ko = en = ""
        for ll in page.get("langlinks", []):
            if ll.get("lang") == "ko":
                ko = ll.get("*", "")
            elif ll.get("lang") == "en":
                en = ll.get("*", "")
        result[zh_title] = (ko, en)
    return result


def is_chinese(s):
    return any('一' <= c <= '鿿' for c in s)


def is_hangul(s):
    return any('가' <= c <= '힯' for c in s)


def bfs_collect_pages(roots, max_depth):
    visited_cats = set()
    all_pages = set()
    queue = deque((r, 0) for r in roots)
    cat_count = 0

    while queue:
        cat, depth = queue.popleft()
        if cat in visited_cats:
            continue
        visited_cats.add(cat)
        cat_count += 1

        pages = get_members(cat, cmtype="page")
        valid = [p["title"] for p in pages if is_chinese(p["title"])]
        all_pages.update(valid)

        if cat_count % 20 == 0:
            print(f"  [{cat_count} cats] {len(all_pages)} pages so far")

        if depth < max_depth:
            subcats = get_members(cat, cmtype="subcat")
            for sc in subcats:
                sc_name = sc["title"].replace("Category:", "")
                if sc_name not in visited_cats:
                    queue.append((sc_name, depth + 1))

        time.sleep(0.3)

    print(f"  Total: {cat_count} categories, {len(all_pages)} unique pages")
    return all_pages


def main():
    print("Phase 1: BFS category walk...")
    all_pages = bfs_collect_pages(ROOTS, MAX_DEPTH)

    print(f"\nPhase 2: Fetching ko+en langlinks for {len(all_pages)} pages...")
    seen = set()
    rows = []
    titles = list(all_pages)

    for i in range(0, len(titles), 50):
        batch = titles[i:i+50]
        links = get_ko_en_langlinks(batch)

        for zh_title, (ko, en) in links.items():
            # Must have Hangul name
            if not ko or not is_hangul(ko):
                continue
            zh_simplified = to_simplified(zh_title)
            if not is_chinese(zh_simplified):
                continue
            key = ko
            if key in seen:
                continue
            seen.add(key)
            rows.append((ko, zh_simplified, en, ""))

        if i % 1000 == 0 and i > 0:
            print(f"  {i}/{len(titles)} done, {len(rows)} pairs")
        time.sleep(0.4)

    print(f"\nTotal: {len(rows)} unique Korean↔Chinese pairs")

    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(["korean", "chinese", "english", "gender"])
        writer.writerows(rows)

    print(f"Saved → {OUTPUT}")
    print("\nSample:")
    for r in rows[:8]:
        print(f"  {r[0]} → {r[1]} ({r[2]})")


if __name__ == "__main__":
    main()
