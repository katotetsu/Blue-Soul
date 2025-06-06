import Image from "next/image";
import { CurrentChant } from "@/features/chants/types";

type Props = {
  chant: CurrentChant | null;
};

export default function CurrentChantDisplay({ chant }: Props) {
  return (
    // 🔷 セクション全体（カードの外枠）
    <section className="fixed top-[60px] w-full max-w-md mx-auto px-4 z-10">
      <div className="rounded-2xl shadow overflow-hidden">
        
        {/* 🟦 ヘッダー部分（タイトル＋タイムスタンプ） */}
        <div className="bg-[#0D277E] px-4 pt-3 py-2">
          <div className="flex items-center justify-between mb-1">
            
            {/* 🎵 タイトルテキスト（左側） */}
            <div className="flex items-center gap-1 text-white font-semibold">
              <Image
                src="/images/musicIcon.svg"
                alt="musicIcon"
                width={20}
                height={20}
              />
              みんなが歌っているチャント
            </div>
            
            {/* 🕒 タイムスタンプ（右側） */}
            {chant?.updatedAt && (
              <span className="text-gray-200 text-xs text-right max-w-[100px] truncate">
                {(() => {
                  const date = chant.updatedAt.toDate ? chant.updatedAt.toDate() : chant.updatedAt;
                  return date instanceof Date
                    ? `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
                    : String(date);
                })()}
              </span>
            )}
          </div>
        </div>

        {/* ⬜️ 本文部分（チャント名＋歌詞） */}
        <div className="bg-white px-4 py-3">
          
          {/* 🎤 チャント名 */}
          <div className="text-base font-bold text-[#0D277E] mb-1 text-left">
            {chant?.name || "-"}
          </div>
          
          {/* 📝 歌詞 */}
          <div
            className="text-base font-bold whitespace-pre-line leading-normal text-black text-left break-words w-full relative"
            style={{ minHeight: 100, maxHeight: 100 }}
          >
            {chant?.lyrics || "-"}
          </div>

        </div>
      </div>
    </section>
  );
}
