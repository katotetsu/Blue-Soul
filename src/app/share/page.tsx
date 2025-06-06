'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLink } from 'react-icons/fi';
import { IoShareOutline } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import Toast from '@/components/appShare/Toast';

export default function SharePage() {
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();
    const shareUrl = 'https://blue-soul.vercel.app/';

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setShowToast(true);
    };

    const handleTweet = () => {
        const tweetText = [
            'みんなで歌おう！📣📱',
            'カターレ富山のチャントがスマホですぐ見れる',
            '#カターレ富山 #チャントアプリ'
        ].join('\n\n');

        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank');
    };

    return (
        <main className="pt-24 pb-24 px-4 min-h-screen bg-gray-50 relative">
            {/* 戻るボタン */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-10 left-6 flex items-center gap-1 px-2.5 py-1 text-sm border border-gray-300 bg-white/70 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full shadow-sm backdrop-blur-sm transition"
                aria-label="前のページに戻る"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                戻る
            </button>

            {/* メインコンテンツ */}
            <div className="flex flex-col items-center text-center">
                <h1 className="text-xl font-bold text-blue-800 mb-2">
                    アプリを共有しよう！
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                    QRコードを読み込んでアプリを使おう！
                </p>

                {/* QRコードカード */}
                <div className="bg-white pt-5 px-5 rounded-2xl shadow-lg">
                    <Image
                        src="/images/app_qr.svg"
                        alt="アプリ共有QRコード"
                        width={200}
                        height={200}
                        className="rounded"
                    />
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D277E] to-[#1847E4] text-base font-black tracking-wide mb-3 mt-1">
                        @BlueSoul
                    </p>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleTweet}
                        className="flex flex-col items-center justify-center w-28 h-18 bg-white rounded-2xl shadow hover:shadow-md transition active:scale-95 shadow-lg"
                    >
                        <FaXTwitter className="w-6 h-6 mb-2 text-black" />
                        <span className="text-xs text-gray-700 font-bold">Xで共有する</span>
                    </button>

                    <button
                        onClick={handleCopy}
                        className="flex flex-col items-center justify-center w-28 h-18 bg-white rounded-2xl shadow hover:shadow-md transition active:scale-95 shadow-lg"
                    >
                        <FiLink className="w-6 h-6 mb-2 text-gray-700" />
                        <span className="text-xs text-gray-700 font-bold">リンクをコピー</span>
                    </button>
                </div>

                {/* Powerd by blue soul */}
                <div className="mt-6 text-xs text-gray-500">
                    <p>Powered by BlueSoul</p>
                </div>

                {/* トースト */}
                {showToast && (
                    <Toast
                        message="URLをコピーしました！"
                        show={true}
                        onClose={() => setShowToast(false)}
                    />
                )}
            </div>
        </main >
    );
}
