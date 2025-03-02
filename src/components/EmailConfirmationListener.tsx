'use client';

import { useEffect } from 'react';
import { supabase } from '@utils/supabaseClient'; // Adjust path as necessary

export default function EmailConfirmationListener() {
    useEffect(() => {
        // Listen to auth state changes to handle email verification
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
                // Check if the email is confirmed after sign-in
                const email = session?.user?.email;

                if (email) {
                    try {
                        // Update the pending_agents table to mark email_verified as true and change status to 'verified'
                        const { data, error } = await supabase
                            .from('pending_agents')
                            .update({ email_verified: true, status: 'verified' })
                            .eq('email', email); // Match the email

                        if (error) {
                            console.error('Error updating pending_agents:', error);
                        } else {
                            console.log('Successfully updated pending_agents for agent:', email);
                        }
                    } catch (error) {
                        console.error('Error handling email verification:', error);
                    }
                }
            }
        });

        return () => {
            // Cleanup listener on component unmount
            authListener?.subscription?.unsubscribe(); // Correct way to unsubscribe
        };
    }, []);

    return null; // This component doesn’t need to render anything
}
