import { Chant } from "@/features/chants/types";
import { Button } from "@/components/ui/button";

type Props = {
  chant: Chant;
  onVote: (chantId: string) => void;
  disabled: boolean;
  isVoting: boolean;
  hasVoted: boolean;
};

export default function ChantCard({ chant, onVote, disabled, isVoting, hasVoted }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-2 flex flex-col items-start">
      <div className="font-bold text-[#0D277E] text-[10px] mb-0.5 text-left">{chant.name}</div>
      <div className="text-[10px] text-gray-400 mb-1 text-left w-full truncate">
        {chant.lyrics.split("\n")[0]}
      </div>
      <Button
        className="w-full h-6 bg-[#0D277E] hover:bg-blue-800 text-white rounded-full py-0 text-[10px] font-bold min-h-0"
        onClick={() => onVote(chant.chantId)}
        disabled={disabled}
      >
        {isVoting ? "送信中..." : hasVoted ? "投票済み" : "🔥これ！"}
      </Button>
    </div>
  );
} 