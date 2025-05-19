/**
 * ブラウザのプロパティを使用して簡易的なユーザーフィンガープリントを生成する
 * 注: このフィンガープリントは完全に一意ではなく、単純な識別子として使用
 * 
 * @returns 生成されたフィンガープリント文字列
 */
export const generateFingerprint = (): string => {
  // クライアントサイドでのみ実行されるように確認
  if (typeof window === 'undefined') return 'server-side';

  // ブラウザの情報を収集
  const { userAgent, language, platform } = window.navigator;
  const colorDepth = window.screen.colorDepth;
  const pixelRatio = window.devicePixelRatio;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // 収集した情報を組み合わせて一意の文字列を作成
  const rawFingerprint = `${userAgent}|${language}|${platform}|${colorDepth}|${pixelRatio}|${screenWidth}x${screenHeight}|${timeZone}`;
  
  // 簡易的なハッシュ関数（本番環境では暗号化ハッシュを使用することを推奨）
  let hash = 0;
  for (let i = 0; i < rawFingerprint.length; i++) {
    const char = rawFingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  
  // 正の16進数文字列として返す
  return (hash >>> 0).toString(16);
}; 