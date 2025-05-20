import React from "react";

type Props = {
  canVote: boolean;
  cooldown: number;
};

export default function CountdownLabel({ canVote, cooldown }: Props) {
  return (
    <p className="text-center text-xs text-gray-500 mt-2 shrink-0">
      {!canVote
        ? `あと ${cooldown} 秒で投票開始`
        : `あと ${cooldown} 秒で次の集計`}
    </p>
  );
} 