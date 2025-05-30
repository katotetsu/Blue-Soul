"use client";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string | number;
          width: string | number;
          videoId: string;
          playerVars?: Record<string, string | number | boolean>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: YTPlayerEvent) => void;
            onError?: () => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  loadVideoById: (videoId: string) => void;
}

interface YTPlayerEvent {
  data: number;
  target: YTPlayer;
}

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Play, Pause } from "lucide-react";
import { Chant } from "@/features/chants/types";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChantSearchPage() {
  const [chants, setChants] = useState<Chant[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"全て" | "チーム" | "個人">("全て");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    const loadChants = async () => {
      const snapshot = await getDocs(collection(db, "chants"));
      const allChants: Chant[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
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
      setChants(allChants);
      if (allChants.length > 0) {
        setCurrentId(allChants[0].chantId);
      }
    };
    loadChants();
  }, []);

  const currentChant = chants.find((c) => c.chantId === currentId);

  const filtered = chants.filter((chant) => {
    const matchText =
      chant.name.toLowerCase().includes(search.toLowerCase()) ||
      chant.lyrics.toLowerCase().includes(search.toLowerCase());

    const matchType =
      typeFilter === "全て" || (Array.isArray(chant.tags) && chant.tags.includes(typeFilter));

    return matchText && matchType;
  });

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(tag, firstScript);
  }, []);

  useEffect(() => {
    if (!currentChant?.youtubeUrl) return;

    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player("yt-player", {
        height: "0",
        width: "0",
        videoId: extractYoutubeId(currentChant.youtubeUrl!),
        playerVars: {
          loop: 1,
          playlist: extractYoutubeId(currentChant.youtubeUrl!),
        },
        events: {
          onReady: () => {},
          onStateChange: (event: YTPlayerEvent) => {
            const state = event.data;
            if (state === window.YT.PlayerState.ENDED) {
              playerRef.current?.seekTo(0);
              playerRef.current?.playVideo();
            }
            setIsPlaying(state === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    if (window.YT?.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }, [currentChant]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
        setDuration(playerRef.current.getDuration());
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player || !player.getPlayerState) return;

    const state = player.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const onSliderChange = (value: number) => {
    playerRef.current?.seekTo(value, true);
    setCurrentTime(value);
  };

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  return (
  <div className="relative flex flex-col h-screen bg-[#F1F2F6] text-foreground overflow-hidden pt-4 px-3 items-start">
    <Header />

    {/* チャント表示部分 */}
   <section className="fixed top-[70px] w-full max-w-md z-0">
  {!currentChant ? null : (
    <div className="rounded-2xl shadow overflow-hidden border border-border bg-white">
      <div className="flex items-center justify-between bg-blue-800 text-white px-4 py-2">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Image src="/chant_kashi.png" alt="チャントの歌詞" width={28} height={28} />
          <span>チャントの歌詞</span>
        </div>
        <span className="text-blue-800 bg-white border border-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
          {currentChant.tags.join(", ")}
        </span>
      </div>

      {/* 歌詞エリアと固定バー */}
      <div className="relative px-4 pt-3 pb-[50px] h-[190px]">
        <div className="text-lg text-black leading-tight font-bold h-[140px] overflow-hidden whitespace-pre-line">
          <div className="flex items-center justify-between mb-1">
            <div className="text-blue-800 font-black text-lg md:text-2xl">
              {currentChant.name}
            </div>
            {currentChant.youtubeUrl && (
              <a
                href={currentChant.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2"
              >
                <Image
                  src="/youtube.png"
                  alt="YouTube"
                  width={64}
                  height={32}
                  className="object-contain"
                />
              </a>
            )}
          </div>
          {currentChant.lyrics}
        </div>

        <div className="absolute bottom-2 left-4 right-4 flex items-center gap-2 text-sm text-primary">
          <span className="w-10 text-left">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSliderChange(parseFloat(e.target.value))}
            className="flex-1 accent-blue-500 "
            style={{ maxWidth: "70%" }} 
          />
          <span className="w-8 text-right">{formatTime(duration)}</span>
          <button onClick={togglePlay}
           className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
            {isPlaying ? <Pause size={20} className="text-white"/> : <Play size={20} className="text-white"/>}
          </button>
        </div>
      </div>
    </div>
  )}
</section>


    {/* 検索バーとフィルター */}
    <section className="w-full max-w-md sticky top-[300px] z-20 bg-[#F1F2F6] pb-2 px-4">
  <div className="text-sm font-semibold flex items-center gap-1 text-blue-800 mb-1">
    <Image src="/Narrow_down.png" alt="絞り込み" width={24} height={24} />
    絞り込み
  </div>

  <div className="flex items-center gap-2 w-full">
    {/* 🔍 検索ボックス */}
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
      </span>
      <input
        type="text"
        placeholder="キーワード検索 ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-blue-700 focus:outline-none bg-white"
      />
    </div>

    {/* チーム / 個人 タブボタン */}
    <div className="flex border border-blue-700 rounded-md overflow-hidden text-sm">
      <button
        onClick={() => setTypeFilter("チーム")}
        className={`px-3 py-2 transition-colors ${
          typeFilter === "チーム"
            ? "bg-blue-700 text-white"
            : "bg-white text-blue-700"
        }`}
      >
        チーム
      </button>
      <button
        onClick={() => setTypeFilter("個人")}
        className={`px-3 py-1 transition-colors ${
          typeFilter === "個人"
            ? "bg-blue-700 text-white"
            : "bg-white text-blue-700"
        }`}
      >
        個人
      </button>
    </div>
  </div>
</section>


    {/* チャント一覧リスト */}
    <main className="absolute top-[390px] bottom-[60px] overflow-y-auto w-full max-w-md space-y-4">
      <section className="space-y-3 pb-4">
        {filtered.length > 0 ? (
          filtered.map((chant) => (
            <div
              key={chant.chantId}
              onClick={() => {
                setCurrentId(chant.chantId);
                if (chant.youtubeUrl) {
                  const id = extractYoutubeId(chant.youtubeUrl);
                  setCurrentTime(0);
                  setDuration(0);
                  setTimeout(() => {
                    if (playerRef.current?.loadVideoById) {
                      playerRef.current.loadVideoById(id);
                    }
                  }, 100);
                }
              }}
              className={`rounded-2xl shadow px-4 py-3 text-sm border flex items-center cursor-pointer ${currentId === chant.chantId ? "bg-blue-200 text-white border-blue-700 ring-1 ring-blue-700" : "bg-white text-black border-border"}`}
            >
              <Image src="/chant.png" alt="icon" width={32} height={32} className="mr-3" />
              <div className="flex-1">
                <div className="font-semibold text-blue-800">{chant.name}</div>
                <div className="text-xs text-muted-foreground">
                  {truncateText(chant.lyrics, 15)}
                </div>
              </div>
              <div className="text-xs flex flex-col items-end ml-2">
                <span className="text-black">
                  {chant.playTime ? `${Math.floor(chant.playTime / 60)}:${String(chant.playTime % 60).padStart(2, "0")}` : "0:00"}
                </span>
                {currentId === chant.chantId && (
                  <span className="text-primary text-[11px] font-bold mt-0.5">表示中</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            一致するチャントが見つかりませんでした。
          </div>
        )}
      </section>
    </main>

    <Footer />
    <div id="yt-player" className="hidden" />
  </div>
);
}
