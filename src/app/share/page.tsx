'use client';

import { useState } from 'react';
import { FiLink } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import Toast from '@/components/appShare/Toast';
import BackButton from '@/components/appShare/BackButton';

export default function SharePage() {
    const [showToast, setShowToast] = useState(false);
    const shareUrl = 'https://blue-soul.vercel.app/';

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setShowToast(true);
    };

    // tweetText は aタグ用に事前に用意する
    const tweetText = [
        'みんなで応援しよう！📣📱',
        '📱 今のチャント（応援歌）がわかる',
        '🔍 歌詞を検索できる',
        '📦 インストール不要、QRを読み込むだけ！',
        '',
        '#カターレ富山 #kataller',
        '#応援サポートアプリ',
        '',
        'https://blue-soul.vercel.app/'
    ].join('\n');

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

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
                <div className="bg-white px-7 pt-7 pb-3 rounded-2xl shadow-md border border-gray-200">
                    <Image
                        src="/images/app_qr.svg"
                        alt="アプリ共有QRコード"
                        width={175}
                        height={175}
                        className="rounded"
                    />

                    <p className="text-sm font-bold text-gray-400 pt-1">
                        @ kataller-toyama
                    </p>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-3 mt-4">
                    {/* Xで共有する (aタグ版) */}
                    <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center w-28 h-18 bg-gray-800 text-white rounded-xl shadow-md hover:bg-gray-900 active:scale-95 transition"
                    >
                        <FaXTwitter className="w-6 h-6 mb-2" />
                        <span className="text-xs font-bold">Xで共有する</span>
                    </a>

                    {/* リンクをコピー */}
                    <button
                        onClick={handleCopy}
                        className="flex flex-col items-center justify-center w-28 h-18 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 active:scale-95 transition"
                    >
                        <FiLink className="w-6 h-6 mb-2" />
                        <span className="text-xs font-bold">リンクをコピー</span>
                    </button>
                </div>

                {/* Powered by blue soul */}
                <div className="mt-6 text-xs text-gray-500">
                    <p>Powered by Blue-Soul</p>
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
        </main>
    );
}
