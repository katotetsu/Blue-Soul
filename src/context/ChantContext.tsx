'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchTeamChants } from "@/features/chants/fetchTeamChants";
import { Chant, CurrentChant } from "@/features/chants/types";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ChantContextType = {
  teamChants: Chant[];
  latestCurrentChant: CurrentChant | null;
  isLoading: boolean;
};

const ChantContext = createContext<ChantContextType | undefined>(undefined);

export function ChantProvider({ children }: { children: ReactNode }) {
  const [teamChants, setTeamChants] = useState<Chant[]>([]);
  const [latestCurrentChant, setLatestCurrentChant] = useState<CurrentChant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // チームのチャントを取得
  useEffect(() => {
    const load = async () => {
      const teamOnly = await fetchTeamChants();
      setTeamChants(teamOnly);
      setIsLoading(false);
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

  return (
    <ChantContext.Provider value={{ teamChants, latestCurrentChant, isLoading }}>
      {children}
    </ChantContext.Provider>
  );
}

export function useChants() {
  const context = useContext(ChantContext);
  if (context === undefined) {
    throw new Error('useChants must be used within a ChantProvider');
  }
  return context;
} 