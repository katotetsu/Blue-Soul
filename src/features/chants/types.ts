import { Timestamp } from "firebase/firestore";

export type Chant = {
    chantId: string;
    name: string;
    lyrics: string;
    tags: string[];
    playTime?: number;
    year?: number;
    youtubeUrl?: string;
  };
  
export type CurrentChant = {
  chantId: string;
  name: string;
  lyrics: string;
  tags: string[];
  voteCount: number;
  updatedAt: Timestamp;
};
  