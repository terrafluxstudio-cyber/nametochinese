'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as OpenCC from 'opencc-js';

type ConvertMode = 'tw' | 'hk' | 'simp';

const MODES: { value: ConvertMode; label: string; desc: string }[] = [
  { value: 'tw',   label: '简 → 繁（台湾）', desc: '使用台湾正体字标准' },
  { value: 'hk',   label: '简 → 繁（香港）', desc: '使用香港繁体字标准' },
  { value: 'simp', label: '繁 → 简',         desc: '繁体转大陆简体' },
];

export default function ZhConvertPage() {
  const [mode, setMode] = useState<ConvertMode>('tw');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // 每次 input 或 mode 变化时自动转换
  useEffect(() => {
    if (!input.trim()) { setOutput(''); return; }

    let converter: (text: string) => string;
    if (mode === 'tw') {
      converter = OpenCC.Converter({ from: 'cn', to: 'twp' });
    } else if (mode === 'hk') {
      converter = OpenCC.Converter({ from: 'cn', to: 'hk' });
    } else {
      converter = OpenCC.Converter({ from: 'twp', to: 'cn' });
    }

    setOutput(converter(input));
  }, [input, mode]);

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSwap() {
    setInput(output);
    setOutput('');
    // 切换方向
    if (mode === 'tw') setMode('simp');
    else if (mode === 'hk') setMode('simp');
    else setMode('tw');
  }

  const charCount = input.length;
  const outputCount = output.length;

  return (
    <main
      className="min-h-screen px-4 py-16 max-w-3xl mx-auto"
      style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
    >
      {/* 导航 */}
      <div className="mb-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← 返回查询</Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
        简繁中文转换
      </h1>
      <p className="text-center text-gray-500 text-sm mb-10">
        支持台湾正体、香港繁体、大陆简体互转，段落级别实时转换
      </p>

      {/* 模式选择 */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {MODES.map(m => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-4 py-2 rounded-full text-sm transition-all border ${
              mode === m.value
                ? 'text-white border-transparent'
                : 'text-gray-600 border-gray-200 hover:border-gray-400 bg-white'
            }`}
            style={mode === m.value ? { background: '#2C5F8A' } : {}}
            title={m.desc}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 双栏编辑器 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 输入 */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">输入</span>
            <span className="text-xs text-gray-300">{charCount} 字</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="在此输入中文文本…"
            className="flex-1 min-h-[280px] px-4 py-3 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-200 resize-none leading-relaxed"
            style={{
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              color: '#1A1A1A',
            }}
            autoFocus
          />
          <button
            onClick={() => setInput('')}
            className="mt-2 text-xs text-gray-300 hover:text-gray-500 text-right"
          >
            清空
          </button>
        </div>

        {/* 输出 */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">结果</span>
            <span className="text-xs text-gray-300">{outputCount} 字</span>
          </div>
          <div
            className="flex-1 min-h-[280px] px-4 py-3 rounded-2xl text-base leading-relaxed select-text overflow-auto"
            style={{
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              color: output ? '#1A1A1A' : '#9CA3AF',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {output || '转换结果将显示在此…'}
          </div>
          <div className="flex gap-3 mt-2 justify-end">
            <button
              onClick={handleSwap}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="将结果填入输入框，反向转换"
            >
              ⇄ 反向转换
            </button>
            <button
              onClick={handleCopy}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              {copied ? '✓ 已复制' : '复制结果'}
            </button>
          </div>
        </div>
      </div>

      {/* 说明 */}
      <div
        className="mt-10 rounded-xl px-5 py-4 text-xs text-gray-400 leading-relaxed"
        style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <p className="font-medium text-gray-500 mb-1">关于转换标准</p>
        <p>
          · <b>台湾正体</b>：依据台湾教育部标准字体，含词汇替换（如"软件→軟體"、"网络→網路"）<br />
          · <b>香港繁体</b>：依据香港语文教育及研究常务委员会标准<br />
          · <b>繁→简</b>：以台湾繁体为输入源，转为大陆规范简体<br />
          · 转换引擎：<a href="https://github.com/nk2028/opencc-js" target="_blank" rel="noreferrer" className="underline">OpenCC</a>（开源，离线运行，文本不上传服务器）
        </p>
      </div>

      <footer className="mt-12 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} nametochinese.com
      </footer>
    </main>
  );
}
