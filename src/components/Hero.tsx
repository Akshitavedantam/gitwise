"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="text-center px-6 py-20">
      <h1 className="text-[48px] font-extrabold font-[inter] text-[#FFFFFF] text-center mx-auto mb-10">
        Decode Complex GitHub Repos
        <br /> in Seconds
      </h1>

      <p className="text-[24px] font-extralight font-[inter] text-[#ffffff] mb-6 mt-[-20px] text-center">
        GitWise turns messy codebases into visual stories — with commit trails,
        <br />
        structure maps, and instant insights.
      </p>

      <button
        onClick={() => router.push("/register")}
        className="relative mt-10 px-8 py-4 rounded-full font-semibold text-white
        bg-gradient-to-r from-purple-600 to-indigo-600 
        hover:scale-105 transition-transform duration-300 ease-in-out 
        overflow-hidden
        before:absolute before:inset-0 before:translate-x-[-100%]
        before:bg-gradient-to-r before:from-white/20 before:via-white/5 before:to-transparent
        before:skew-x-12 before:blur-sm
        before:transition-transform before:duration-1000 before:ease-in-out
        hover:before:translate-x-[150%]"
      >
        Get Started!
      </button>
    </section>
  );
}

