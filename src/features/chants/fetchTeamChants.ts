import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Chant } from "./types";

// すべてのチャントを取得する（チームも個人も）
export const fetchTeamChants = async (): Promise<Chant[]> => {
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
 return data.filter((chant) =>
    chant.tags && chant.tags.includes("チーム") &&
    chant.name !== "エンターティナー" &&
    chant.name !== "勝利奪って帰ろう"
  );
};
