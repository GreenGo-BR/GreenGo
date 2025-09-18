/* "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import type { ComponentType } from "react";

// Define the expected structure of the decoded token
interface DecodedToken {
  exp: number; // expiration time (in seconds since epoch)
  userId: number;
  [key: string]: any; // additional payload fields if needed
}

export function withAuth<P>(
  WrappedComponent: ComponentType<P & { token: string }>
) {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const t = localStorage.getItem("authToken");

      if (!t) {
        router.replace("/login");
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(t);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
          // Token is expired
          localStorage.removeItem("authToken");
          router.replace("/login");
        } else {
          setToken(t);
          setUserId(decoded.userId);
        }
      } catch (err) {
        // Token is invalid
        localStorage.removeItem("authToken");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }, [router]);

    if (loading) return <div>Loading...</div>; // Or a proper <LoadingSpinner />

    if (!token || !userId) return null;

    return <WrappedComponent {...props} token={token} userId={userId} />;
  };

  return AuthenticatedComponent;
}
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ComponentType } from "react";
import { auth } from "@/lib/firebase";

export function withAuth<P>(
  WrappedComponent: ComponentType<P & { token: string; uid: string }>
) {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [uid, setUid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }

        try {
          const idToken = await user.getIdToken();
          setToken(idToken);
          setUid(user.uid);
          localStorage.setItem("authToken", idToken);
        } catch (err) {
          console.error("Error getting Firebase token:", err);
          router.replace("/login");
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) return <div>Loading...</div>;
    if (!token || !uid) return null;

    return <WrappedComponent {...props} token={token} uid={uid} />;
  };

  return AuthenticatedComponent;
}
