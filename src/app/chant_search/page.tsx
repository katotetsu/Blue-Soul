"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ChantCard from "@/components/chant_search/ChantCard";
import ChantLyricsBox from "@/components/chant_search/ChantLyricsBox";
import ChantSearchFilter from "@/components/chant_search/ChantSearchFilter";
import { Chant } from "@/features/chants/types";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export default function ChantSearchPage() {
  const [chants, setChants] = useState<Chant[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"全て" | "チーム" | "個人">("チーム");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const [shouldPlay, setShouldPlay] = useState(false);

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
          onReady: () => {
            if (shouldPlay) {
              playerRef.current?.playVideo();
              setShouldPlay(false);
            }
          },
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
  }, [currentChant, shouldPlay]);

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

  return (
    <div className="relative w-screen flex flex-col h-screen bg-[#F1F2F6] text-foreground overflow-hidden items-start">
      <Header />

      <section className="fixed top-[70px] w-full max-w-md mx-auto px-4 z-0">
        {currentChant && (
          <ChantLyricsBox
            chant={currentChant}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onSliderChange={onSliderChange}
          />
        )}
      </section>

      <ChantSearchFilter
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      <main className="absolute top-[350px] bottom-[60px] overflow-y-auto w-full max-w-md mx-auto px-4 space-y-4">
        <section className="space-y-3 pb-4">
          {filtered.length > 0 ? (
            filtered.map((chant) => (
              <ChantCard
                key={chant.chantId}
                chant={chant}
                isActive={chant.chantId === currentId}
                onClick={() => {
                  setCurrentId(chant.chantId);
                  setShouldPlay(true);

                  setIsPlaying(false);
                  
                  if (chant.youtubeUrl) {
                    const id = extractYoutubeId(chant.youtubeUrl);
                    setCurrentTime(0);
                    setDuration(0);
                    setTimeout(() => {
                      playerRef.current?.loadVideoById?.(id);
                    }, 100);
                  }
                }}
              />
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

