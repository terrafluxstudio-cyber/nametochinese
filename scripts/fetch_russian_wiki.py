"""
Thorough fetch of Russian/Soviet person names from zh.wikipedia.
BFS walks the full subcategory tree from key roots, collects all pages,
then batch-fetches ru langlinks.

Run from project root:
  python3 scripts/fetch_russian_wiki.py
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
    def to_simplified(s): return s  # fallback: no conversion

ZH_API = "https://zh.wikipedia.org/w/api.php"
OUTPUT = "data/russian_wikidata.csv"
MAX_DEPTH = 4  # subcategory BFS depth

# Root categories — comprehensive coverage of Russian/Soviet people
ROOTS = [
    # Russian by profession (gendered, these have the richest subcats)
    "各职业俄罗斯男性",
    "各职业俄罗斯女性",
    # Soviet by profession
    "各職業蘇聯人",
    # Sports
    "苏联运动员",
    "俄罗斯男子足球运动员",
    "俄罗斯女子足球运动员",
    "俄羅斯國家足球隊球員",
    # Politics
    "蘇聯政治人物",
    "20世纪俄罗斯政治人物",
    "21世纪俄罗斯政治人物",
    "俄罗斯总统",
    "俄罗斯总理",
    # Arts
    "俄罗斯艺术家",
    "蘇聯藝人",
    "俄羅斯音樂家",
    "俄羅斯演員",
    "俄羅斯舞者",
    # Science/academia
    "苏联学者",
    "蘇聯太空計畫人物",
    # Military
    "蘇聯軍事人物",
    "俄罗斯军事人物",
    # Writers
    "蘇聯作家",
    "俄罗斯诗人",
]


def zh_api(params, retries=3):
    params["format"] = "json"
    url = ZH_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={
        "User-Agent": "nametochinese-bot/1.0 (terrafluxstudio@gmail.com)"
    })
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                print(f"    API error: {e}")
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
        time.sleep(0.25)
    return results


def get_ru_langlinks(titles_batch):
    if not titles_batch:
        return {}
    params = {
        "action": "query",
        "prop": "langlinks",
        "lllang": "ru",
        "lllimit": "500",
        "titles": "|".join(titles_batch[:50]),
    }
    data = zh_api(params)
    pages = data.get("query", {}).get("pages", {})
    result = {}
    for page in pages.values():
        zh_title = page.get("title", "")
        for ll in page.get("langlinks", []):
            if ll.get("lang") == "ru":
                result[zh_title] = ll.get("*", "")
                break
    return result


def is_chinese(s):
    return any('一' <= c <= '鿿' for c in s)


def is_cyrillic(s):
    return any('Ѐ' <= c <= 'ӿ' for c in s)


def normalize_ru_name(ru_title):
    """Фамилия, Имя Отчество → Имя Фамилия"""
    if "," in ru_title:
        parts = ru_title.split(",", 1)
        surname = parts[0].strip()
        given_parts = parts[1].strip().split()
        first_name = given_parts[0] if given_parts else ""
        return f"{first_name} {surname}".strip() if first_name else surname
    return ru_title


def bfs_collect_pages(roots, max_depth):
    """BFS through subcategory tree, collect all page titles."""
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

        # Collect pages in this category
        pages = get_members(cat, cmtype="page")
        valid = [p["title"] for p in pages if is_chinese(p["title"])]
        all_pages.update(valid)

        if cat_count % 20 == 0:
            print(f"  [{cat_count} cats scanned] {len(all_pages)} pages so far")

        # BFS into subcategories
        if depth < max_depth:
            subcats = get_members(cat, cmtype="subcat")
            for sc in subcats:
                sc_name = sc["title"].replace("Category:", "")
                if sc_name not in visited_cats:
                    queue.append((sc_name, depth + 1))

        time.sleep(0.2)

    print(f"  Total: {cat_count} categories, {len(all_pages)} unique pages")
    return all_pages


def main():
    print("Phase 1: BFS category walk...")
    all_pages = bfs_collect_pages(ROOTS, MAX_DEPTH)

    print(f"\nPhase 2: Fetching ru langlinks for {len(all_pages)} pages...")
    seen_ru = set()
    rows = []
    titles = list(all_pages)

    for i in range(0, len(titles), 50):
        batch = titles[i:i+50]
        try:
            links = get_ru_langlinks(batch)
        except Exception as e:
            print(f"  batch {i//50} error: {e}")
            time.sleep(3)
            continue

        for zh_title, ru_raw in links.items():
            if not ru_raw or not is_cyrillic(ru_raw):
                continue
            ru_name = normalize_ru_name(ru_raw)
            if ru_name in seen_ru:
                continue
            seen_ru.add(ru_name)
            rows.append((ru_name, to_simplified(zh_title), ""))

        if i % 1000 == 0 and i > 0:
            print(f"  {i}/{len(titles)} done, {len(rows)} pairs")
        time.sleep(0.25)

    print(f"\nTotal: {len(rows)} unique Russian↔Chinese pairs")

    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(["russian", "chinese", "gender"])
        writer.writerows(rows)

    print(f"Saved → {OUTPUT}")
    print("\nSample:")
    for r in rows[:8]:
        print(f"  {r[0]} → {r[1]}")


if __name__ == "__main__":
    main()
