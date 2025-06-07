// src/components/chant_search/ChantSearchFilter.tsx

interface ChantSearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  typeFilter: "全て" | "チーム" | "個人";
  setTypeFilter: (value: "全て" | "チーム" | "個人") => void;
}

export default function ChantSearchFilter({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
}: ChantSearchFilterProps) {
  return (
    <section className="fixed top-[290px] w-full max-w-md mx-auto z-30 bg-[#F1F2F6] pb-2 px-4">
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="チャントや歌詞の検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[#0D277E] focus:outline-none bg-white"
          />
        </div>

        <div className="flex border border-blue-700 rounded-md overflow-hidden text-sm">
          <button
            onClick={() => setTypeFilter("チーム")}
            className={`px-3 py-2 transition-colors ${
              typeFilter === "チーム" ? "bg-[#0D277E] text-white" : "bg-white text-[#0D277E]"
            }`}
          >
            チーム
          </button>
          <button
            onClick={() => setTypeFilter("個人")}
            className={`px-3 py-1 transition-colors border-l ${
              typeFilter === "個人" ? "bg-[#0D277E] text-white" : "bg-white text-[#0D277E]"
            }`}
          >
            個人
          </button>
        </div>
      </div>
    </section>
  );
}
