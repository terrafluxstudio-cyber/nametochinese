// 汉语拼音音节 → 威妥玛式（Wade-Giles）转换
// 威妥玛存在不规则（空韵 -i、e/o 区分、uo 变体等），用 EXCEPTIONS 表逐条核对兜底，
// 其余走声母 + 韵母规则。数据准确性第一：拿不准的音节一律进例外表。

// 声母映射（拼音 → 威妥玛）
const INITIALS: Record<string, string> = {
  b: 'p', p: "p'", m: 'm', f: 'f',
  d: 't', t: "t'", n: 'n', l: 'l',
  g: 'k', k: "k'", h: 'h',
  j: 'ch', q: "ch'", x: 'hs',
  zh: 'ch', ch: "ch'", sh: 'sh', r: 'j',
  z: 'ts', c: "ts'", s: 's',
};

// 韵母映射（拼音 → 威妥玛）
const FINALS: Record<string, string> = {
  a: 'a', ai: 'ai', an: 'an', ang: 'ang', ao: 'ao',
  o: 'o', ou: 'ou', ong: 'ung',
  e: 'e', ei: 'ei', en: 'en', eng: 'eng', er: 'erh',
  i: 'i', ia: 'ia', ian: 'ien', iang: 'iang', iao: 'iao',
  ie: 'ieh', in: 'in', ing: 'ing', iong: 'iung', iu: 'iu',
  u: 'u', ua: 'ua', uai: 'uai', uan: 'uan', uang: 'uang',
  uo: 'o', ui: 'ui', un: 'un', ueng: 'ueng',
  'ü': 'ü', 'üan': 'üan', 'üe': 'üeh', 'ün': 'ün',
  v: 'ü', van: 'üan', ve: 'üeh', vn: 'ün', // pinyin-pro 可能用 v 代 ü
};

// 不规则整音节（拼音无调 → 威妥玛），优先级最高
const EXCEPTIONS: Record<string, string> = {
  // 空韵 -i
  zhi: 'chih', chi: "ch'ih", shi: 'shih', ri: 'jih',
  zi: 'tzu', ci: "tz'u", si: 'ssu',
  // g/k/h 后 e → o
  ge: 'ko', ke: "k'o", he: 'ho',
  // uo 在 g/k/h/sh 后保留 u（其余 uo→o 由规则处理）
  guo: 'kuo', kuo: "k'uo", huo: 'huo', shuo: 'shuo',
  // 整体认读音节（y/w 开头，无声母）
  yi: 'i', ya: 'ya', yao: 'yao', ye: 'yeh', you: 'yu',
  yan: 'yen', yin: 'yin', yang: 'yang', ying: 'ying',
  yong: 'yung', yu: 'yü', yue: 'yüeh', yuan: 'yüan',
  yun: 'yün', yo: 'yo',
  wu: 'wu', wa: 'wa', wo: 'wo', wai: 'wai', wei: 'wei',
  wan: 'wan', wen: 'wen', wang: 'wang', weng: 'weng',
  // 其他常见不规则
  er: 'erh', en: 'en', e: 'o', // 单独的 e（如"恩"为 en，"额/俄"为 o）
  eng: 'eng', ei: 'ei', ai: 'ai', ao: 'ao', an: 'an', ang: 'ang', ou: 'ou',
  // r 声母组（r→j）部分韵母
  re: 'je', ruo: 'jo', rui: 'jui', run: 'jun', rong: 'jung',
};

/** 单个拼音音节（无声调、小写）→ 威妥玛 */
export function syllableToWade(py: string): string {
  const s = py.toLowerCase().trim();
  if (!s) return '';
  // 1. 例外表优先
  if (EXCEPTIONS[s]) return EXCEPTIONS[s];

  // 2. 拆声母（双字母 zh/ch/sh 优先）+ 韵母
  let initial = '';
  let final = s;
  const two = s.slice(0, 2);
  if (['zh', 'ch', 'sh'].includes(two)) {
    initial = two;
    final = s.slice(2);
  } else if (INITIALS[s[0]] !== undefined) {
    initial = s[0];
    final = s.slice(1);
  }

  const wInitial = initial ? (INITIALS[initial] ?? '') : '';
  const wFinal = FINALS[final];

  // 韵母查不到：回退原拼音（避免给错）
  if (wFinal === undefined) return s;

  // j/q/x 后的 ü 写法：拼音 ju/qu/xu 的 u 实为 ü，但威妥玛 chü/ch'ü/hsü
  // pinyin-pro 输出 ju/qu/xu，需特殊处理
  if (['j', 'q', 'x'].includes(initial)) {
    if (final === 'u') return wInitial + 'ü';
    if (final === 'un') return wInitial + 'ün';
    if (final === 'uan') return wInitial + 'üan';
    if (final === 'ue') return wInitial + 'üeh';
  }

  return wInitial + wFinal;
}

/**
 * 整段姓名转威妥玛。
 * syllables: 各字的无调拼音数组（姓在前）。
 * 威妥玛人名惯例：姓 名-名（首字母大写，名各音节连字符连，连字符后小写）。
 */
export function nameToWade(syllables: string[]): string {
  const wade = syllables.map(syllableToWade);
  if (wade.length === 0) return '';
  const cap = (w: string) => (w ? w[0].toUpperCase() + w.slice(1) : w);
  const surname = cap(wade[0]);
  if (wade.length === 1) return surname;
  const given = wade.slice(1).map((w, i) => (i === 0 ? cap(w) : w.toLowerCase())).join('-');
  return `${surname} ${given}`;
}
