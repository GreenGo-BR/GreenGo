"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuthRedirect(redirectIfAuthenticated = true) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && redirectIfAuthenticated) {
        router.replace("/home");
      } else if (!user && !redirectIfAuthenticated) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router, redirectIfAuthenticated]);
}
