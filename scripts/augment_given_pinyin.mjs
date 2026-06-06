// 补全 data/given_pinyin.json：原数据漏了大量超常用给名字（如 伟/杰/俊/强…）。
// 用 pinyin-pro 注音，把常用字按高频并入，缺字时补、已存在则取较高 freq。
import { readFileSync, writeFileSync } from 'fs';
import { pinyin } from 'pinyin-pro';

const path = './data/given_pinyin.json';
const map = JSON.parse(readFileSync(path, 'utf8'));

// 常用给名字（男+女，按大致常见度排列；越靠前 freq 越高）
const COMMON = (
  '伟杰俊强磊军勇涛明华平刚健文辉力宇浩鑫鹏飞鸿斌博超群波辉刚毅俊峰' +
  '世广义兴良海山仁波宁贵福生龙元全国胜学祥才发武新利清飞彬富顺信子' +
  '杰柏德彪德麟松健坤梓睿浩宇泽轩豪宸熙皓昊瑞嘉锦鸣俊楠桦栋梁榕霖' +
  '芳娜敏静丽秀娟英华慧巧美娟婷雪琳颖红玉萍燕艳倩霞香月莺媛瑞凡佳嘉' +
  '琼芬茜秋珊莎锦黛青倩婷桂娣叶璧璐娅琦晶妍茜秋珊莎丹蓉眉君琴蕊薇菁' +
  '梦岚苑筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜可姬舒影荔枝思丽秀娟英梅琳' +
  '晨涵雅欣怡萱诗梓桐玥彤兮宁安乐成志强'
).split('');

const seen = new Set();
let added = 0;
COMMON.forEach((ch, i) => {
  if (seen.has(ch)) return;
  seen.add(ch);
  const py = pinyin(ch, { toneType: 'none', type: 'array' })[0];
  if (!py || !/^[a-z]+$/.test(py)) return;
  const freq = 9000 - i * 20; // 常用字给高 freq，越靠前越高
  const arr = (map[py] = map[py] || []);
  const exist = arr.find((c) => c.char === ch);
  if (exist) {
    if (freq > exist.freq) exist.freq = freq;
  } else {
    arr.push({ char: ch, freq });
    added++;
  }
  arr.sort((a, b) => b.freq - a.freq);
});

writeFileSync(path, JSON.stringify(map, null, 0));
console.log('补入新字:', added, ' 现 wei:', JSON.stringify(map['wei']?.slice(0, 5)));
console.log('jun:', JSON.stringify(map['jun']?.slice(0, 5)));
