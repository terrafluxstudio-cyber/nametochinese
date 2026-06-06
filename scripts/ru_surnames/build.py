"""
俄语姓氏→中文。源：知名俄/苏/俄帝籍人物(sitelinks>=6) 的 ru + zh 标签
(zh.wikipedia 标题跟新华社标准)。姓氏=ru 末词 / zh 末段(·分隔)，按频次取最高频中文。
含逗号格式"Фамилия, Имя"则取逗号前。strict=False 容控制字符。输出 surnames.json。
"""
import urllib.request, urllib.parse, json, time, re, sys
from collections import defaultdict, Counter

EP="https://query.wikidata.org/sparql"
UA={"User-Agent":"nametochinese-scraper/1.0 (terrafluxstudio@gmail.com; small surname dict)",
    "Accept":"application/sparql-results+json"}
Q="""
SELECT ?ruLabel ?zhLabel WHERE {
  ?p wdt:P31 wd:Q5 ; wikibase:sitelinks ?sl .
  { ?p wdt:P27 wd:Q159 } UNION { ?p wdt:P27 wd:Q15180 } UNION { ?p wdt:P27 wd:Q34266 }
  FILTER(?sl >= 6)
  ?p rdfs:label ?ruLabel . FILTER(LANG(?ruLabel)="ru")
  ?p rdfs:label ?zhLabel . FILTER(LANG(?zhLabel)="zh")
}
"""
def fetch():
    url=EP+"?"+urllib.parse.urlencode({"query":Q,"format":"json"})
    for a in range(10):
        try:
            req=urllib.request.Request(url,headers=UA)
            txt=urllib.request.urlopen(req,timeout=240).read().decode("utf-8")
            return json.loads(txt,strict=False)["results"]["bindings"]
        except urllib.error.HTTPError as e:
            print(f"HTTP {e.code} attempt{a} wait70",file=sys.stderr); time.sleep(70)
        except Exception as e:
            print("err",e,"attempt",a,file=sys.stderr); time.sleep(20)
    return None

CYR=re.compile(r"^[А-ЯЁа-яё-]+$")
HAN=re.compile(r"^[一-鿿]+$")
SUFFIX=re.compile(r"(ов|ев|ёв|ин|ын|ский|ской|цкий|цкой|ич|ук|юк|ко| idze|дзе|ян|ова|ева|ёва|ина|ына|ская|цкая)$", re.I)

def pair(ru, zh):
    ru=ru.strip(); zh=zh.strip()
    if "(" in zh or "（" in zh or " " in zh: return None
    if "," in ru:
        head=ru.split(",")[0].strip()
        toks=head.split()
        sru=toks[-1] if toks else head
    else:
        toks=ru.split()
        if len(toks)<2: return None
        sru=toks[-1]
    segs=[s for s in zh.split("·") if s]
    if len(segs)<2: return None
    szh=segs[-1]
    if not CYR.match(sru) or not HAN.match(szh): return None
    if len(sru)<3 or not (2<=len(szh)<=4): return None
    return sru, szh

b=fetch()
if b is None: print("FETCH FAILED"); sys.exit(1)
pairs=defaultdict(Counter)
for it in b:
    p=pair(it["ruLabel"]["value"], it["zhLabel"]["value"])
    if p: pairs[p[0]][p[1]]+=1

out=[]
for sru,c in pairs.items():
    szh,n=c.most_common(1)[0]
    out.append({"russian":sru,"chinese":szh,"n":n})
out.sort(key=lambda x:(-x["n"],x["russian"]))
json.dump(out,open("data/russian/surnames.json","w"),ensure_ascii=False,indent=0)
print(f"DONE persons={len(b)} surnames={len(out)}")
print("top15:",[(o['russian'],o['chinese'],o['n']) for o in out[:15]])
