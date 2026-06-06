'use client';

import { useEffect, useState } from 'react';

// 翻牌记忆：6 对 emoji，翻两张配对。纯前端无依赖。
const FACES = ['🌍', '🗼', '🍣', '🐉', '🎎', '📜'];

type Card = { id: number; face: string; flipped: boolean; matched: boolean };

function shuffle(): Card[] {
  const deck = [...FACES, ...FACES].map((face, id) => ({ id, face, flipped: false, matched: false }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  function start() {
    setCards(shuffle());
    setPicked([]);
    setMoves(0);
    setLock(false);
  }
  useEffect(() => {
    start();
  }, []);

  function flip(idx: number) {
    if (lock) return;
    const c = cards[idx];
    if (c.flipped || c.matched) return;
    const next = cards.map((x, i) => (i === idx ? { ...x, flipped: true } : x));
    const sel = [...picked, idx];
    setCards(next);
    setPicked(sel);

    if (sel.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = sel;
      if (next[a].face === next[b].face) {
        setCards((cur) => cur.map((x, i) => (i === a || i === b ? { ...x, matched: true } : x)));
        setPicked([]);
      } else {
        setLock(true);
        setTimeout(() => {
          setCards((cur) => cur.map((x, i) => (i === a || i === b ? { ...x, flipped: false } : x)));
          setPicked([]);
          setLock(false);
        }, 700);
      }
    }
  }

  const won = cards.length > 0 && cards.every((c) => c.matched);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center justify-between w-[236px] mb-2">
        <span className="text-xs text-gray-400">步数 {moves}</span>
        <button onClick={start} className="text-xs px-2 py-1 rounded" style={{ background: '#EBF3FA', color: '#2C5F8A' }}>
          重开
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {cards.map((c, i) => {
          const show = c.flipped || c.matched;
          return (
            <button
              key={c.id}
              onClick={() => flip(i)}
              className="flex items-center justify-center rounded-lg transition-all"
              style={{
                width: 54,
                height: 54,
                fontSize: 26,
                background: show ? '#fff' : '#2C5F8A',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                opacity: c.matched ? 0.5 : 1,
              }}
            >
              {show ? c.face : ''}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {won ? `🎉 ${moves} 步通关，点「重开」再来` : '翻开两张，配成一对'}
      </p>
    </div>
  );
}
