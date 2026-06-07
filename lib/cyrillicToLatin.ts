// 西里尔字母 → 拉丁转写（BGN/PCGN 简化版，贴近英文媒体常用拼法）。
// 用于俄语名人页的 URL slug：Толстой → tolstoy、Лавров → lavrov、Путин → putin。
// slug 不要求 100% 标准转写（页面内容才是搜索匹配主力），可读可输入即可。

const MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
  ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

/** 单个俄文词 → 拉丁（小写） */
export function cyrillicToLatin(text: string): string {
  let s = text.toLowerCase();
  // 词尾 -ский/-ской → -sky（约定俗成，比规则 -skiy 更常见）
  s = s.replace(/ский$/g, '<<sky>>').replace(/ской$/g, '<<skoy>>');
  let out = '';
  for (const ch of s) {
    if (ch === '<' || ch === '>') { out += ch; continue; }
    out += MAP[ch] ?? ch;
  }
  out = out.replace(/<<sky>>/g, 'sky').replace(/<<skoy>>/g, 'skoy');
  return out;
}

/** 转成 URL slug：拉丁化 + 只留 a-z0-9，空格/分隔转连字符 */
export function toSlug(ruSurname: string): string {
  const latin = cyrillicToLatin(ruSurname.trim());
  return latin
    .replace(/[^a-z0-9]+/g, '-')   // 非字母数字 → 连字符
    .replace(/^-+|-+$/g, '')        // 去首尾连字符
    || 'x';
}
