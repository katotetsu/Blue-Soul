// このファイルは「現在のチャント」ページのUIとロジックを定義しています。
// ReactとNext.js、Tailwind CSS、react-iconsを使っています。

//明示的にユーザーに表示されるページなので、use clientを使う
'use client'

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { fetchTeamChants } from "@/features/chants/fetchTeamChants";
import { Chant } from "@/features/chants/types";
import { sendVote } from "@/features/votes/sendVote";
import { generateFingerprint } from "@/features/votes/generateFingerprint";
import { collection, query, orderBy, limit, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CurrentChantDisplay from "@/components/chantCurrent/CurrentChantDisplay";
import VoteBanner from "@/components/chantCurrent/VoteBanner";
import ChantCard from "@/components/chantCurrent/ChantCard";
import CountdownLabel from "@/components/chantCurrent/CountdownLabel";

type CurrentChant = {
  chantId: string;
  name: string;
  lyrics: string;
  tags: string[];
  voteCount: number;
  updatedAt: Timestamp;
};

export default function ChantCurrentPage() {
  const [cooldown, setCooldown] = useState(0);
  const [teamChants, setTeamChants] = useState<Chant[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [userFingerprint, setUserFingerprint] = useState<string>('');
  const [latestCurrentChant, setLatestCurrentChant] = useState<CurrentChant | null>(null);
  const [canVote, setCanVote] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  // 投票可能時間の管理
  useEffect(() => {
    const checkVotingTime = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      // 毎分5秒から60秒（0秒）までが投票可能時間
      const isVotingTime = seconds >= 5;
      setCanVote(isVotingTime);
      
      // 次の集計までの残り秒数を計算
      if (!isVotingTime) {
        // 投票可能時間外の場合、次の投票可能時間までの残り秒数
        setCooldown(5 - seconds);
        // 投票可能時間外になったら投票フラグをリセット
        setHasVoted(false);
      } else {
        // 投票可能時間内の場合、次の分の0秒までの残り秒数
        setCooldown(60 - seconds);
      }
    };

    // 初回チェック
    checkVotingTime();

    // 1秒ごとにチェック
    const timer = setInterval(checkVotingTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // フィンガープリントの生成
  useEffect(() => {
    const fp = generateFingerprint();
    setUserFingerprint(fp);
  }, []);

  // チームのチャントを取得
  useEffect(() => {
    const load = async () => {
      const teamOnly = await fetchTeamChants();
      setTeamChants(teamOnly);
    };
    load();
  }, []);

  // currentChantコレクションから最新のチャントをリアルタイムで取得
  useEffect(() => {
    const q = query(collection(db, "currentChant"), orderBy("updatedAt", "desc"), limit(1));
    
    // リアルタイムリスナーを設定
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setLatestCurrentChant({
          chantId: data.chantId,
          name: data.name,
          lyrics: data.lyrics,
          tags: data.tags,
          voteCount: data.voteCount,
          updatedAt: data.updatedAt
        });
      }
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  // 「これ！」ボタンでcurrentChantを切り替え
  const handleVote = async (chantId: string) => {
    // 投票可能時間外、投票済み、投票処理中、またはフィンガープリントが未生成の場合は何もしない
    if (!canVote || hasVoted || isVoting || !userFingerprint) return;
    
    try {
      setIsVoting(true);
      
      const success = await sendVote(chantId, userFingerprint);
      
      if (success) {
        setHasVoted(true); // 投票成功時にフラグを立てる
      } else {
        console.error("投票の送信に失敗しました");
      }
    } catch (error) {
      console.error("投票処理中にエラーが発生しました:", error);
    } finally {
      setIsVoting(false);
    }
  };

  // currentChant以外を候補として表示
  const candidates = teamChants;

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
          {candidates.map((chant) => (
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
        <CountdownLabel canVote={canVote} cooldown={cooldown} />
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}