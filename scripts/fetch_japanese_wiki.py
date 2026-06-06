"""
Thorough fetch of Japanese person names from zh.wikipedia.
BFS walks subcategory tree from 各職業日本人 + sports/politics/entertainment roots,
collects pages, then fetches ja (kanji/kana) + en (romaji) langlinks.

For a Japanese person:
  zh title  = Chinese rendering (kanji, possibly traditional) -> t2s -> chinese
  ja langlink = Japanese form (kanji + okurigana)             -> japanese
  en langlink = romaji (e.g. "Shinzo Abe")                    -> romaji

Output CSV: japanese, chinese (simplified), romaji, gender

Run from project root:
  python3 scripts/fetch_japanese_wiki.py
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
OUTPUT = "data/japanese_wiki.csv"
MAX_DEPTH = 3
MAX_PAGES = 12000  # BFS 收集到此数量即停止深入

ROOTS = [
    "各職業日本人",
    "日本政治人物",
    "日本內閣總理大臣",
    "日本運動員",
    "日本男子足球運動員",
    "日本女子足球運動員",
    "日本棒球選手",
    "日本演員",
    "日本男演員",
    "日本女演員",
    "日本電視劇演員",
    "日本電影導演",
    "日本歌手",
    "日本女歌手",
    "日本男歌手",
    "日本聲優",
    "日本男性聲優",
    "日本女性聲優",
    "日本作家",
    "日本漫畫家",
    "日本科學家",
    "日本企業家",
    "日本學者",
    "日本軍事人物",
    "江戶時代人物",
    "明治時代人物",
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


def get_ja_en_langlinks(titles_batch):
    """Fetch ALL langlinks for batch, extract ja + en."""
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
        ja = en = ""
        for ll in page.get("langlinks", []):
            if ll.get("lang") == "ja":
                ja = ll.get("*", "")
            elif ll.get("lang") == "en":
                en = ll.get("*", "")
        result[zh_title] = (ja, en)
    return result


def is_chinese(s):
    return any('一' <= c <= '鿿' for c in s)


def is_latin(s):
    return any('a' <= c.lower() <= 'z' for c in s)


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

        if len(all_pages) >= MAX_PAGES:
            print(f"  reached MAX_PAGES={MAX_PAGES}, stopping BFS")
            break

        if depth < max_depth:
            subcats = get_members(cat, cmtype="subcat")
            for sc in subcats:
                sc_name = sc["title"].replace("Category:", "")
                if sc_name not in visited_cats:
                    queue.append((sc_name, depth + 1))

        time.sleep(0.3)

    print(f"  Total: {cat_count} categories, {len(all_pages)} unique pages")
    return all_pages


PAGES_CHECKPOINT = "data/japanese_pages.txt"


def main():
    import os
    if os.path.exists(PAGES_CHECKPOINT):
        with open(PAGES_CHECKPOINT, encoding="utf-8") as cf:
            all_pages = set(l.strip() for l in cf if l.strip())
        print(f"Phase 1 skipped: loaded {len(all_pages)} pages from checkpoint")
    else:
        print("Phase 1: BFS category walk...")
        all_pages = bfs_collect_pages(ROOTS, MAX_DEPTH)
        with open(PAGES_CHECKPOINT, "w", encoding="utf-8") as cf:
            cf.write("\n".join(sorted(all_pages)))
        print(f"  checkpoint saved → {PAGES_CHECKPOINT}")

    print(f"\nPhase 2: Fetching ja+en langlinks for {len(all_pages)} pages...")
    seen = set()
    count = 0
    titles = list(all_pages)

    # 增量写：每批 flush，进程被杀也保留已抓部分
    f = open(OUTPUT, "w", newline="", encoding="utf-8")
    writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    writer.writerow(["japanese", "chinese", "romaji", "gender"])

    for i in range(0, len(titles), 50):
        batch = titles[i:i+50]
        links = get_ja_en_langlinks(batch)

        for zh_title, (ja, en) in links.items():
            if not en or not is_latin(en):
                continue
            zh_simplified = to_simplified(zh_title)
            if not is_chinese(zh_simplified):
                continue
            key = zh_simplified
            if key in seen:
                continue
            seen.add(key)
            jp = ja if ja else zh_title
            writer.writerow((jp, zh_simplified, en, ""))
            count += 1

        f.flush()
        if i % 1000 == 0 and i > 0:
            print(f"  {i}/{len(titles)} done, {count} pairs")
        time.sleep(0.3)

    f.close()
    print(f"\nTotal: {count} unique Japanese↔Chinese pairs")
    print(f"Saved → {OUTPUT}")


if __name__ == "__main__":
    main()
