'use client';

import { useEffect, useRef, useState } from 'react';

// 2048：4×4，方向键 + 滑动。纯前端无依赖。
type Grid = number[][];

const COLORS: Record<number, string> = {
  0: '#EDE8DF', 2: '#EEE4DA', 4: '#EDE0C8', 8: '#F2B179', 16: '#F59563',
  32: '#F67C5F', 64: '#F65E3B', 128: '#EDCF72', 256: '#EDCC61', 512: '#EDC850',
  1024: '#EDC53F', 2048: '#EDC22E',
};

function empty(): Grid {
  return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
}
function clone(g: Grid): Grid {
  return g.map((r) => [...r]);
}
function addTile(g: Grid) {
  const free: [number, number][] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (g[i][j] === 0) free.push([i, j]);
  if (!free.length) return;
  const [i, j] = free[Math.floor(Math.random() * free.length)];
  g[i][j] = Math.random() < 0.9 ? 2 : 4;
}
function slide(row: number[]): { row: number[]; gain: number } {
  const a = row.filter((v) => v);
  let gain = 0;
  for (let i = 0; i < a.length - 1; i++) {
    if (a[i] === a[i + 1]) {
      a[i] *= 2;
      gain += a[i];
      a.splice(i + 1, 1);
    }
  }
  while (a.length < 4) a.push(0);
  return { row: a, gain };
}
function rotate(g: Grid): Grid {
  const n = empty();
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) n[j][3 - i] = g[i][j];
  return n;
}
function eq(a: Grid, b: Grid) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(empty);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  function start() {
    const g = empty();
    addTile(g);
    addTile(g);
    setGrid(g);
    setScore(0);
    setOver(false);
  }
  useEffect(() => {
    start();
  }, []);

  function move(dir: number) {
    setGrid((prev) => {
      if (over) return prev;
      let g = clone(prev);
      for (let r = 0; r < dir; r++) g = rotate(g);
      let gain = 0;
      for (let i = 0; i < 4; i++) {
        const { row, gain: gg } = slide(g[i]);
        g[i] = row;
        gain += gg;
      }
      for (let r = 0; r < (4 - dir) % 4; r++) g = rotate(g);
      if (eq(g, prev)) return prev;
      addTile(g);
      if (gain) setScore((s) => s + gain);
      // 判负
      const movable = (() => {
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 4; j++) {
            if (g[i][j] === 0) return true;
            if (j < 3 && g[i][j] === g[i][j + 1]) return true;
            if (i < 3 && g[i][j] === g[i + 1][j]) return true;
          }
        return false;
      })();
      if (!movable) setOver(true);
      return g;
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const m: Record<string, number> = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 };
      if (e.key in m) {
        e.preventDefault();
        move(m[e.key]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  function onTouchStart(e: React.TouchEvent) {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 2 : 0);
    else move(dy > 0 ? 3 : 1);
    touch.current = null;
  }

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center justify-between w-[260px] mb-2">
        <span className="text-xs text-gray-400">分数 {score}</span>
        <button onClick={start} className="text-xs px-2 py-1 rounded" style={{ background: '#EBF3FA', color: '#2C5F8A' }}>
          重开
        </button>
      </div>
      <div
        className="grid grid-cols-4 gap-1.5 p-1.5 rounded-lg touch-none"
        style={{ background: '#BBADA0' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {grid.flatMap((row, i) =>
          row.map((v, j) => (
            <div
              key={`${i}-${j}`}
              className="flex items-center justify-center rounded font-bold"
              style={{
                width: 56,
                height: 56,
                background: COLORS[v] ?? '#3C3A32',
                color: v <= 4 ? '#776E65' : '#fff',
                fontSize: v >= 1024 ? 16 : 20,
              }}
            >
              {v || ''}
            </div>
          ))
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {over ? '没法动了，点「重开」' : '方向键 / 滑动 合并相同数字'}
      </p>
    </div>
  );
}
