"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@utils/supabaseClient";  // Your existing client

export default function ConfirmEmail() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const type = searchParams.get("type");

    if (type === "signup" && token && email) {
      supabase.auth.verifyOtp({
        token: token as string,
        email: email as string,
        type: "signup",
      }).then(({ error }) => {
        if (error) {
          setStatus("There was an error verifying your email.");
          alert("There was an error verifying your email.");
        } else {
          setStatus("Email confirmed! Redirecting you to login...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);  // Delay just for better UX
        }
      });
    } else {
      setStatus("Invalid or missing verification data.");
    }
  }, [searchParams]);  // Depend directly on searchParams

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
}
