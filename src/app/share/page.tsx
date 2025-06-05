'use client';

import Image from "next/image";

export default function SharePage() {
    const shareUrl = "https://your-app-link.com";

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("リンクをコピーしました！");
    };

    return (
        <>
            <main className="pt-20 pb-24 px-4 min-h-screen bg-gray-50 flex flex-col items-center text-center">
                <h1 className="text-xl font-bold text-blue-800 mb-2">アプリを友達に共有</h1>
                <p className="text-sm text-gray-600 mb-6">下のQRコードを見せるだけ！</p>

                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                    <Image
                        src="/images/app_qr.svg"
                        alt="アプリ共有QRコード"
                        width={200}
                        height={200}
                        className="rounded"
                    />
                </div>

                <button
                    onClick={handleCopy}
                    className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-500 transition"
                >
                    リンクをコピー
                </button>
            </main>
        </>
    );
}
