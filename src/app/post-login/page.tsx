"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 1. Wait for the session to load
    if (status === "loading") {
      return;
    }

    // 2. If no user is found, kick them back to register
    if (!session) {
      router.replace("/register");
      return;
    }

    // 3. SUCCESS: Redirect to the Input Page
    // NOTE: We are temporarily skipping the 'hasOnboarded' check
    // to ensure you don't hit a 404 error on the missing '/how-it-works' page.
    router.replace("/input");

  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        {/* Simple Loading Spinner */}
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-2xl font-semibold animate-pulse">Redirecting...</p>
        <p className="text-gray-400 mt-2">Taking you to the dashboard.</p>
      </div>
    </div>
  );
}