// このファイルは「現在のチャント」ページのUIとロジックを定義しています。
// ReactとNext.js、Tailwind CSS、react-iconsを使っています。

//明示的にユーザーに表示されるページなので、use clientを使う
'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMusic } from "react-icons/fa";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { fetchTeamChants } from "@/features/chants/fetchTeamChants";
import { Chant } from "@/features/chants/types";
import { sendVote } from "@/features/votes/sendVote";
import { generateFingerprint } from "@/features/votes/generateFingerprint";
import { collection, query, orderBy, limit, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    <div className="relative h-screen bg-gradient-to-b from-blue-700 to-blue-300">
      {/* Header */}
      <Header />

      {/* みんなが歌っているチャント（currentChantコレクションの最新） */}
      <section className="fixed top-[100px] w-full max-w-md mx-auto px-4 z-10">
        <div className="bg-white rounded-2xl shadow p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-blue-700 font-semibold">
              <FaMusic />
              みんなが歌っているチャント
            </div>
            {latestCurrentChant?.updatedAt && (
              <span className="text-blue-700 text-xs text-right max-w-[100px] truncate">
                {(() => {
                  const date = latestCurrentChant.updatedAt.toDate ? latestCurrentChant.updatedAt.toDate() : latestCurrentChant.updatedAt;
                  return date instanceof Date ? 
                    `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}` : 
                    String(date);
                })()}
              </span>
            )}
          </div>
          {/* チャントタイトル（左寄せ） */}
          <div className="text-base font-bold text-blue-700 mb-1 text-left">
            {latestCurrentChant?.name || "-"}
          </div>
          {/* 歌詞（中央寄せ・改行維持） */}
          <div
            className="text-lg font-bold whitespace-pre-line leading-relaxed text-gray-900 text-left break-words w-full relative"
            style={{ minHeight: 100, maxHeight: 100 }}
          >
            {latestCurrentChant?.lyrics || "-"}
            {/* タイムスタンプを歌詞ゾーンの右下に絶対配置 */}
            
          </div>
        </div>
      </section>

      {/* 今聞こえているチャント */}
      <section className="fixed top-[300px] w-full max-w-md mx-auto px-4 z-10">
        <div className="bg-blue-700 text-white rounded-xl py-2 px-3 text-center font-bold text-sm shadow flex justify-center items-center gap-2">
          今聞こえているチャントをタップ！
          <span className="text-xs font-normal">
            {!canVote ? 
              `（クールタイム）` :
              hasVoted ?
                `（残り${cooldown}秒）` :
                `（残り${cooldown}秒）`
            }
          </span>
        </div>
      </section>

      {/* スクロールエリアだけを限定 */}
      <div className="absolute top-[350px] bottom-[60px] w-full max-w-md mx-auto px-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {candidates.map((chant) => (
            <div key={chant.chantId} className="bg-white rounded-lg shadow p-2 flex flex-col items-start">
              <div className="font-bold text-blue-700 text-[10px] mb-0.5 text-left">{chant.name}</div>
              <div className="text-[10px] text-gray-400 mb-1 text-left w-full truncate">
                {chant.lyrics.split("\n")[0]}
              </div>
              <Button
                className="w-full h-6 bg-blue-700 hover:bg-blue-800 text-white rounded-full py-0 text-[10px] font-bold min-h-0"
                onClick={() => handleVote(chant.chantId)}
                disabled={!canVote || hasVoted || isVoting}
              >
                {isVoting ? "送信中..." : hasVoted ? "投票済み" : "これ！"}
              </Button>
            </div>
          ))}
        </div>
        {!canVote && (
          <p className="text-center text-xs text-gray-500 mt-2 shrink-0">
            あと {cooldown} 秒で投票開始
          </p>
        )}
        {canVote && (
          <p className="text-center text-xs text-gray-500 mt-2 shrink-0">
            あと {cooldown} 秒で次の集計
          </p>
        )}
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}