"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useState } from "react";
import { Play, Pause } from "lucide-react";

const chants = [
  {
    title: "この街の誇り胸に",
    lyrics: "俺たちと共に進もう　富山\nこの街の　誇り胸に",
    time: "1:05",
    isPlaying: true,
    tag: "チームチャント",
  },
  { title: "青中", lyrics: "", time: "0:35", isPlaying: false },
  { title: "エンターテイナー", lyrics: "", time: "0:36", isPlaying: false },
  { title: "立ち上がって歌おう", lyrics: "", time: "0:40", isPlaying: false },
];

export default function ChantSearchPage() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* 昇格バナー */}
      <div className="bg-blue-800 text-white py-2 text-center">
        <div className="font-bold text-xl">KATALLER TOYAMA</div>
        <div className="text-sm bg-white text-black inline-block px-3 py-1 rounded mt-2">
          <strong>J2昇格</strong> <span className="text-xs">2024.12.7</span>
        </div>
        <div className="mt-2 flex justify-center">
          <img src="/images/players_celebrating.png" alt="選手たち" className="h-24" />
        </div>
      </div>

      <main className="flex-1 p-4 max-w-xl mx-auto w-full">
        {/* 現在のチャント */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-blue-900 font-bold text-base">
              この街の誇り胸に
            </h2>
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
              チームチャント
            </span>
          </div>
          <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">
            俺たちと共に進もう　富山{"\n"}この街の　誇り胸に
          </p>
          <div className="flex items-center mt-2 space-x-2 text-sm text-blue-800">
            <span>0:15</span>
            <input type="range" className="flex-1" />
            <span>1:05</span>
            <button onClick={() => setPlaying(!playing)}>
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>

        {/* 絞り込み */}
        <div className="flex items-center space-x-2 mb-2">
          <button className="text-sm border rounded-full px-3 py-1">チームチャント</button>
          <button className="text-sm border rounded-full px-3 py-1">選手チャント</button>
        </div>
        <input
          type="text"
          placeholder="キーワード検索..."
          className="w-full border rounded px-3 py-2 mb-4 text-sm"
        />

        {/* チャント一覧 */}
        <div className="space-y-3">
          {chants.map((chant, i) => (
            <div
              key={i}
              className="border rounded-lg px-4 py-2 shadow-sm flex justify-between items-center bg-gray-50"
            >
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {chant.title}
                </div>
                <div className="text-xs text-gray-500">{chant.time}</div>
              </div>
              {chant.isPlaying && (
                <span className="text-xs text-blue-600 font-bold">再生中</span>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
