"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();



  const handleNavClick = (item: string) => {
    if (item === "Home") {
      router.push("/"); // You can replace this with `#hero` if you use smooth scroll
    } else if (item === "About") {
      router.push("/how-it-works");
    } else if (item === "GitHub") {
      if (session?.user?.name) {
        window.open(`https://github.com/${session.user.name}`, "_blank");
      } else {
        router.push("/register");
      }
    }
  };

  return (
    <nav className="h-[47px] flex justify-between items-center px-10 bg-[#ffffff]/2 backdrop-blur-sm backdrop-saturate-150 sticky top-0 z-50">
      <div className="text-[60px] font-normal font-[Jomhuria] text-[#ffffff] relative top-[6px]">
        GitWise
      </div>

      <ul className="flex gap-24 text-[16px] font-sans">
        {["Home", "About", "GitHub"].map((item) => (
          <li key={item}>
            <button
              onClick={() => handleNavClick(item)}
              className="group relative text-white hover:text-[#C4A7FF] transition-colors duration-300"
            >
              {item}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#C4A7FF] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </li>
        ))}
      </ul>

      <div>
        <button
          onClick={() => router.push("/register")}
          className="border border-gray-600 px-4 py-2 rounded-[20px] text-gray-300 hover:text-white hover:border-white transition-all duration-300 relative top-[4px]"
        >
          Login/Signup
        </button>
      </div>
    </nav>
  );
}
