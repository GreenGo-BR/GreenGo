import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // If token exists and user is on login page, redirect to home
    if (token) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [router]);
}
