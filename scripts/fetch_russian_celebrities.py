"""
抓取俄/苏/俄帝籍知名人物的结构化数据，用于程序化 SEO「同名名人」详情页。

数据源：Wikidata（CC0 公共领域，无版权风险）。
筛选：必须有中文 label（=有中文译名/进过中文维基，是中文用户可能搜的知名人物）。
字段：QID、俄文名、中文名、性别、生年、卒年、中文description、英文description、中文wiki链接。

输出：data/russian/celebrities.json
用法：
  python3 scripts/fetch_russian_celebrities.py --test    # 单小批，打印样本验证
  python3 scripts/fetch_russian_celebrities.py           # 全量分批抓取
"""

import json
import sys
import time
import urllib.request
import urllib.parse

ENDPOINT = "https://query.wikidata.org/sparql"
OUT = "data/russian/celebrities.json"
BATCH = 3000          # 每批人数（有中文label的强约束下集合不大）
SLEEP = 2.0           # 批间礼貌延迟（秒）
UA = "nametochinese-celebrities/1.0 (terrafluxstudio@gmail.com)"

# 国籍：Q159 俄罗斯 / Q15180 苏联 / Q34266 俄罗斯帝国
# 强约束：必须有中文维基条目（=中文世界认可的知名度，有搜索量，且条目标题=权威中文名）
# 按 sitelinks（被多少语言维基收录）降序 = 知名度优先
QUERY = """
SELECT ?person ?ruLabel ?genderLabel ?birth ?death ?descZh ?descEn ?article ?sitelinks WHERE {{
  ?person wdt:P31 wd:Q5 .
  ?person rdfs:label ?ruLabel . FILTER(LANG(?ruLabel) = "ru")
  {{ ?person wdt:P27 wd:Q159 . }} UNION
  {{ ?person wdt:P27 wd:Q15180 . }} UNION
  {{ ?person wdt:P27 wd:Q34266 . }}
  ?article schema:about ?person ; schema:isPartOf <https://zh.wikipedia.org/> .
  ?person wikibase:sitelinks ?sitelinks .
  OPTIONAL {{ ?person wdt:P21 ?g . ?g rdfs:label ?genderLabel . FILTER(LANG(?genderLabel) = "en") }}
  OPTIONAL {{ ?person wdt:P569 ?bd . BIND(YEAR(?bd) AS ?birth) }}
  OPTIONAL {{ ?person wdt:P570 ?dd . BIND(YEAR(?dd) AS ?death) }}
  OPTIONAL {{ ?person schema:description ?descZh . FILTER(LANG(?descZh) = "zh") }}
  OPTIONAL {{ ?person schema:description ?descEn . FILTER(LANG(?descEn) = "en") }}
}}
ORDER BY DESC(?sitelinks) ?person
LIMIT {limit} OFFSET {offset}
"""


def query(offset, limit):
    sparql = QUERY.format(limit=limit, offset=offset)
    params = urllib.parse.urlencode({"query": sparql, "format": "json"})
    req = urllib.request.Request(
        f"{ENDPOINT}?{params}",
        headers={"User-Agent": UA, "Accept": "application/sparql-results+json"},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def gender_code(label):
    if not label:
        return ""
    l = label.lower()
    if "female" in l or "woman" in l or "girl" in l:
        return "F"
    if "male" in l or "man" in l or "boy" in l:
        return "M"
    return ""


def qid_from_uri(uri):
    return uri.rsplit("/", 1)[-1]  # http://www.wikidata.org/entity/Q7747 -> Q7747


# 中文名应跳过的非条目前缀（分类/模板/帮助页等）
BAD_PREFIX = ("Category:", "Template:", "Wikipedia:", "Help:", "Portal:",
              "分类:", "模板:", "Module:")


def zh_name_from_article(article_url):
    """从中文维基条目 URL 取规范中文名（条目标题=最权威译名）。"""
    # https://zh.wikipedia.org/wiki/%E7%93%A6... -> 瓦西里·涅边贾
    title = urllib.parse.unquote(article_url.rsplit("/wiki/", 1)[-1])
    title = title.replace("_", " ").strip()
    if any(title.startswith(p) for p in BAD_PREFIX):
        return ""
    return title


def parse_rows(data, store):
    """合并到 store（按 QID 去重，多行取首个非空值）。返回本批新增的 QID 数。"""
    new = 0
    for b in data["results"]["bindings"]:
        qid = qid_from_uri(b["person"]["value"])
        article = b.get("article", {}).get("value", "")
        zh = zh_name_from_article(article) if article else ""
        if not zh:
            continue  # 无干净中文条目名则跳过（脏数据 / 分类页）
        if qid not in store:
            try:
                sitelinks = int(b.get("sitelinks", {}).get("value", "0"))
            except ValueError:
                sitelinks = 0
            store[qid] = {
                "qid": qid,
                "ru": b.get("ruLabel", {}).get("value", ""),
                "zh": zh,
                "gender": gender_code(b.get("genderLabel", {}).get("value", "")),
                "birth": None,
                "death": None,
                "descZh": "",
                "descEn": "",
                "wiki": article,
                "sitelinks": sitelinks,
            }
            new += 1
        rec = store[qid]
        if not rec["birth"] and "birth" in b:
            try:
                rec["birth"] = int(b["birth"]["value"])
            except (ValueError, KeyError):
                pass
        if not rec["death"] and "death" in b:
            try:
                rec["death"] = int(b["death"]["value"])
            except (ValueError, KeyError):
                pass
        if not rec["descZh"] and "descZh" in b:
            rec["descZh"] = b["descZh"]["value"]
        if not rec["descEn"] and "descEn" in b:
            rec["descEn"] = b["descEn"]["value"]
    return new


def main():
    test = "--test" in sys.argv

    if test:
        print("== 测试模式：抓 50 条样本 ==")
        data = query(0, 50)
        store = {}
        parse_rows(data, store)
        sample = sorted(store.values(), key=lambda r: -r["sitelinks"])[:15]
        for r in sample:
            yrs = f"{r['birth'] or '?'}–{r['death'] or ''}"
            print(f"  [{r['sitelinks']:>3} wiki] {r['ru']}  →  {r['zh']}  ({yrs}) {r['gender']}")
            print(f"      desc: {r['descZh'] or r['descEn'] or '—'}")
        print(f"\n本批解析 {len(store)} 人。字段验证完成。")
        return

    store = {}
    offset = 0
    print(f"全量抓取（batch={BATCH}）...")
    while True:
        try:
            data = query(offset, BATCH)
        except Exception as e:
            print(f"  offset={offset} ERROR: {e}  —— 停止，保存已抓取部分")
            break
        n = len(data["results"]["bindings"])
        new = parse_rows(data, store)
        print(f"  offset={offset}: 返回 {n} 行，累计 {len(store)} 人（新增 {new}）")
        if n < BATCH:
            break  # 最后一批
        offset += BATCH
        time.sleep(SLEEP)

    records = sorted(store.values(), key=lambda r: r["ru"])
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=0)

    # 统计
    with_zh_desc = sum(1 for r in records if r["descZh"])
    with_wiki = sum(1 for r in records if r["wiki"])
    with_birth = sum(1 for r in records if r["birth"])
    print(f"\n完成：{len(records)} 人 → {OUT}")
    print(f"  有中文 description: {with_zh_desc} ({100*with_zh_desc//max(len(records),1)}%)")
    print(f"  有中文 wiki 链接:   {with_wiki} ({100*with_wiki//max(len(records),1)}%)")
    print(f"  有生年:             {with_birth} ({100*with_birth//max(len(records),1)}%)")


if __name__ == "__main__":
    main()
