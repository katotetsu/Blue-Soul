"use client"
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function ChantSearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-700 to-blue-300 relative">
      <Header />
      <main className="flex-1 p-4 max-w-xl mx-auto w-full flex flex-col items-center justify-center">
        {/* ここに応援歌検索のUIを実装 */}
        <h1 className="text-xl font-bold text-blue-700 mb-4">応援歌検索ページ</h1>
        <p className="text-gray-600">このページに応援歌検索の機能を実装してください。</p>
      </main>
      <Footer />
    </div>
  );
} 