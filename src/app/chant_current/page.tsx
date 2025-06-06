// このファイルは「現在のチャント」ページのUIとロジックを定義しています。
// ReactとNext.js、Tailwind CSS、react-iconsを使っています。

//明示的にユーザーに表示されるページなので、use clientを使う
'use client'

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CurrentChantDisplay from "@/components/chantCurrent/CurrentChantDisplay";
import VoteBanner from "@/components/chantCurrent/VoteBanner";
import ChantCard from "@/components/chantCurrent/ChantCard";
import { useVoting } from "@/features/votes/useVoting";
import { useChantData } from "@/features/chants/useChantData";

export default function ChantCurrentPage() {
  // カスタムフックからデータとロジックを取得
  const { cooldown, isVoting, canVote, hasVoted, handleVote } = useVoting();
  const { teamChants, latestCurrentChant, isLoading } = useChantData();

  // 読み込み中の表示
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">読み込み中...</div>;
  }

  return (
    <div className="relative h-screen bg-[#F1F2F6]">
      {/* Header */}
      <Header />

      {/* 最新チャント表示 */}
      <CurrentChantDisplay chant={latestCurrentChant} />

      {/* 投票バナー */}
      <VoteBanner canVote={canVote} hasVoted={hasVoted} cooldown={cooldown} />

      {/* 投票候補カード */}
      <div className="absolute top-[330px] bottom-[60px] w-full max-w-md mx-auto px-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {teamChants.map((chant) => (
            <ChantCard
              key={chant.chantId}
              chant={chant}
              onVote={handleVote}
              disabled={!canVote || hasVoted || isVoting}
              isVoting={isVoting}
              hasVoted={hasVoted}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}