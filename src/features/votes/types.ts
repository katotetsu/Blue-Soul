import { Timestamp } from "firebase/firestore";

export type Vote = {
  chantId: string;
  votedAt: Timestamp;
  userFingerprint: string; // ユーザーを識別するためのフィンガープリント
  // 将来的な拡張用
  userId?: string;
}; 