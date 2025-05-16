// このファイルは「現在のチャント」ページのUIとロジックを定義しています。
// ReactとNext.js、Tailwind CSS、react-iconsを使っています。

'use client'

import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react"
//import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaMusic } from "react-icons/fa"
import { MdGroups } from "react-icons/md"
import { db } from "@/lib/firebase";
//import { IoSearch } from "react-icons/io5"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"

type Chant = {
  chantId: string;
  name: string;
  lyrics: string;
  tags: string[];
  playTime?: number;
  year?: number;
  youtubeUrl?: string;
};

export default function ChantCurrentPage() {
  const [cooldown, setCooldown] = useState(0)
  const [teamChants, setTeamChants] = useState<Chant[]>([])
  const [currentChant, setCurrentChant] = useState<Chant | null>(null)

  useEffect(() => {
    // Firestoreのchantsコレクションから「チーム」タグのみ取得
    const fetchChants = async () => {
      try {
        const snapshot = await getDocs(collection(db, "chants"));
        const data: Chant[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const d = doc.data();
          return {
            chantId: doc.id,
            name: d.name ?? "",
            lyrics: d.lyrics ?? "",
            tags: Array.isArray(d.tags) ? d.tags : [],
            playTime: d.playTime,
            year: d.year,
            youtubeUrl: d.youtubeUrl,
          };
        });
        // 「チーム」タグのみ
        const teamOnly = data.filter((chant) => chant.tags && chant.tags.includes("チーム"));
        setTeamChants(teamOnly);
        if (teamOnly.length > 0) {
          setCurrentChant(teamOnly[0]);
        }
      } catch (e) {
        console.error("Firestore接続エラー: ", e);
      }
    };
    fetchChants();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldown])

  // 「これ！」ボタンでcurrentChantを切り替え
  const handleVote = (chantId: string) => {
    if (cooldown > 0) return
    const next = teamChants.find((chant) => chant.chantId === chantId);
    if (next) setCurrentChant(next);
    setCooldown(10)
  }

  // currentChant以外を候補として表示
  const candidates = teamChants.filter((chant) => chant.chantId !== currentChant?.chantId);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-700 to-blue-300 relative">
      <Header />
      <main className="flex flex-col h-full min-h-0 w-full max-w-md mx-auto p-0">
        {/* みんなが歌っているチャント（固定） */}
        <section className="px-4 mt-4 shrink-0">
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
            {/* 歌詞（左寄せ） */}
            <div className="text-lg font-bold whitespace-pre-line leading-relaxed text-gray-900 text-left">
              {currentChant?.lyrics}
            </div>
          </div>
        </section>

        {/* 今聞こえているチャントをタップしよう（固定） */}
        <section className="px-4 mt-2 shrink-0">
          <div className="bg-blue-700 text-white rounded-xl py-3 px-2 text-center font-bold text-base shadow">
            今聞こえているチャントをタップしよう！<br />
            <span className="text-xs font-normal">投稿締め切りまで残り {cooldown > 0 ? `${cooldown}秒` : '20秒'}！</span>
          </div>
        </section>

        {/* チャント候補リスト（ここだけスクロール） */}
        <section className="px-4 mt-2 flex-1 min-h-0 flex flex-col">
          <div className="grid grid-cols-3 gap-2 flex-1 overflow-y-auto pb-1">
            {candidates.map((chant) => (
              <div key={chant.chantId} className="bg-white rounded-lg shadow p-2 flex flex-col items-start">
                {/* チャント名のみ表示（左寄せ） */}
                <div className="font-bold text-blue-700 text-xs mb-0.5 text-left">{chant.name}</div>
                <Button
                  className="w-full h-7 bg-blue-700 hover:bg-blue-800 text-white rounded-full py-0 text-xs font-bold min-h-0"
                  onClick={() => handleVote(chant.chantId)}
                  disabled={cooldown > 0}
                >
                  これ！
                </Button>
              </div>
            ))}
          </div>
        </section>

        {cooldown > 0 && (
          <p className="text-center text-xs text-gray-500 mt-2 shrink-0">
            あと {cooldown} 秒で再投票可能
          </p>
        )}
      </main>
      <Footer />
    </div>
  )
}
