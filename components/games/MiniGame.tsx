'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 摸鱼彩蛋：只在死胡同（空结果/404）按需挂载，随机出一个游戏，可「换一个」。
// 每个游戏各自 dynamic import（独立 chunk，ssr:false）→ 绝不进主 bundle，被选中才下载。
const loading = () => <p className="text-center text-xs text-gray-300 py-8">载入小游戏…</p>;

const GAMES = [
  { name: '恐龙跑酷', C: dynamic(() => import('./DinoGame'), { ssr: false, loading }) },
  { name: '2048', C: dynamic(() => import('./Game2048'), { ssr: false, loading }) },
  { name: '翻牌记忆', C: dynamic(() => import('./MemoryGame'), { ssr: false, loading }) },
];

export default function MiniGame() {
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    setIdx(Math.floor(Math.random() * GAMES.length));
  }, []);

  if (idx === null) return null;
  const g = GAMES[idx];
  const Game = g.C;

  return (
    <div className="mt-8 mx-auto max-w-sm rounded-2xl px-4 py-5" style={{ background: '#F2EFE8' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">🐟 卡壳了？先摸会儿鱼 · {g.name}</span>
        <button
          onClick={() => setIdx((i) => ((i ?? 0) + 1) % GAMES.length)}
          className="text-xs px-2 py-1 rounded hover:underline"
          style={{ color: '#2C5F8A' }}
        >
          换一个 →
        </button>
      </div>
      <Game />
    </div>
  );
}
