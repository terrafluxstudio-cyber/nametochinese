// 定稿俄语姓氏词典：碰撞去错 + 繁转简 + 人工正名/补名人。
// 输入 surnames.raw.json([{russian,chinese,n}]) → 输出 surnames.json([{russian,chinese}])
import { readFileSync, writeFileSync } from 'fs';
import * as OpenCC from 'opencc-js';

const conv = OpenCC.Converter({ from: 'tw', to: 'cn' });
const raw = JSON.parse(readFileSync('data/russian/surnames.raw.json', 'utf8'));

// 碰撞检测：每个中文的最高频"拥有者"
const owner = {};
for (const x of raw) {
  if (!owner[x.chinese] || x.n > owner[x.chinese].n) owner[x.chinese] = { ru: x.russian, n: x.n };
}

const map = {};
for (const x of raw) {
  const o = owner[x.chinese];
  // 该中文被另一个更高频的姓占用 → 本条是误配，丢弃
  if (o.ru !== x.russian && o.n > x.n) continue;
  map[x.russian] = conv(x.chinese);
}

// 人工正名 / 补单段中文被跳过的名人（新华社标准，覆盖自动结果）
const CORR = {
  'Смирнов': '斯米尔诺夫', 'Смирнова': '斯米尔诺娃',
  'Ленин': '列宁', 'Достоевский': '陀思妥耶夫斯基', 'Чайковский': '柴可夫斯基',
  'Брежнев': '勃列日涅夫', 'Медведев': '梅德韦杰夫', 'Горбачёв': '戈尔巴乔夫',
  'Солженицын': '索尔仁尼琴', 'Ельцин': '叶利钦', 'Хрущёв': '赫鲁晓夫',
  'Сталин': '斯大林', 'Путин': '普京', 'Кузнецов': '库兹涅佐夫', 'Кузнецова': '库兹涅佐娃',
};
for (const [ru, zh] of Object.entries(CORR)) map[ru] = zh;

const out = Object.entries(map)
  .map(([russian, chinese]) => ({ russian, chinese }))
  .sort((a, b) => a.russian.localeCompare(b.russian, 'ru'));

writeFileSync('data/russian/surnames.json', JSON.stringify(out, null, 0));
console.log('raw:', raw.length, '→ final:', out.length, '(碰撞丢弃', raw.length - Object.keys(map).length + Object.keys(CORR).length, ')');
