"use client"
import { FaMusic } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-blue-700 to-blue-500 flex justify-around items-center py-2 z-10">
      <button
        className="flex flex-col items-center text-white focus:outline-none"
        onClick={() => router.push('/chant_current')}
      >
        <FaMusic size={22} />
        <span className="text-xs mt-1 font-bold">現在の応援歌</span>
      </button>
      <button
        className="flex flex-col items-center text-white focus:outline-none"
        onClick={() => router.push('/chant_search')}
      >
        <IoSearch size={22} />
        <span className="text-xs mt-1 font-bold">応援歌検索</span>
      </button>
    </nav>
  );
} 