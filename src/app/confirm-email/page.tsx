'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@utils/supabaseClient';

export default function ConfirmEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get('type');
  const token = searchParams.get('token');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      if (type === 'signup' && token) {
        const { error } = await supabase.auth.exchangeCodeForSession(token);
        if (error) {
          console.error('Error confirming email:', error.message);
          return;
        }
        router.push('/waiting');
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/waiting');
        }
      }
    };

    handleEmailConfirmation();
  }, [router, type, token]);

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
