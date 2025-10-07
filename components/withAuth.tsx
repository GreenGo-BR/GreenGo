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

import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

function TopLoadingBar({ loading }: { loading: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
        <div
          className="h-1 transition-opacity duration-300"
          style={{
            backgroundColor: "#16a34ae6",
            animation: "loading-bar 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export function withAuth<P>(
  WrappedComponent: ComponentType<P & { token: string; uid: string }>
) {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [uid, setUid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const tempToken = localStorage.getItem("tempToken");
      if (tempToken) {
        router.replace("/2fa");
        return;
      } else {
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
      }
    }, [router]);

    return (
      <>
        <TopLoadingBar loading={loading} />

        {/* Let background layout render, only block page content */}
        {!loading && token && uid ? (
          <WrappedComponent {...props} token={token} uid={uid} />
        ) : null}
      </>
    );
  };

  return AuthenticatedComponent;
}

// import { ComponentType, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth } from "@/lib/firebase"; // adjust import

// function TopLoadingBar({ loading }: { loading: boolean }) {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (loading) {
//       setVisible(true);
//     } else {
//       const timeout = setTimeout(() => setVisible(false), 400);
//       return () => clearTimeout(timeout);
//     }
//   }, [loading]);

//   if (!visible) return null;

//   return (
//     <>
//       <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
//         <div
//           className="h-1"
//           style={{
//             backgroundColor: "#16a34ae6",
//             animation: "loading-bar 1.5s ease-in-out infinite",
//           }}
//         ></div>
//       </div>

//       <style jsx>{`
//         @keyframes loading-bar {
//           0% {
//             width: 0%;
//           }
//           50% {
//             width: 70%;
//           }
//           100% {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

// export function withAuth<P>(
//   WrappedComponent: ComponentType<P & { token?: string; uid?: string }>
// ) {
//   const AuthenticatedComponent = (props: P) => {
//     const router = useRouter();
//     const [token, setToken] = useState<string | null>(null);
//     const [uid, setUid] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//       const unsubscribe = auth.onAuthStateChanged(async (user) => {
//         if (!user) {
//           router.replace("/login");
//           return;
//         }

//         try {
//           const idToken = await user.getIdToken();
//           setToken(idToken);
//           setUid(user.uid);
//           localStorage.setItem("authToken", idToken);
//         } catch (err) {
//           console.error("Error getting Firebase token:", err);
//           router.replace("/login");
//         } finally {
//           setLoading(false);
//         }
//       });

//       return () => unsubscribe();
//     }, [router]);

//     return (
//       <>
//         <TopLoadingBar loading={loading} />
//         <WrappedComponent {...props} token={token ?? ""} uid={uid ?? ""} />
//       </>
//     );
//   };

//   return AuthenticatedComponent;
// }
