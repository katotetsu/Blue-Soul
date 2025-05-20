"use client"
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-[#0D277E] to-[#1847E4] flex justify-around items-center py-3 z-10">
      <button
        className={`flex flex-col items-center text-white focus:outline-none transition ${pathname === "/chant_current" ? "" : "opacity-60"}`}
        onClick={() => router.push('/chant_current')}
      >
        <Image
          src="/images/futter_musicIcon.svg"
          alt="musicIcon"
          width={20}
          height={20}
        />
        <span className="text-xs mt-1 font-bold">現在の応援歌</span>
      </button>
      <button
        className={`flex flex-col items-center text-white focus:outline-none transition ${pathname === "/chant_search" ? "" : "opacity-60"}`}
        onClick={() => router.push('/chant_search')}
      >
        <Image
          src="/images/futter_listIcon.svg"
          alt="listIcon"
          width={20}
          height={20}
        />
        <span className="text-xs mt-1 font-bold">応援歌検索</span>
      </button>
    </nav>
  );
} 