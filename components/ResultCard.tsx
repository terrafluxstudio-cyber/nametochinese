import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "./SearchBox";

interface Props {
  result: SearchResult;
}

// 国别缩写 → 全称映射（常见的）
const NATIONALITY_MAP: Record<string, string> = {
  英: "英国",
  美: "美国",
  法: "法国",
  德: "德国",
  俄: "俄罗斯",
  意: "意大利",
  西: "西班牙",
  日: "日本",
  挪: "挪威",
  瑞典: "瑞典",
  丹: "丹麦",
  芬: "芬兰",
  荷: "荷兰",
  比: "比利时",
  波: "波兰",
  捷: "捷克",
  匈: "匈牙利",
  罗: "罗马尼亚",
  土: "土耳其",
  印: "印度",
};

function getNationality(code: string) {
  return NATIONALITY_MAP[code] ?? code;
}

export function ResultCard({ result }: Props) {
  const typeLabel = result.type === "person" ? "人名" : "地名";
  const typeColor = result.type === "person" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700";

  return (
    <div className="flex items-center justify-between py-4 px-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <span className="font-serif text-xl text-[#1A1A1A]">{result.english}</span>
        {result.nationality && (
          <span className="text-sm text-gray-500 bg-[#E8EDF2] px-2 py-0.5 rounded-md">
            {getNationality(result.nationality)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xl text-[#1A1A1A] font-medium">{result.chinese}</span>
        <Badge variant="secondary" className={`text-xs ${typeColor}`}>
          {typeLabel}
        </Badge>
        {result.has_note ? (
          <span title="含注释" className="text-gray-400 text-xs cursor-help">注</span>
        ) : null}
      </div>
    </div>
  );
}
