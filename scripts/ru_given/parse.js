// 解析 tingroom 俄语男女名字全集 → 结构化 (russian, chinese, kind, root, gender)
// kind: formal(教名) | patronymic_m(父名,-ович/-евич/-ич) | patronymic_f(女性父名,-овна/-евна/-ична)
//      | diminutive(小名/爱称)
const fs = require('fs');

const t = fs.readFileSync('/tmp/ru_names.txt', 'utf8');
const maleStart = t.indexOf('1. Абрам');
const femaleText = t.slice(0, maleStart);
const maleText = t.slice(maleStart);

function entries(block) {
  return block.split(/(?:^|\n)\s*\d+\s*\.\s*/).map((s) => s.trim()).filter(Boolean);
}

const CYR = 'Ѐ-ӿ';
const HAN = '\\u4e00-\\u9fff';
const reCyr = new RegExp(`^[${CYR}=]+$`);
const isHanStart = (s) => /^[一-鿿…]/.test(s);

// 括号内"俄中粘连"子串 → {ru,zh}（用于女性父名等）
function splitGlued(content) {
  const out = [];
  for (const w of content.split(/\s+/).filter(Boolean)) {
    const m = w.match(new RegExp(`^([${CYR}=]+)([${HAN}…][${HAN}…]*)$`));
    if (m) out.push({ ru: m[1].replace(/=/g, ''), zh: m[2] });
  }
  return out;
}

function classifyNormal(ru, isHead) {
  if (isHead) return 'formal';
  if (/(ович|евич|иевич|ьевич|ьич|ич)$/.test(ru)) return 'patronymic_m';
  if (/(овна|евна|иевна|ьевна|ична|инична)$/.test(ru)) return 'patronymic_f';
  return 'diminutive';
}

function parseEntry(entry, gender, rows) {
  // 1) 先抽括号内含西里尔的（粘连）→ patronymic_f，并从文本中抹掉这些括号
  let work = entry;
  const reGlued = new RegExp(`[（(]\\s*([${CYR}][^（）()]*?)\\s*[）)]`, 'g');
  let m;
  const gluedPairs = [];
  while ((m = reGlued.exec(entry))) {
    if (/[一-鿿]/.test(m[1])) gluedPairs.push(...splitGlued(m[1]));
  }
  work = entry.replace(reGlued, (full, inner) =>
    /[一-鿿]/.test(inner) && reCyr.test(inner.split(/\s+/)[0].replace(/[一-鿿….]/g, '') || 'x') ? ' ' : full
  );
  // 上面替换条件复杂，简化：直接把"含西里尔且含汉字"的括号全部移除
  work = entry.replace(reGlued, (full, inner) => (/[一-鿿]/.test(inner) ? ' ' : full));

  // 2) 抽普通 俄(中)：括号内以汉字开头
  const reNorm = new RegExp(
    `([${CYR}][${CYR}\\s或=,，]*?)\\s*[（(]\\s*([${HAN}…][^（）()]*?)\\s*[）)]`,
    'g'
  );
  const normPairs = [];
  while ((m = reNorm.exec(work))) {
    let left = m[1].replace(/父名[:：]?/g, '').trim();
    const right = m[2].trim();
    const ls = left.split(/\s*[或=,，]\s*/).map((s) => s.trim()).filter(Boolean);
    const rs = right.split(/\s*[或=、,，]\s*/).map((s) => s.trim()).filter(Boolean);
    const lastTok = (s) => s.split(/\s+/).filter(Boolean).pop();
    if (ls.length > 1 && ls.length === rs.length) {
      for (let i = 0; i < ls.length; i++) normPairs.push({ ru: lastTok(ls[i]), zh: rs[i] });
    } else if (ls.length > 1 && rs.length === 1) {
      // 多个俄文共享同一中文（А或Б(单中)）→ 全部映射
      for (const l of ls) normPairs.push({ ru: lastTok(l), zh: rs[0] });
    } else {
      normPairs.push({ ru: lastTok(left), zh: right });
    }
  }

  if (!normPairs.length) return;
  const root = normPairs[0].ru;
  normPairs.forEach((p, i) => {
    rows.push({ russian: p.ru, chinese: p.zh, kind: classifyNormal(p.ru, i === 0), root, gender });
  });
  gluedPairs.forEach((p) => {
    rows.push({ russian: p.ru, chinese: p.zh, kind: 'patronymic_f', root, gender });
  });
}

const rows = [];
for (const e of entries(femaleText)) parseEntry(e, 'f', rows);
for (const e of entries(maleText)) parseEntry(e, 'm', rows);

// 去重
const seen = new Set();
const all = rows.filter((r) => {
  if (!r.russian || !/[Ѐ-ӿ]/.test(r.russian)) return false;
  const k = r.russian + '|' + r.chinese + '|' + r.kind;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

fs.writeFileSync('data/russian/given_names.json', JSON.stringify(all, null, 1));

const by = (k) => all.filter((r) => r.kind === k).length;
console.log('女名条目:', entries(femaleText).length, ' 男名条目:', entries(maleText).length);
console.log('总行:', all.length);
console.log('  formal:', by('formal'), ' patr_m:', by('patronymic_m'), ' patr_f:', by('patronymic_f'), ' dimin:', by('diminutive'));
console.log('\n抽查:');
['Авдотьюшка', 'Саша', 'Владимирович', 'Петровна', 'Александровна', 'Александр', 'Анна', 'Лина', 'Кузьмич'].forEach((q) => {
  console.log(' ', q, '→', JSON.stringify(all.filter((r) => r.russian === q)));
});
