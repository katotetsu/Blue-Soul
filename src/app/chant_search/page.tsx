"use client";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

import { useEffect, useRef, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Play, Pause } from "lucide-react";
import { Chant } from "@/features/chants/types";
import { fetchTeamChants } from "@/features/chants/fetchTeamChants";


export default function ChantSearchPage() {
  const [chants, setChants] = useState<Chant[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"全て" | "チーム" | "個人">("全て");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const loadChants = async () => {
      const allChants = await fetchTeamChants();
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
          onStateChange: (event: any) => {
            const state = event.data;
            if (state === window.YT.PlayerState.ENDED) {
              playerRef.current.seekTo(0);
              playerRef.current.playVideo();
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

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden pt-24 pb-20 px-3">
      <Header />

      <section className="flex-shrink-0 max-w-xl w-full mx-auto">
  { !currentChant ? null : (
    <div className="bg-card text-foreground rounded-xl shadow border border-border">
      
      {/* 🎵 ラベル部分 */}
      <div className="flex items-center justify-between bg-blue-800 text-white px-3 py-2 rounded-t-xl">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <img src="/chant_kashi.png" alt="チャントの歌詞" className="w-7 h-7" />

          <span>チャントの歌詞</span>
        </div>
        <span className="text-blue-800 bg-white border border-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
          {currentChant.tags.join(", ")}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold text-lg !text-blue-800">{currentChant.name}</div>
          {currentChant.youtubeUrl && (
            <a href={currentChant.youtubeUrl} target="_blank" rel="noopener noreferrer">
              <img src="/youtube.png" alt="YouTube" className="w-16 h-8" />
            </a>
          )}
        </div>

        <div className="text-lg whitespace-pre-line text-black mb-3 leading-tight font-bold">
          {currentChant.lyrics}
        </div>

        <div className="flex items-center gap-2 text-sm text-primary">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSliderChange(parseFloat(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <span>{formatTime(duration)}</span>
          <button onClick={togglePlay}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>
    </div>
  )}
</section>




      <section className="max-w-xl w-full mx-auto px-3 mt-4 mb-4">
        <div className="text-sm font-semibold flex items-center gap-1 text-blue-800">
          <img src="/Narrow_down.png" alt="絞り込み" className="w-6 h-6" />
          絞り込み
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="キーワード検索 ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm rounded border border-input bg-muted text-muted-foreground"
          />
          <button
            onClick={() => setTypeFilter("チーム")}
            className={`px-3 py-1 text-sm rounded border ${typeFilter === "チーム" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            チーム
          </button>
          <button
            onClick={() => setTypeFilter("個人")}
            className={`px-3 py-1 text-sm rounded border ${typeFilter === "個人" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            個人
          </button>
        </div>
      </section>

      <main className="flex-1 overflow-y-auto max-w-xl w-full mx-auto px-3 space-y-4">
        <section className="space-y-3 pb-4">
          {filtered.length > 0 ? (
            filtered.map((chant) => (
              <div
  key={chant.chantId}
  onClick={() => {
    setCurrentId(chant.chantId);
    if (chant.youtubeUrl) {
      const id = extractYoutubeId(chant.youtubeUrl);
      const url = `https://www.youtube.com/embed/${id}?autoplay=1`;
      setCurrentTime(0);
      setDuration(0);
      setTimeout(() => {
        if (playerRef.current?.loadVideoById) {
          playerRef.current.loadVideoById(id);
        }
      }, 100);
    }
  }}
  className={`rounded-lg px-4 py-3 text-sm bg-card text-foreground border flex items-center cursor-pointer ${
    currentId === chant.chantId ? "border-primary ring-1 ring-primary" : "border-border"
  }`}
>
  {/* 左アイコン */}
  <img src="/chant.png" alt="icon" className="w-8 h-8 mr-3" />

  {/* 中央: タイトルと歌詞 */}
  <div className="flex-1">
    <div className="font-semibold text-blue-800">{chant.name}</div>
    <div className="text-xs text-muted-foreground">{truncateText(chant.lyrics, 30)}</div>
  </div>

  {/* 右側: 時間と表示中 */}
  <div className="text-xs flex flex-col items-end ml-2">
    <span>
      {chant.playTime
        ? `${Math.floor(chant.playTime / 60)}:${String(chant.playTime % 60).padStart(2, "0")}`
        : "0:00"}
    </span>
    {currentId === chant.chantId && (
      <span className="text-primary text-[11px] font-bold mt-0.5">表示中</span>
    )}
  </div>
</div>

            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground">一致するチャントが見つかりませんでした。</div>
          )}
        </section>
      </main>

      <Footer />

      <div id="yt-player" className="hidden" />
    </div>
  );
}
