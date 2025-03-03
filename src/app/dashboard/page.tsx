'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabaseClient';

interface Agent {
    id: number;
    email: string;
    full_name: string;
    license_number: string;
    profile_picture: string | null;
    terms_accepted: boolean;
    privacy_policy_accepted: boolean;
    created_at: string;
    agent_id: string;
    email_verified_at: string | null;
}

export default function Dashboard() {
    const [pendingAgents, setPendingAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        fetchPendingAgents();
        getAuthenticatedUser();
    }, []);

    async function getAuthenticatedUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;
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
                .select('*');

            if (error) throw error;

            console.log('Fetched Pending Agents:', data);

            setPendingAgents(data || []);
        } catch (err: any) {
            setError('Failed to load pending agents');
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(email: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('User is not authenticated.');
            }

            const response = await fetch('/api/verify-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                fetchPendingAgents();
            } else {
                alert(`Failed to verify agent: ${result.error}`);
            }
        } catch (error: any) {
            alert(`Failed to verify agent: ${error.message}`);
        }
    }

    if (authLoading) {
        return <div>Loading user session...</div>;
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
