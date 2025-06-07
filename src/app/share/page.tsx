'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLink } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import Toast from '@/components/appShare/Toast';
import BackButton from '@/components/appShare/BackButton';

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
            <BackButton href="/" />

            {/* メインコンテンツ */}
            <div className="flex flex-col items-center text-center">
                <h1 className="text-xl font-bold text-blue-800 mb-2">
                    アプリを共有しよう！
                </h1>
                <p className="text-sm text-gray-600 mb-4">
                    QRコードを読み込んでアプリを使おう！
                </p>

                {/* QRコードカード */}
                <div className="bg-white p-5 rounded-2xl shadow-lg">
                    <Image
                        src="/images/app_qr.svg"
                        alt="アプリ共有QRコード"
                        width={200}
                        height={200}
                        className="rounded"
                    />
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
