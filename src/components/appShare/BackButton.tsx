'use client';

import { useRouter } from 'next/navigation';

type BackButtonProps = {
    href?: string; // オプションにする
};

export default function BackButton({ href = '/' }: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(href)}
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
    );
}
