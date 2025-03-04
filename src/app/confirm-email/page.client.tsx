"use client";

import { useEffect, useState } from "react";
import { supabase } from "@utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState("Verifying your email...");
  const router = useRouter();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Email confirmation error:", error.message);
        setStatus("Error confirming your email. Please try again.");
        return;
      }

      // This only works if the link was valid (token is processed automatically)
      if (data.session) {
        setStatus("Email confirmed successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setStatus("Invalid or expired confirmation link.");
      }
    };

    handleEmailConfirmation();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">{status}</h1>
      </div>
    </div>
  );
}
