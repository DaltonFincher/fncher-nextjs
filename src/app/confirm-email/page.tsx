'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@utils/supabaseClient';

export default function ConfirmEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const type = searchParams.get('type');
      const token = searchParams.get('token');

      if (type === 'signup' && token) {
        // Supabase will exchange this token for a session
        const { error } = await supabase.auth.exchangeCodeForSession(token);

        if (error) {
          console.error('Error confirming email:', error.message);
          return; // Optionally show an error message
        }

        // After successful email confirmation and login, redirect to waiting page
        router.push('/waiting');
      } else {
        // Optional: If they manually visit this page (not from email link), check if they are already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/waiting');
        }
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4D6575] to-[#E8F1F5]">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
        <img src="/Fncherlogo1.png" alt="Fncher Logo" className="w-24 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Confirming your email...</h1>
        <p className="text-gray-600">Please wait while we complete your email verification.</p>
      </div>
    </div>
  );
}
