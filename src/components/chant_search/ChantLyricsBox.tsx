// src/components/chant_search/ChantLyricsBox.tsx

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { Chant } from "@/features/chants/types";

interface ChantLyricsBoxProps {
  chant: Chant;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSliderChange: (val: number) => void;
  togglePlay: () => void;
}

export default function ChantLyricsBox({
  chant,
  currentTime,
  duration,
  isPlaying,
  onSliderChange,
  togglePlay,
}: ChantLyricsBoxProps) {
  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl shadow overflow-hidden border border-border bg-white">
      <div className="flex items-center justify-between bg-[#0D277E] text-white px-3 py-2">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Image src="/chant_kashi.png" alt="チャントの歌詞" width={28} height={28} />
          <span>チャントの歌詞</span>
        </div>
      </div>

      <div className="relative px-3 pt-2 pb-[50px] h-[180px] box-border">
        <div className="text-base text-black leading-tight font-bold h-[140px] overflow-y-auto whitespace-pre-line pr-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[#0D277E] font-black text-lg md:text-2xl flex-1">
              {chant.name}
            </div>
            {chant.youtubeUrl && (
              <a
                href={chant.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2"
              >
                <Image src="/youtube.png" alt="YouTube" width={64} height={32} className="object-contain" />
              </a>
            )}
          </div>
          {chant.lyrics}
        </div>

        <div className="absolute bottom-2 left-4 right-4 flex items-center gap-2 text-sm text-primary">
          <span className="w-10 text-left">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSliderChange(parseFloat(e.target.value))}
            className="flex-1 accent-[#0D277E]"
            style={{ maxWidth: "70%" }}
          />
          <span className="w-8 text-right">{formatTime(duration)}</span>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#0D277E] flex items-center justify-center shadow-md"
          >
            {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
