//import { FaMusic } from "react-icons/fa";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-10 flex pt-8 pb-4 px-6 bg-gradient-to-b from-blue-700 to-blue-500 rounded-b-3xl shadow text-white">
      <div className="flex items-center">
        {/* 左上の丸いロゴ */}
        <div className="bg-white text-blue-700 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg mr-3 border-2 border-blue-300">KT</div>
        <span className="text-lg font-bold tracking-wide">KATALLER TOYAMA</span>
      </div>
    </header>
  );
} 