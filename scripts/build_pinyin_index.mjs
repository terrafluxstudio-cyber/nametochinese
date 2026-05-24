import { createClient } from '@libsql/client';
import { writeFileSync, mkdirSync } from 'fs';
import { pinyin } from 'pinyin';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

mkdirSync('./data', { recursive: true });

console.log('查询中文人名...');
// nationality 字段多为「法/日/俄」等国别简称，不能用 LIKE '%中%'（会命中「中非」）
const result = await db.execute({
  sql: `SELECT chinese FROM persons
        WHERE chinese IS NOT NULL
          AND length(chinese) BETWEEN 2 AND 5
          AND chinese GLOB '[一-龥]*'
          AND chinese NOT GLOB '*[A-Za-z0-9]*'
        LIMIT 200000`,
  args: [],
});

const names = result.rows.map((r) => r.chinese).filter(Boolean);
console.log(`共 ${names.length} 条中文人名`);

// persons 多为外文音译，首字未必是真姓氏；用百家姓补强姓→拼音映射
const BAIJIAXING =
  '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴鬱胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍卻璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公';

const surnameFreq = new Map();
const givenCharFreq = new Map();

for (const name of names) {
  if (!name || name.length < 2) continue;
  const surname = name[0];
  const given = name.slice(1);

  surnameFreq.set(surname, (surnameFreq.get(surname) || 0) + 1);
  for (const char of given) {
    givenCharFreq.set(char, (givenCharFreq.get(char) || 0) + 1);
  }
}

const surnamePinyinMap = {};
for (const [char, freq] of surnameFreq.entries()) {
  const py = pinyin(char, { style: pinyin.STYLE_NORMAL })[0]?.[0];
  if (!py) continue;
  if (!surnamePinyinMap[py]) surnamePinyinMap[py] = [];
  surnamePinyinMap[py].push({ char, freq });
}
for (const [i, char] of [...BAIJIAXING].entries()) {
  const boost = 50_000 - i;
  const readings = pinyin(char, { style: pinyin.STYLE_NORMAL, heteronym: true });
  const syllables = new Set(readings.flat().filter(Boolean));
  for (const py of syllables) {
    if (!surnamePinyinMap[py]) surnamePinyinMap[py] = [];
    const row = surnamePinyinMap[py].find((x) => x.char === char);
    if (row) row.freq = Math.max(row.freq, boost);
    else surnamePinyinMap[py].push({ char, freq: boost });
  }
}
for (const py of Object.keys(surnamePinyinMap)) {
  surnamePinyinMap[py].sort((a, b) => b.freq - a.freq);
}

const givenPinyinMap = {};
for (const [char, freq] of givenCharFreq.entries()) {
  if (freq < 5) continue;
  const py = pinyin(char, { style: pinyin.STYLE_NORMAL })[0]?.[0];
  if (!py) continue;
  if (!givenPinyinMap[py]) givenPinyinMap[py] = [];
  givenPinyinMap[py].push({ char, freq });
}
for (const py of Object.keys(givenPinyinMap)) {
  givenPinyinMap[py].sort((a, b) => b.freq - a.freq);
  givenPinyinMap[py] = givenPinyinMap[py].slice(0, 15);
}

writeFileSync('./data/surname_pinyin.json', JSON.stringify(surnamePinyinMap, null, 2));
writeFileSync('./data/given_pinyin.json', JSON.stringify(givenPinyinMap, null, 2));

console.log(`姓拼音种类：${Object.keys(surnamePinyinMap).length}`);
console.log(`名字拼音种类：${Object.keys(givenPinyinMap).length}`);
console.log('示例 zhang →', surnamePinyinMap['zhang']?.slice(0, 5));
console.log('示例 wei →', givenPinyinMap['wei']?.slice(0, 5));
