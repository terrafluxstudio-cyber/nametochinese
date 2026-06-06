// 俄语人名逐词字典，用于 /ru「一字一查」直译引擎：输入按词查中文。
// 两层数据：
//  · 教名/父名/爱称 given_names.json（tingroom，新华社标准音译）—— 优先
//  · 姓氏 surnames.json（Wikidata 知名俄籍人物对齐+繁转简+碰撞去错+人工正名）—— 兜底
import rows from '@/data/russian/given_names.json';
import surnames from '@/data/russian/surnames.json';

type Row = { russian: string; chinese: string; kind: string; root: string; gender: string };
type Sur = { russian: string; chinese: string };

const fwd = new Map<string, string[]>(); // 俄(小写) → [中文…] 去重
const rev = new Map<string, string[]>(); // 中文 → [俄…] 去重

function push(map: Map<string, string[]>, key: string, val: string) {
  const arr = map.get(key);
  if (arr) {
    if (!arr.includes(val)) arr.push(val);
  } else map.set(key, [val]);
}

// 先灌教名层（优先级高，先入数组靠前）
for (const r of rows as Row[]) {
  if (!r.russian || !r.chinese) continue;
  push(fwd, r.russian.toLowerCase(), r.chinese);
  push(rev, r.chinese, r.russian);
}
// 再灌姓氏层（教名已有则追加在后，作为次选）
for (const s of surnames as Sur[]) {
  if (!s.russian || !s.chinese) continue;
  push(fwd, s.russian.toLowerCase(), s.chinese);
  push(rev, s.chinese, s.russian);
}

/** 俄文词 → 中文候选（去重，可能多读音如 Саша→萨莎/萨沙）。无则 null */
export function ruToZh(token: string): string[] | null {
  return fwd.get(token.toLowerCase()) ?? null;
}

/** 中文 → 俄文候选。无则 null */
export function zhToRu(token: string): string[] | null {
  return rev.get(token) ?? null;
}

export const RU_DICT_SIZE = fwd.size;
