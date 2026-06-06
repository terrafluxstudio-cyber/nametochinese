"""
Fetch Russian person names (Cyrillic) + Chinese translations from Wikidata.
Output: data/russian_wikidata.csv (russian, chinese, gender)
"""

import csv
import time
import urllib.request
import urllib.parse
import json
import sys

SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
BATCH_SIZE = 5000
OUTPUT = "data/russian_wikidata.csv"

QUERY_TEMPLATE = """
SELECT ?ruLabel ?zhLabel ?genderLabel WHERE {{
  {{
    SELECT DISTINCT ?person WHERE {{
      ?person wdt:P31 wd:Q5 .
      {{ ?person wdt:P27 wd:Q159 . }}
      UNION
      {{ ?person wdt:P27 wd:Q15180 . }}
    }}
    LIMIT {limit}
    OFFSET {offset}
  }}
  ?person rdfs:label ?ruLabel . FILTER(LANG(?ruLabel) = "ru")
  ?person rdfs:label ?zhLabel . FILTER(LANG(?zhLabel) = "zh")
  OPTIONAL {{
    ?person wdt:P21 ?g .
    ?g rdfs:label ?genderLabel . FILTER(LANG(?genderLabel) = "en")
  }}
}}
"""


def query_wikidata(offset):
    sparql = QUERY_TEMPLATE.format(limit=BATCH_SIZE, offset=offset)
    params = urllib.parse.urlencode({
        "query": sparql,
        "format": "json"
    })
    url = f"{SPARQL_ENDPOINT}?{params}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "nametochinese-scraper/1.0 (terrafluxstudio@gmail.com)",
        "Accept": "application/sparql-results+json"
    })
    with urllib.request.urlopen(req, timeout=90) as resp:
        return json.loads(resp.read().decode("utf-8"))


def map_gender(label):
    if not label:
        return ""
    l = label.lower()
    if "female" in l or "woman" in l or "girl" in l:
        return "F"
    if "male" in l or "man" in l or "boy" in l:
        return "M"
    return ""


def main():
    seen = set()
    rows = []
    offset = 0

    print(f"Fetching from Wikidata (batch size {BATCH_SIZE})...")

    while True:
        print(f"  offset={offset} ...", end=" ", flush=True)
        try:
            data = query_wikidata(offset)
        except Exception as e:
            print(f"ERROR: {e}")
            print("Stopping early, saving what we have.")
            break

        bindings = data.get("results", {}).get("bindings", [])
        print(f"{len(bindings)} results")

        if not bindings:
            break

        for b in bindings:
            ru = b.get("ruLabel", {}).get("value", "").strip()
            zh = b.get("zhLabel", {}).get("value", "").strip()
            gender = map_gender(b.get("genderLabel", {}).get("value", ""))

            if not ru or not zh:
                continue
            # skip if zh is basically the same as ru (not translated)
            if zh == ru:
                continue
            # skip if zh contains only latin/cyrillic (not actually Chinese)
            if not any('一' <= c <= '鿿' for c in zh):
                continue

            key = ru.lower()
            if key in seen:
                continue
            seen.add(key)
            rows.append((ru, zh, gender))

        if len(bindings) < BATCH_SIZE:
            break

        offset += BATCH_SIZE
        time.sleep(2)  # be polite to Wikidata

    print(f"\nTotal unique entries: {len(rows)}")

    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(["russian", "chinese", "gender"])
        writer.writerows(rows)

    print(f"Saved to {OUTPUT}")


if __name__ == "__main__":
    main()
