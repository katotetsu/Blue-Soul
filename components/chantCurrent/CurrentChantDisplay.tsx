import { FaMusic } from "react-icons/fa";
import { Timestamp } from "firebase/firestore";
import React from "react";

export type CurrentChant = {
  chantId: string;
  name: string;
  lyrics: string;
  tags: string[];
  voteCount: number;
  updatedAt: Timestamp;
};

type Props = {
  chant: CurrentChant | null;
};

export default function CurrentChantDisplay({ chant }: Props) {
  return (
    <section className="fixed top-[100px] w-full max-w-md mx-auto px-4 z-10">
      <div className="bg-[#0D277E] rounded-2xl shadow p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-white font-semibold">
            <FaMusic />
            みんなが歌っているチャント
          </div>
          {chant?.updatedAt && (
            <span className="text-gray-200 text-xs text-right max-w-[100px] truncate">
              {(() => {
                const date = chant.updatedAt.toDate ? chant.updatedAt.toDate() : chant.updatedAt;
                return date instanceof Date ?
                  `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}` :
                  String(date);
              })()}
            </span>
          )}
        </div>
        {/* チャントタイトル（左寄せ） */}
        <div className="text-base font-bold text-white mb-1 text-left">
          {chant?.name || "-"}
        </div>
        {/* 歌詞（中央寄せ・改行維持） */}
        <div
          className="text-lg font-bold whitespace-pre-line leading-relaxed text-white text-left break-words w-full relative"
          style={{ minHeight: 100, maxHeight: 100 }}
        >
          {chant?.lyrics || "-"}
        </div>
      </div>
    </section>
  );
} 