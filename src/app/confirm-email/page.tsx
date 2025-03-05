'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@utils/supabaseClient';  // Import supabase from your supabaseClient.ts

export default function ConfirmEmail() {
  const router = useRouter();

  useEffect(() => {
    const checkForSession = async () => {
      // Optional: Check if they are already logged in (edge case where user reloads this page after email confirm)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/waiting');  // If they are already logged in, go to waiting page
      }
    };

    checkForSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4D6575] to-[#E8F1F5]">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
        <img src="/Fncherlogo1.png" alt="Fncher Logo" className="w-24 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Check your email!</h1>
        <p className="text-gray-600">We’ve sent you a confirmation email. Please click the link inside to verify your account.</p>
        <p className="text-gray-500">If you don’t see it, check your spam folder.</p>
        <button
          className="mt-4 px-4 py-2 bg-[#4D6575] text-white rounded hover:bg-[#32434D]"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
