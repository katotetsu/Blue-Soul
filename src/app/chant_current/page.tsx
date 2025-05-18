// このファイルは「現在のチャント」ページのUIとロジックを定義しています。
// ReactとNext.js、Tailwind CSS、react-iconsを使っています。

//明示的にユーザーに表示されるページなので、use clientを使う
'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMusic } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { fetchTeamChants } from "@/features/chants/fetchTeamChants";
import { Chant } from "@/features/chants/types";

export default function ChantCurrentPage() {
  const [cooldown, setCooldown] = useState(0);
  const [teamChants, setTeamChants] = useState<Chant[]>([]);
  const [currentChant, setCurrentChant] = useState<Chant | null>(null);

  useEffect(() => {
    const load = async () => {
      const teamOnly = await fetchTeamChants();
      setTeamChants(teamOnly);
      if (teamOnly.length > 0) {
        setCurrentChant(teamOnly[0]);
      }
    };
    load();
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
  const handleVote = (chantId: string) => {
    if (cooldown > 0) return;
    const next = teamChants.find((chant) => chant.chantId === chantId);
    if (next) setCurrentChant(next);
    setCooldown(2);
  };

  // currentChant以外を候補として表示
  const candidates = teamChants;

  return (
    <div className="relative h-screen bg-gradient-to-b from-blue-700 to-blue-300">
      {/* Header */}
      <Header />

      {/* チャント表示 */}
      <section className="fixed top-[100px] w-full max-w-md mx-auto px-4 z-10">
        <div className="bg-white rounded-2xl shadow p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-blue-700 font-semibold">
              <FaMusic />
              みんなが歌っているチャント
            </div>
            {currentChant?.tags && currentChant.tags.length > 0 && (
              <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                <MdGroups />{currentChant.tags[0]}
              </span>
            )}
          </div>
          {/* チャントタイトル（左寄せ） */}
          <div className="text-base font-bold text-blue-700 mb-1 text-left">
            {currentChant?.name}
          </div>
          {/* 歌詞（中央寄せ・改行維持） */}
          <div
            className="text-lg font-bold whitespace-pre-line leading-relaxed text-gray-900 text-left break-words w-full"
            style={{ minHeight: 100, maxHeight: 100 }}
          >
            {currentChant?.lyrics}
          </div>
        </div>
      </section>

      {/* 今聞こえているチャント */}
      <section className="fixed top-[300px] w-full max-w-md mx-auto px-4 z-10">
        <div className="bg-blue-700 text-white rounded-xl py-3 px-2 text-center font-bold text-base shadow">
          今聞こえているチャントをタップしよう！<br />
          <span className="text-xs font-normal">
            投稿締め切りまで残り {cooldown > 0 ? `${cooldown}秒` : '2秒'}！
          </span>
        </div>
      </section>

      {/* スクロールエリアだけを限定 */}
      <div className="absolute top-[380px] bottom-[60px] w-full max-w-md mx-auto px-4 overflow-y-auto">
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
                disabled={cooldown > 0}
              >
                これ！
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