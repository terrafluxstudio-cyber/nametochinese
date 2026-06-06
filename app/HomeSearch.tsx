'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';

export default function HomeSearch() {
  const [q, setQ] = useState('');
  const router = useRouter();

  function go(v: string) {
    const t = v.trim();
    if (!t) return;
    router.push(`/en?q=${encodeURIComponent(t)}`);
  }

  return (
    <div className="w-full">
      <SearchInput
        value={q}
        onChange={setQ}
        onSubmit={go}
        placeholder="Adams · Johnson · 亚当斯 · 约翰逊…"
        autoFocus
        mono
      />
      <p className="text-xs text-gray-400 mt-2 pl-1">英文或中文均可 · 按回车或点「查」</p>
    </div>
  );
}
