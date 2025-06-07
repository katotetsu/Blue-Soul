// src/components/chant_search/ChantCard.tsx

import Image from "next/image";
import { Chant } from "@/features/chants/types";

interface ChantCardProps {
  chant: Chant;
  isActive: boolean;
  onClick: () => void;
}

export default function ChantCard({ chant, isActive, onClick }: ChantCardProps) {
  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl shadow px-4 py-3 text-sm border flex items-center cursor-pointer ${
        isActive
          ? "bg-blue-200 text-white border-[#0D277E] ring-1 ring-[#0D277E]"
          : "bg-white text-black border-border"
      }`}
    >
      <Image src="/chant.png" alt="icon" width={32} height={32} className="mr-3" />
      <div className="flex-1">
        <div className="font-semibold text-[#0D277E]">{chant.name}</div>
        <div className="text-xs text-muted-foreground">
          {truncateText(chant.lyrics, 15)}
        </div>
      </div>
      <div className="text-xs flex flex-col items-end ml-2">
        <span className="text-black">
          {chant.playTime ? `${Math.floor(chant.playTime / 60)}:${String(chant.playTime % 60).padStart(2, "0")}` : "0:00"}
        </span>
        {isActive && <span className="text-primary text-[11px] font-bold mt-0.5">表示中</span>}
      </div>
    </div>
  );
}
