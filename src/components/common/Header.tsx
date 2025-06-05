//import { FaMusic } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { BiQrScan } from "react-icons/bi";

export default function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full z-10 flex justify-between items-center pt-3 px-4">
      {/* 左：ロゴとタイトル */}
      <div className="flex items-center">
        {/* 左上の丸いロゴ */}
        <div className="bg-white text-blue-700 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg mr-3 border-2 border-blue-300">
          KT
        </div>
        <span className="text-xl font-bold tracking-wide">KATALLER TOYAMA</span>
      </div>

      {/* 右：共有ボタン */}
      <button
        onClick={() => router.push('/share')}
        className="flex items-center gap-1 px-2 py-1 border border-blue-300 rounded-md text-blue-700 text-sm font-medium hover:bg-blue-50 active:scale-95 transition"
        aria-label="QRコードで共有"
      >
        <BiQrScan size={20} />
        <span>共有</span>
      </button>

    </header>
  );
}
