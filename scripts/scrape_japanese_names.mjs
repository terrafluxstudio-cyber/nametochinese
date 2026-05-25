import { writeFileSync } from 'fs';
import * as OpenCC from 'opencc-js';

const toSimplified = OpenCC.Converter({ from: 'jp', to: 'cn' });

// 抓取维基百科日本常见姓氏列表（含罗马字和汉字）
async function fetchSurnames() {
  const url =
    'https://zh.wikipedia.org/w/api.php?action=parse&page=日本姓氏列表&prop=wikitext&format=json';
  const res = await fetch(url);
  const data = await res.json();
  const wikitext = data.parse?.wikitext?.['*'] ?? '';

  const rows = [];
  const lines = wikitext.split('\n');

  for (const line of lines) {
    // 表格行：| Romaji || 日文汉字 || ...
    const match = line.match(/^\|\s*([A-Za-z]+)\s*\|\|\s*([一-鿿぀-ヿ]+)/);
    if (match) {
      rows.push({
        romaji: match[1].toLowerCase(),
        ja: match[2],
      });
    }
    // 备选：单竖线分隔
    const alt = line.match(/^\|\s*([A-Za-z]+)\s*\|\s*([一-鿿぀-ヿ]+)/);
    if (alt && !match) {
      rows.push({ romaji: alt[1].toLowerCase(), ja: alt[2] });
    }
  }

  return rows;
}

const coreData = [
  { romaji: 'sato', ja: '佐藤' },
  { romaji: 'suzuki', ja: '鈴木' },
  { romaji: 'takahashi', ja: '高橋' },
  { romaji: 'tanaka', ja: '田中' },
  { romaji: 'watanabe', ja: '渡辺' },
  { romaji: 'ito', ja: '伊藤' },
  { romaji: 'yamamoto', ja: '山本' },
  { romaji: 'nakamura', ja: '中村' },
  { romaji: 'kobayashi', ja: '小林' },
  { romaji: 'kato', ja: '加藤' },
  { romaji: 'yoshida', ja: '吉田' },
  { romaji: 'yamada', ja: '山田' },
  { romaji: 'sasaki', ja: '佐々木' },
  { romaji: 'yamaguchi', ja: '山口' },
  { romaji: 'matsumoto', ja: '松本' },
  { romaji: 'inoue', ja: '井上' },
  { romaji: 'kimura', ja: '木村' },
  { romaji: 'hayashi', ja: '林' },
  { romaji: 'shimizu', ja: '清水' },
  { romaji: 'yamazaki', ja: '山崎' },
  { romaji: 'mori', ja: '森' },
  { romaji: 'abe', ja: '阿部' },
  { romaji: 'ikeda', ja: '池田' },
  { romaji: 'hashimoto', ja: '橋本' },
  { romaji: 'yamashita', ja: '山下' },
  { romaji: 'ishikawa', ja: '石川' },
  { romaji: 'nakajima', ja: '中島' },
  { romaji: 'ogawa', ja: '小川' },
  { romaji: 'goto', ja: '後藤' },
  { romaji: 'okamoto', ja: '岡本' },
  { romaji: 'hasegawa', ja: '長谷川' },
  { romaji: 'murakami', ja: '村上' },
  { romaji: 'kondo', ja: '近藤' },
  { romaji: 'ishii', ja: '石井' },
  { romaji: 'saito', ja: '齊藤' },
  { romaji: 'fujita', ja: '藤田' },
  { romaji: 'nishimura', ja: '西村' },
  { romaji: 'fukuda', ja: '福田' },
  { romaji: 'ota', ja: '太田' },
  { romaji: 'miura', ja: '三浦' },
  { romaji: 'fujii', ja: '藤井' },
  { romaji: 'okada', ja: '岡田' },
  { romaji: 'matsuda', ja: '松田' },
  { romaji: 'nakagawa', ja: '中川' },
  { romaji: 'nakano', ja: '中野' },
  { romaji: 'harada', ja: '原田' },
  { romaji: 'ono', ja: '小野' },
  { romaji: 'tamura', ja: '田村' },
  { romaji: 'takeuchi', ja: '竹内' },
  { romaji: 'kaneko', ja: '金子' },
  { romaji: 'wada', ja: '和田' },
  { romaji: 'nakayama', ja: '中山' },
  { romaji: 'ishida', ja: '石田' },
  { romaji: 'ueda', ja: '上田' },
  { romaji: 'morita', ja: '森田' },
  { romaji: 'hara', ja: '原' },
  { romaji: 'shibata', ja: '柴田' },
  { romaji: 'sakai', ja: '酒井' },
  { romaji: 'koyama', ja: '小山' },
  { romaji: 'kuwahara', ja: '桑原' },
  { romaji: 'miyamoto', ja: '宮本' },
  { romaji: 'ueno', ja: '上野' },
  { romaji: 'tsuchiya', ja: '土屋' },
  { romaji: 'endo', ja: '遠藤' },
  { romaji: 'aoki', ja: '青木' },
  { romaji: 'fujiwara', ja: '藤原' },
  { romaji: 'nagai', ja: '永井' },
  { romaji: 'matsui', ja: '松井' },
  { romaji: 'maruyama', ja: '丸山' },
  { romaji: 'okabe', ja: '岡部' },
  { romaji: 'imai', ja: '今井' },
  { romaji: 'kawaguchi', ja: '川口' },
  { romaji: 'tsujimoto', ja: '辻本' },
  { romaji: 'miyazaki', ja: '宮崎' },
  { romaji: 'nagata', ja: '永田' },
  { romaji: 'ohara', ja: '大原' },
  { romaji: 'kubo', ja: '久保' },
  { romaji: 'nishida', ja: '西田' },
  { romaji: 'tanimoto', ja: '谷本' },
  { romaji: 'sakamoto', ja: '坂本' },
  { romaji: 'hirano', ja: '平野' },
  { romaji: 'maeda', ja: '前田' },
  { romaji: 'kawamoto', ja: '川本' },
  { romaji: 'uno', ja: '宇野' },
  { romaji: 'osaka', ja: '大坂' },
  { romaji: 'naomi', ja: '直美' },
  { romaji: 'honda', ja: '本田' },
  { romaji: 'nomo', ja: '野茂' },
  { romaji: 'ichiro', ja: '一郎' },
  { romaji: 'otani', ja: '大谷' },
  { romaji: 'ohtani', ja: '大谷' },
];

const givenNames = [
  { romaji: 'ichiro', candidates: [{ ja: '一郎', zh: '一郎' }, { ja: '市郎', zh: '市郎' }], gender: 'M' },
  { romaji: 'jiro', candidates: [{ ja: '二郎', zh: '二郎' }, { ja: '次郎', zh: '次郎' }], gender: 'M' },
  { romaji: 'keizo', candidates: [{ ja: '敬三', zh: '敬三' }, { ja: '惠三', zh: '惠三' }, { ja: '圭三', zh: '圭三' }], gender: 'M' },
  { romaji: 'kenji', candidates: [{ ja: '健二', zh: '健二' }, { ja: '賢二', zh: '贤二' }, { ja: '謙二', zh: '谦二' }], gender: 'M' },
  { romaji: 'kenichi', candidates: [{ ja: '健一', zh: '健一' }, { ja: '賢一', zh: '贤一' }], gender: 'M' },
  { romaji: 'takeshi', candidates: [{ ja: '武', zh: '武' }, { ja: '猛', zh: '猛' }, { ja: '剛', zh: '刚' }], gender: 'M' },
  { romaji: 'hiroshi', candidates: [{ ja: '浩', zh: '浩' }, { ja: '博', zh: '博' }, { ja: '寛', zh: '宽' }], gender: 'M' },
  { romaji: 'masaru', candidates: [{ ja: '勝', zh: '胜' }, { ja: '優', zh: '优' }], gender: 'M' },
  { romaji: 'akira', candidates: [{ ja: '明', zh: '明' }, { ja: '亮', zh: '亮' }, { ja: '昭', zh: '昭' }], gender: 'M' },
  { romaji: 'shinjiro', candidates: [{ ja: '進次郎', zh: '进次郎' }, { ja: '慎二郎', zh: '慎二郎' }], gender: 'M' },
  { romaji: 'shinzo', candidates: [{ ja: '晋三', zh: '晋三' }, { ja: '信三', zh: '信三' }], gender: 'M' },
  { romaji: 'taro', candidates: [{ ja: '太郎', zh: '太郎' }, { ja: '多朗', zh: '多朗' }], gender: 'M' },
  { romaji: 'hideo', candidates: [{ ja: '英夫', zh: '英夫' }, { ja: '秀雄', zh: '秀雄' }, { ja: '英雄', zh: '英雄' }], gender: 'M' },
  { romaji: 'shohei', candidates: [{ ja: '翔平', zh: '翔平' }, { ja: '昇平', zh: '昇平' }], gender: 'M' },
  { romaji: 'ryota', candidates: [{ ja: '良太', zh: '良太' }, { ja: '涼太', zh: '凉太' }], gender: 'M' },
  { romaji: 'yuki', candidates: [{ ja: '勇樹', zh: '勇树' }, { ja: '雪', zh: '雪' }, { ja: '幸', zh: '幸' }], gender: 'U' },
  { romaji: 'kei', candidates: [{ ja: '圭', zh: '圭' }, { ja: '慶', zh: '庆' }, { ja: '恵', zh: '惠' }], gender: 'U' },
  { romaji: 'daiki', candidates: [{ ja: '大輝', zh: '大辉' }, { ja: '大樹', zh: '大树' }], gender: 'M' },
  { romaji: 'sota', candidates: [{ ja: '蒼太', zh: '苍太' }, { ja: '颯太', zh: '飒太' }], gender: 'M' },
  { romaji: 'yuto', candidates: [{ ja: '勇人', zh: '勇人' }, { ja: '優斗', zh: '优斗' }], gender: 'M' },
  { romaji: 'yoko', candidates: [{ ja: '洋子', zh: '洋子' }, { ja: '陽子', zh: '阳子' }, { ja: '曜子', zh: '曜子' }], gender: 'F' },
  { romaji: 'keiko', candidates: [{ ja: '恵子', zh: '惠子' }, { ja: '敬子', zh: '敬子' }, { ja: '佳子', zh: '佳子' }], gender: 'F' },
  { romaji: 'naomi', candidates: [{ ja: '直美', zh: '直美' }, { ja: '奈緒美', zh: '奈绪美' }], gender: 'F' },
  { romaji: 'haruka', candidates: [{ ja: '遥', zh: '遥' }, { ja: '晴香', zh: '晴香' }, { ja: '春花', zh: '春花' }], gender: 'F' },
  { romaji: 'sakura', candidates: [{ ja: '桜', zh: '樱' }, { ja: '咲良', zh: '咲良' }], gender: 'F' },
  { romaji: 'akiko', candidates: [{ ja: '明子', zh: '明子' }, { ja: '秋子', zh: '秋子' }, { ja: '昭子', zh: '昭子' }], gender: 'F' },
  { romaji: 'noriko', candidates: [{ ja: '典子', zh: '典子' }, { ja: '紀子', zh: '纪子' }, { ja: '則子', zh: '则子' }], gender: 'F' },
  { romaji: 'hanako', candidates: [{ ja: '花子', zh: '花子' }], gender: 'F' },
  { romaji: 'misaki', candidates: [{ ja: '美咲', zh: '美咲' }, { ja: '岬', zh: '岬' }], gender: 'F' },
  { romaji: 'ayaka', candidates: [{ ja: '彩花', zh: '彩花' }, { ja: '綾香', zh: '绫香' }], gender: 'F' },
  { romaji: 'yuna', candidates: [{ ja: '結菜', zh: '结菜' }, { ja: '優奈', zh: '优奈' }], gender: 'F' },
  { romaji: 'rina', candidates: [{ ja: '里奈', zh: '里奈' }, { ja: '莉奈', zh: '莉奈' }], gender: 'F' },
  { romaji: 'aoi', candidates: [{ ja: '葵', zh: '葵' }, { ja: '蒼', zh: '苍' }], gender: 'F' },
  { romaji: 'mio', candidates: [{ ja: '澪', zh: '澪' }, { ja: '美緒', zh: '美绪' }], gender: 'F' },
  { romaji: 'mai', candidates: [{ ja: '舞', zh: '舞' }, { ja: '麻衣', zh: '麻衣' }], gender: 'F' },
];

async function main() {
  let surnames = [];
  try {
    surnames = await fetchSurnames();
    console.log(`维基百科解析 ${surnames.length} 个姓氏`);
  } catch (e) {
    console.warn('维基抓取失败，仅使用 coreData:', e.message);
  }

  const map = new Map();
  for (const item of [...surnames, ...coreData]) {
    const key = item.romaji;
    if (!map.has(key)) {
      map.set(key, {
        romaji: item.romaji,
        ja: item.ja,
        zh: toSimplified(item.ja),
      });
    }
  }

  const result = Array.from(map.values());
  writeFileSync('./data/ja_surnames.json', JSON.stringify(result, null, 2));
  console.log(`写入 ${result.length} 个姓氏`);

  writeFileSync('./data/ja_given.json', JSON.stringify(givenNames, null, 2));
  console.log(`写入 ${givenNames.length} 个名（given names）`);
}

main().catch(console.error);
