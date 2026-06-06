# 俄语教名词典数据来源

- **文件**：`given_names.json`（1230 行 / 282 个教名）
- **来源**：tingroom 俄语学习网「俄语男女名字全集」
  https://ru.tingroom.com/wap/index.php?moduleid=28&itemid=105
- **抓取/解析**：`scripts/ru_given/parse.js`（curl 源站 HTML → 解析）
- **性质**：俄语教名 ↔ 中文音译对照（新华社标准音译惯例），属事实性参考数据，非原创表达。已重新结构化，未复制原页版式。

## 字段
| 字段 | 说明 |
|------|------|
| `russian` | 俄文形式 |
| `chinese` | 中文音译 |
| `kind` | `formal`(教名) / `patronymic_m`(父名,-ович/-евич/-ич) / `patronymic_f`(女性父名,-овна/-евна/-ична) / `diminutive`(小名·爱称) |
| `root` | 所属教名（headword） |
| `gender` | `f` 女名段 / `m` 男名段（= root 的归属段） |

## 分布
formal 281 · patronymic_m 242 · patronymic_f 208 · diminutive 499

## 状态
🟢 **已上线（2026-06-05）**：作为**静态字典**接入 /ru 逐词直译引擎（不入 Turso）。
- `lib/ruDict.ts` 直接 import 本 JSON → 正/反查 Map。
- /ru 改为逐词直译：输入按空格切词，每词查中文行内直给（详见 decisions.md「/ru 逐词直译」）。
- 查词优先级：本字典 → russian_names 现表精确兜底(姓氏/名人,只读) → 俄语音译兜底(标"推测")。
