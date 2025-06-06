'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLink } from 'react-icons/fi';
import { IoShareOutline } from 'react-icons/io5';
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'カターレ富山 | 応援歌(チャント)検索アプリ',
                    text: 'カターレ富山の応援歌(チャント)をリアルタイムで表示・投票できるアプリ。みんなで応援しよう',
                    url: shareUrl,
                });
            } catch (err) {
                console.log('シェアキャンセル or エラー', err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <main className="pt-15 pb-15 px-4 min-h-screen bg-gray-50 relative">
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
            <div className="flex flex-col items-center text-center mt-8">
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
                    <p className="text-blue-700 text-base font-bold tracking-wide">
                        @BlueSoulApp
                    </p>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleShare}
                        className="flex flex-col items-center justify-center w-28 h-20 bg-white rounded-2xl shadow hover:shadow-md transition active:scale-95"
                    >
                        <IoShareOutline className="w-6 h-6 mb-2 text-gray-700" />
                        <span className="text-xs text-gray-700">共有する</span>
                    </button>

                    <button
                        onClick={handleCopy}
                        className="flex flex-col items-center justify-center w-28 h-20 bg-white rounded-2xl shadow hover:shadow-md transition active:scale-95"
                    >
                        <FiLink className="w-6 h-6 mb-2 text-gray-700" />
                        <span className="text-xs text-gray-700">リンクをコピー</span>
                    </button>
                </div>

                {/* トースト */}
                {showToast && (
                    <div className="">
                        <Toast
                            message="URLをコピーしました！"
                            show={true}
                            onClose={() => setShowToast(false)}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
