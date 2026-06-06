'use client';

import { useEffect, useRef } from 'react';

// 恐龙跑酷：纯 canvas，无依赖。空格/上键/点击 跳跃；撞到障碍重开。
export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const GROUND = H - 20;

    let raf = 0;
    let running = true;
    let score = 0;
    let speed = 4.2;

    const dino = { x: 28, y: GROUND, w: 18, h: 20, vy: 0, onGround: true };
    const G = 0.65;
    type Ob = { x: number; w: number; h: number };
    let obs: Ob[] = [];
    let spawnIn = 60;

    function reset() {
      running = true;
      score = 0;
      speed = 4.2;
      dino.y = GROUND;
      dino.vy = 0;
      dino.onGround = true;
      obs = [];
      spawnIn = 60;
    }

    function jump() {
      if (!running) {
        reset();
        return;
      }
      if (dino.onGround) {
        dino.vy = -10.5;
        dino.onGround = false;
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      // 地面线
      ctx.strokeStyle = '#D6CFC2';
      ctx.beginPath();
      ctx.moveTo(0, GROUND + dino.h);
      ctx.lineTo(W, GROUND + dino.h);
      ctx.stroke();

      if (running) {
        // 物理
        dino.vy += G;
        dino.y += dino.vy;
        if (dino.y >= GROUND) {
          dino.y = GROUND;
          dino.vy = 0;
          dino.onGround = true;
        }
        // 障碍
        spawnIn--;
        if (spawnIn <= 0) {
          const h = 14 + Math.floor(Math.random() * 18);
          obs.push({ x: W, w: 10 + Math.floor(Math.random() * 8), h });
          spawnIn = 55 + Math.floor(Math.random() * 60);
        }
        for (const o of obs) o.x -= speed;
        obs = obs.filter((o) => o.x + o.w > 0);
        score += 1;
        speed += 0.0016;

        // 碰撞
        for (const o of obs) {
          const oy = GROUND + dino.h - o.h;
          if (
            dino.x + dino.w > o.x &&
            dino.x < o.x + o.w &&
            dino.y + dino.h > oy
          ) {
            running = false;
          }
        }
      }

      // 画恐龙
      ctx.fillStyle = '#2C5F8A';
      ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
      // 障碍（仙人掌）
      ctx.fillStyle = '#5DA271';
      for (const o of obs) ctx.fillRect(o.x, GROUND + dino.h - o.h, o.w, o.h);

      // 分数
      ctx.fillStyle = '#9C9486';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.floor(score / 5)).padStart(5, '0'), W - 8, 16);

      if (!running) {
        ctx.fillStyle = '#1A1A1A';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('撞到啦！点一下重来', W / 2, H / 2);
      }

      raf = requestAnimationFrame(frame);
    }

    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    }
    window.addEventListener('keydown', onKey);
    canvas.addEventListener('pointerdown', jump);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('pointerdown', jump);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={320}
        height={140}
        className="rounded-lg cursor-pointer touch-none select-none"
        style={{ background: '#FBFAF7', maxWidth: '100%' }}
      />
      <p className="mt-2 text-xs text-gray-400">空格 / 点击 跳跃</p>
    </div>
  );
}
