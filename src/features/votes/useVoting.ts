'use client'

import { useState, useEffect } from 'react';
import { generateFingerprint } from './generateFingerprint';
import { sendVote } from './sendVote';

export function useVoting() {
  const [cooldown, setCooldown] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [userFingerprint, setUserFingerprint] = useState<string>('');
  const [canVote, setCanVote] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  // 投票可能時間の管理
  useEffect(() => {
    const checkVotingTime = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      // 毎分5秒から60秒（0秒）までが投票可能時間
      const isVotingTime = seconds >= 5;
      setCanVote(isVotingTime);
      
      // 次の集計までの残り秒数を計算
      if (!isVotingTime) {
        // 投票可能時間外の場合、次の投票可能時間までの残り秒数
        setCooldown(5 - seconds);
        // 投票可能時間外になったら投票フラグをリセット
        setHasVoted(false);
      } else {
        // 投票可能時間内の場合、次の分の0秒までの残り秒数
        setCooldown(60 - seconds);
      }
    };

    // 初回チェック
    checkVotingTime();

    // 1秒ごとにチェック
    const timer = setInterval(checkVotingTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // フィンガープリントの生成
  useEffect(() => {
    const fp = generateFingerprint();
    setUserFingerprint(fp);
  }, []);

  // 「これ！」ボタンでcurrentChantを切り替え
  const handleVote = async (chantId: string) => {
    // 投票可能時間外、投票済み、投票処理中、またはフィンガープリントが未生成の場合は何もしない
    if (!canVote || hasVoted || isVoting || !userFingerprint) return;
    
    try {
      setIsVoting(true);
      
      const success = await sendVote(chantId, userFingerprint);
      
      if (success) {
        setHasVoted(true); // 投票成功時にフラグを立てる
      } else {
        console.error("投票の送信に失敗しました");
      }
    } catch (error) {
      console.error("投票処理中にエラーが発生しました:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return {
    cooldown,
    isVoting,
    canVote,
    hasVoted,
    handleVote
  };
} 