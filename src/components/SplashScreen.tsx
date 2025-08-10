"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function SplashScreen() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/animations/splash.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("❌ Splash load error:", err));
  }, []);

  if (!animationData) {
    return (
      <div className="w-full h-full bg-[#080810] flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
}
