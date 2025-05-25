import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateFingerprint } from "./generateFingerprint";

/**
 * ユーザーがチャントに投票した情報をFirestoreに送信する
 * @param chantId 投票対象のチャントID
 * @param userFingerprint ユーザーを識別するフィンガープリント（省略可）
 * @returns 成功した場合はtrue、失敗した場合はfalse
 */
export const sendVote = async (
  chantId: string, 
  userFingerprint?: string
): Promise<boolean> => {
  try {
    // フィンガープリントが指定されていない場合は自動生成
    const fingerprint = userFingerprint || generateFingerprint();
    
    // votesコレクションに新しいドキュメントを追加
    await addDoc(collection(db, "votes"), {
      chantId,
      votedAt: serverTimestamp(),  // サーバー側のタイムスタンプを使用
      userFingerprint: fingerprint,
      // 将来的にはユーザーIDなども追加可能
    });
    
    console.log(`Vote sent for chant: ${chantId}, fingerprint: ${fingerprint}`);
    return true;
  } catch (error) {
    console.error("Error sending vote:", error);
    return false;
  }
}; 