'use client';

// 统一搜索框：输入 + 「查」按钮，点按钮或回车都触发 onSubmit。
// 保留实时搜索的页面仍可在 onChange 里做联想，onSubmit 只是显式触发/兜底。
type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  mono?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  autoFocus,
  mono,
  disabled,
  className = '',
}: Props) {
  const submit = () => {
    if (!disabled) onSubmit?.(value);
  };
  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className="flex-1 min-w-0 text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-40"
        style={{
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          fontFamily: mono ? 'var(--font-geist-mono)' : undefined,
        }}
      />
      <button
        onClick={submit}
        disabled={disabled}
        aria-label="查询"
        className="px-6 rounded-2xl text-white text-base font-medium shrink-0 transition-colors disabled:opacity-40"
        style={{ background: '#2C5F8A' }}
      >
        查
      </button>
    </div>
  );
}
