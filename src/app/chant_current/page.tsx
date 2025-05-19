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
import { collection, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// クールダウン秒数を定数で管理
const VOTE_COOLDOWN = 50;

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
  const [isVoting, setIsVoting] = useState(false); // 投票処理中フラグ
  const [userFingerprint, setUserFingerprint] = useState<string>(''); // ユーザーフィンガープリント
  const [latestCurrentChant, setLatestCurrentChant] = useState<CurrentChant | null>(null);

  // 最初のレンダリング時にユーザーフィンガープリントを生成
  useEffect(() => {
    const fingerprint = generateFingerprint();
    setUserFingerprint(fingerprint);
    console.log('User fingerprint generated:', fingerprint);
  }, []);

  useEffect(() => {
    const load = async () => {
      const teamOnly = await fetchTeamChants();
      setTeamChants(teamOnly);
    };
    load();
  }, []);

  // currentChantコレクションから最新のチャントを取得
  useEffect(() => {
    const fetchLatestCurrentChant = async () => {
      const q = query(collection(db, "currentChant"), orderBy("updatedAt", "desc"), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setLatestCurrentChant({
          chantId: data.chantId,
          name: data.name,
          lyrics: data.lyrics,
          tags: data.tags,
          voteCount: data.voteCount,
          updatedAt: data.updatedAt
        });
      }
    };
    fetchLatestCurrentChant();
    // 30秒ごとに自動更新
    const interval = setInterval(fetchLatestCurrentChant, 30000);
    return () => clearInterval(interval);
  }, []);

  //クールタイムのカウントダウン
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // 「これ！」ボタンでcurrentChantを切り替え
  const handleVote = async (chantId: string) => {
    // クールダウン中または投票処理中、またはフィンガープリントが未生成の場合は何もしない
    if (cooldown > 0 || isVoting || !userFingerprint) return;
    
    try {
      setIsVoting(true); // 投票処理開始
      
      // Firebaseに投票データを送信（フィンガープリント付き）
      const success = await sendVote(chantId, userFingerprint);
      
      if (success) {
        setCooldown(VOTE_COOLDOWN); // 定数を使用
      } else {
        // エラー時の処理（オプション）
        console.error("投票の送信に失敗しました");
        // エラー表示などを追加可能
      }
    } catch (error) {
      console.error("投票処理中にエラーが発生しました:", error);
    } finally {
      setIsVoting(false); // 投票処理完了
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
            （残り {cooldown > 0 ? `${cooldown}秒` : `${VOTE_COOLDOWN}秒`}）
          </span>
        </div>
      </section>


      {/* スクロールエリアだけを限定 */}
      <div className="absolute top-[350px] bottom-[60px] w-full max-w-md mx-auto px-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {candidates.map((chant) => (
            <div key={chant.chantId} className="bg-white rounded-lg shadow p-2 flex flex-col items-start">
              {/* チャント名のみ表示（左寄せ） */}
              <div className="font-bold text-blue-700 text-[10px] mb-0.5 text-left">{chant.name}</div>
              {/* 歌詞の1行目を薄い色で表示 */}
              <div className="text-[10px] text-gray-400 mb-1 text-left w-full truncate">
                {chant.lyrics.split("\n")[0]}
              </div>
              <Button
                className="w-full h-6 bg-blue-700 hover:bg-blue-800 text-white rounded-full py-0 text-[10px] font-bold min-h-0"
                onClick={() => handleVote(chant.chantId)}
                disabled={cooldown > 0 || isVoting}
              >
                {isVoting ? "送信中..." : "これ！"}
              </Button>
            </div>
          ))}
        </div>
        {cooldown > 0 && (
          <p className="text-center text-xs text-gray-500 mt-2 shrink-0">
            あと {cooldown} 秒で再投票可能
          </p>
        )}
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}