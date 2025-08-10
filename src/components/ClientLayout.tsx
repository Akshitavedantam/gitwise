"use client";
import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Detect initial page load
  useEffect(() => {
    const handleLoad = () => {
      // Wait a tiny bit so user sees animation even if page is fast
      setTimeout(() => setIsLoading(false), 800); 
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <>
      {isLoading && (
        <div
          className={`fixed inset-0 z-[9999] bg-[#080810] transition-opacity duration-700 ${
            !isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <SplashScreen />
        </div>
      )}

      <div className={`${isLoading ? "invisible" : "visible"}`}>
        {children}
      </div>
    </>
  );
}
