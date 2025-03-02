"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@utils/supabaseClient";  // Your existing client

export default function ConfirmEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email"); // Extract email as well
  const type = searchParams.get("type");

  useEffect(() => {
    if (type === "signup" && token && email) {
      // Call supabase.auth.verifyOtp() with token and email
      supabase.auth.verifyOtp({
        token: token as string,
        email: email as string,
        type: "signup", // or "email", depending on what you need
      }).then(({ error }) => {
        if (error) {
          alert("There was an error verifying your email.");
        } else {
          alert("Email confirmed! You can now log in.");
          window.location.href = "/login"; // Redirect after success
        }
      });
    }
  }, [token, email, type]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Verifying your email...</h1>
    </div>
  );
}
