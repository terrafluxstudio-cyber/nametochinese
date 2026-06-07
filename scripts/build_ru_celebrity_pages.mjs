// 把 Wikidata 抓来的俄语名人原始数据加工成「同名聚合页」数据。
// 输入: data/russian/celebrities.json (2159 人原始)
// 输出: data/russian/celebrity_groups.json (按中文姓聚合 + 简介已处理)
//
// 处理: 繁→简统一(opencc) / 按中文姓(中文名末段)聚合 / 简介三级 fallback
//       (中文desc转简 → 英文desc翻译 → 生卒兜底) / 按知名度排序

import fs from 'fs';
import { Converter } from 'opencc-js';

const t2s = Converter({ from: 't', to: 'cn' });

// 英文 description 翻译表（Wikidata 英文 desc 格式规整: "[国籍] [职业] [(年-年)]"）
const NATION = {
  russian: '俄罗斯', soviet: '苏联', 'russian empire': '俄罗斯帝国',
  ukrainian: '乌克兰', polish: '波兰', german: '德国', french: '法国',
  swiss: '瑞士', armenian: '亚美尼亚', georgian: '格鲁吉亚', jewish: '犹太',
  belarusian: '白俄罗斯', kazakh: '哈萨克', azerbaijani: '阿塞拜疆',
};
const OCC = {
  politician: '政治家', statesman: '政治家', writer: '作家', author: '作家',
  poet: '诗人', novelist: '小说家', playwright: '剧作家', actor: '演员',
  actress: '女演员', composer: '作曲家', musician: '音乐家', pianist: '钢琴家',
  conductor: '指挥家', singer: '歌手', scientist: '科学家', physicist: '物理学家',
  chemist: '化学家', mathematician: '数学家', biologist: '生物学家',
  painter: '画家', artist: '艺术家', sculptor: '雕塑家', architect: '建筑师',
  'film director': '电影导演', director: '导演', producer: '制片人',
  journalist: '记者', diplomat: '外交官', general: '将军', admiral: '海军上将',
  'military officer': '军官', officer: '军官', commander: '指挥官',
  'chess player': '国际象棋棋手', cosmonaut: '宇航员', astronaut: '宇航员',
  revolutionary: '革命家', economist: '经济学家', historian: '历史学家',
  philosopher: '哲学家', mathematician_: '数学家', athlete: '运动员',
  footballer: '足球运动员', 'football player': '足球运动员',
  'ice hockey player': '冰球运动员', 'figure skater': '花样滑冰运动员',
  gymnast: '体操运动员', boxer: '拳击手', wrestler: '摔跤运动员',
  swimmer: '游泳运动员', 'tennis player': '网球运动员', engineer: '工程师',
  inventor: '发明家', businessman: '商人', entrepreneur: '企业家',
  lawyer: '律师', physician: '医师', psychologist: '心理学家',
  linguist: '语言学家', geographer: '地理学家', astronomer: '天文学家',
  'religious figure': '宗教人物', priest: '神父', bishop: '主教',
  monarch: '君主', emperor: '皇帝', empress: '皇后', tsar: '沙皇',
  noble: '贵族', aristocrat: '贵族', ballet: '芭蕾舞演员',
  'ballet dancer': '芭蕾舞演员', dancer: '舞者', model: '模特',
  'singer-songwriter': '创作歌手', rapper: '说唱歌手', dj: 'DJ',
  'voice actress': '配音女演员', 'voice actor': '配音演员',
  spy: '间谍', cosmonaut_: '宇航员',
};

/** 翻译英文 description → 中文（拼"国籍+职业"），翻不全则返回 null */
function translateEnDesc(en) {
  if (!en) return null;
  let s = en.toLowerCase().replace(/\([^)]*\)/g, '').trim(); // 去年份括号
  s = s.replace(/\b(and|,|;)\b/g, ' ').replace(/\s+/g, ' ').trim();
  // 匹配国籍（可能多个，取第一个命中）
  let nation = '';
  for (const [en2, zh] of Object.entries(NATION)) {
    if (s.includes(en2)) { nation = zh; s = s.replace(en2, '').trim(); break; }
  }
  // 匹配职业（按长词优先，避免 director 误吃 film director）
  const occKeys = Object.keys(OCC).sort((a, b) => b.length - a.length);
  const found = [];
  for (const k of occKeys) {
    const kk = k.replace(/_$/, '');
    if (s.includes(kk) && !found.some(f => f.includes(OCC[k]) || OCC[k].includes(f))) {
      found.push(OCC[k]);
      if (found.length >= 2) break;
    }
  }
  if (!nation && !found.length) return null;
  return (nation + found.join('、')).trim() || null;
}

/** 生成一句话简介：中文desc(转简) → 英文desc翻译 → 生卒兜底 */
function buildBio(rec) {
  if (rec.descZh) {
    // 去掉 desc 里重复的生卒（如"俄国作家（1828－1910）"），保留身份
    return t2s(rec.descZh).replace(/[（(][\d\-－—\s年]+[)）]\s*$/, '').trim();
  }
  const tr = translateEnDesc(rec.descEn);
  if (tr) return tr;
  // 兜底：国籍+人物
  return '俄罗斯／苏联人物';
}

/** 中文姓 = 中文名最后一个·后的段（中文维基标题不含父称） */
function zhSurname(zh) {
  const parts = zh.split(/[·・·]/);
  return (parts.length > 1 ? parts[parts.length - 1] : zh).trim();
}

/** 俄文姓 = 俄文全名末词 */
function ruSurname(ru) {
  const w = ru.trim().split(/\s+/);
  return w[w.length - 1] || ru;
}

const raw = JSON.parse(fs.readFileSync('data/russian/celebrities.json', 'utf8'));

// 加工每个人
const people = raw.map(r => {
  const zh = t2s(r.zh).trim();
  return {
    qid: r.qid,
    zh,
    ru: r.ru,
    surname: zhSurname(zh),
    ruSurname: ruSurname(r.ru),
    gender: r.gender,
    birth: r.birth,
    death: r.death,
    bio: buildBio(r),
    wiki: r.wiki,
    sitelinks: r.sitelinks,
  };
});

// 按中文姓聚合
const groups = {};
for (const p of people) {
  if (!groups[p.surname]) {
    groups[p.surname] = { surname: p.surname, ruSurname: p.ruSurname, people: [] };
  }
  groups[p.surname].people.push(p);
}
// 每组内按知名度降序；组按"最高知名度"降序（热门姓在前）
for (const g of Object.values(groups)) {
  g.people.sort((a, b) => b.sitelinks - a.sitelinks);
  g.topSitelinks = g.people[0].sitelinks;
  g.count = g.people.length;
}

const out = Object.values(groups).sort((a, b) => b.topSitelinks - a.topSitelinks);
fs.writeFileSync('data/russian/celebrity_groups.json', JSON.stringify(out));

// 统计
const multi = out.filter(g => g.count >= 2);
const bioFromZh = people.filter(p => raw.find(r => r.qid === p.qid)?.descZh).length;
const bioFromEn = people.filter(p => {
  const r = raw.find(r => r.qid === p.qid);
  return !r?.descZh && translateEnDesc(r?.descEn);
}).length;
const bioFallback = people.length - bioFromZh - bioFromEn;
console.log(`聚合: ${out.length} 个姓页 (${multi.length} 个多人姓, ${out.length - multi.length} 单人)`);
console.log(`简介来源: 中文desc ${bioFromZh} / 英文译 ${bioFromEn} / 兜底 ${bioFallback}`);
console.log('\n样本（前5个热门姓页）:');
for (const g of out.slice(0, 5)) {
  console.log(`\n  /ru/name/${g.surname}  (${g.count}人, ${g.ruSurname})`);
  for (const p of g.people.slice(0, 3)) {
    console.log(`    ${p.zh} (${p.birth || '?'}–${p.death || ''}) — ${p.bio}`);
  }
}
