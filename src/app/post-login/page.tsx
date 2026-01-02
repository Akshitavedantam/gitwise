"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait until the session is loaded
    if (status === "loading") {
      return;
    }

    // If there is no session, send the user to the registration page
    if (!session) {
      router.replace("/register");
      return;
    }
    
    // Check the 'hasOnboarded' flag from the session.
    // If the user has NOT been onboarded yet, it's their "first login" flow.
    if (!session.user.hasOnboarded) {
      router.replace("/how-it-works");
    } else {
      // If they have been onboarded, they are a returning user.
      router.replace("/input");
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-2xl font-semibold animate-pulse">Redirecting...</p>
        <p className="text-gray-400 mt-2">Please wait while we get things ready for you.</p>
      </div>
    </div>
  );
}

