"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@utils/supabaseClient"; // Your Supabase client

export default function ConfirmEmail() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying your email...");
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token && email) {
      // Call Supabase's verifyOtp method to confirm the email
      supabase.auth.verifyOtp({ token, email, type: "signup" })
        .then(({ error }) => {
          if (error) {
            setStatus("There was an error verifying your email.");
          } else {
            setStatus("Email verified! You can now log in.");
            setTimeout(() => {
              window.location.href = "/login"; // Redirect after success
            }, 2000); // Optional delay for better UX
          }
        })
        .catch(() => {
          setStatus("Invalid or expired verification link.");
        });
    } else {
      setStatus("Invalid or missing verification data.");
    }
  }, [token, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">{status}</h1>
        {/* Add any additional helpful content here */}
      </div>
    </div>
  );
}
