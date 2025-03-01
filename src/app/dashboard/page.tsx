'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabaseClient'; // Ensure this import path matches your file location

interface Agent {
    id: number;
    full_name: string;
    email: string;
    license_number: string;
    created_at: string;
}

export default function Dashboard() {
    const [pendingAgents, setPendingAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [user, setUser] = useState<any>(null); // Store authenticated user
    const [authLoading, setAuthLoading] = useState(true); // Track auth session loading state

    useEffect(() => {
        fetchPendingAgents();
        getAuthenticatedUser();
    }, []); // Only fetch on mount

    // Fetch the authenticated user session
    async function getAuthenticatedUser() {
        try {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                throw error;
            }

            setUser(data.user);
        } catch (err) {
            console.error('Error fetching user:', err);
        } finally {
            setAuthLoading(false);
        }
    }

    async function fetchPendingAgents() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('pending_agents')
                .select('*')
                .eq('status', 'pending');  // Fetch only pending agents from the "pending_agents" table

            if (error) {
                throw error;  // Throw if there's an error fetching from Supabase
            }

            console.log('Fetched Pending Agents:', data);

            if (data && Array.isArray(data)) {
                setPendingAgents(data);  // Set the real data from Supabase
            } else {
                setError('No pending agents found.');
            }
        } catch (err: any) {
            setError('Failed to load pending agents');
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(email: string) {
        try {
            // Get the auth token
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('User is not authenticated.');
            }

            const response = await fetch('/api/verify-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send the token in the header
                },
                body: JSON.stringify({ email }), // Send the email of the agent to verify
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Success message
                fetchPendingAgents();  // Refresh list after verifying
            } else {
                alert(`Failed to verify agent: ${result.error}`); // Error message
            }
        } catch (error: any) {
            alert(`Failed to verify agent: ${error.message}`);
        }
    }

    if (authLoading) {
        return <div>Loading user session...</div>; // Show loading state while checking user session
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-2xl font-bold mb-4">Pending Agents</h1>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : pendingAgents.length === 0 ? (
                <p>No pending agents found.</p>
            ) : (
                <ul className="space-y-4">
                    {pendingAgents.map(agent => (
                        <li key={agent.id} className="flex justify-between items-center border border-gray-700 p-4 rounded-lg">
                            <div>
                                <p className="text-lg font-medium">{agent.full_name}</p>
                                <p className="text-sm text-gray-400">{agent.email}</p>
                                <p className="text-sm text-gray-400">License: {agent.license_number}</p>
                            </div>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                onClick={() => handleVerify(agent.email)}
                            >
                                Verify
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
