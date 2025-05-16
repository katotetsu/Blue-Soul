// このファイルは「現在のチャント」ページのUIとロジックを定義しています。
// ReactとNext.js、Tailwind CSS、react-iconsを使っています。

'use client'

import { useEffect, useState } from "react"
//import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaMusic } from "react-icons/fa"
import { MdGroups } from "react-icons/md"
//import { IoSearch } from "react-icons/io5"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"

// 現在流れているチャントのダミーデータ
const mockCurrentChant = {
  name: "この街の誇り胸に",
  lyrics: `この街の誇り胸に\n俺たちと共に進もう 富山\nこの街の　誇り胸に`,
  tags: ["チーム"],
}

// 投票候補のチャント（ダミーデータ）
const mockCandidates = [
  { chantId: "a1", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a2", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a3", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a4", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a5", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a6", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a7", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a8", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a9", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
  { chantId: "a10", name: "背中", lyrics: "俺を熱くさせる　お前の背中で…" },
]

export default function ChantCurrentPage() {
  // 投票後のクールダウン（再投票までの待ち時間）を管理するstate
  const [cooldown, setCooldown] = useState(0)

  // クールダウン中は1秒ごとにカウントダウンする処理
  useEffect(() => {
    if (cooldown <= 0) return // クールダウンが0以下なら何もしない
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1) // 1秒ごとに1減らす
    }, 1000)
    return () => clearInterval(interval) // クリーンアップ
  }, [cooldown])

  // 「これ！」ボタンが押されたときの処理
  const handleVote = (chantId: string) => {
    if (cooldown > 0) return // クールダウン中は投票できない
    console.log("Voted for:", chantId) // 実際はここでAPIリクエストなどを行う
    setCooldown(30) // 投票後30秒間クールダウン
  }

  return (
    // ページ全体のレイアウト
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-700 to-blue-300 relative">
      {/* ヘッダー部分（共通コンポーネント） */}
      <Header />

      <main className="flex-1 p-0 w-full max-w-md mx-auto flex flex-col gap-4">
        {/* 現在流れているチャントの表示 */}
        <section className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow p-4 relative">
            <div className="flex items-center justify-between mb-2">
              {/* 音符アイコンとタイトル */}
              <div className="flex items-center gap-1 text-blue-700 font-semibold">
                <FaMusic />
                みんなが歌っているチャント
              </div>
              {/* チームタグ */}
              <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                <MdGroups />チーム
              </span>
            </div>
            {/* 歌詞の表示（複数行） */}
            <div className="text-center text-lg font-bold whitespace-pre-line leading-relaxed text-gray-900">
              {mockCurrentChant.lyrics}
            </div>
          </div>
        </section>

        {/* 投票セクション（青背景） */}
        <section className="px-4 mt-2">
          <div className="bg-blue-700 text-white rounded-xl py-3 px-2 text-center font-bold text-base shadow">
            今聞こえているチャントをタップしよう！<br />
            <span className="text-xs font-normal">投稿締め切りまで残り {cooldown > 0 ? `${cooldown}秒` : '20秒'}！</span>
          </div>
        </section>

        {/* チャント候補リスト（2列グリッド・縦スクロール） */}
        <section className="px-4 mt-2">
          <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pb-1">
            {mockCandidates.map((chant) => (
              <div key={chant.chantId} className="bg-white rounded-lg shadow p-2 flex flex-col items-center">
                {/* チャント名 */}
                <div className="font-bold text-blue-700 text-xs mb-0.5">{chant.name}</div>
                {/* 歌詞の一部 */}
                <div className="text-[10px] text-gray-700 mb-1 text-center line-clamp-2">{chant.lyrics}</div>
                {/* 投票ボタン */}
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

        {/* クールダウン中のメッセージ */}
        {cooldown > 0 && (
          <p className="text-center text-xs text-gray-500 mt-2">
            あと {cooldown} 秒で再投票可能
          </p>
        )}
      </main>

      {/* フッターのナビゲーション（共通コンポーネント） */}
      <Footer />
    </div>
  )
}
