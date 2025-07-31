'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PostLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.isFirstLogin) {
      router.replace('/how-it-works');
    } else {
      router.replace('/input');
    }
  }, [session, status, router]);

  return null; // no UI change
}
