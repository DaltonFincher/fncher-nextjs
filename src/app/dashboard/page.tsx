'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabaseClient'; // Ensure this import path matches your file location

interface Agent {
    id: number;
    full_name: string;
    email: string;
    license_number: string;
    created_at: string;
    email_verified: boolean; // Add email_verified to track verification status
}

export default function Dashboard() {
    const [pendingAgents, setPendingAgents] = useState<Agent[]>([]); // Pending agents state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [user, setUser] = useState<any>(null); // Store authenticated user
    const [authLoading, setAuthLoading] = useState(true); // Track auth session loading state

    useEffect(() => {
        fetchPendingAgents();
        getAuthenticatedUser(); // Fetch user session when the component mounts
    }, []); // Only fetch on mount

    // Fetch the authenticated user session
    async function getAuthenticatedUser() {
        try {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                throw error;
            }

            setUser(data.user); // Set the user if session exists
        } catch (err) {
            console.error('Error fetching user:', err);
        } finally {
            setAuthLoading(false); // Set auth loading to false after checking session
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

    // Handle agent verification and move from pending_agents to agents
    async function handleVerify(email: string) {
        try {
            // Get the auth token
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('User is not authenticated.');
            }

            // Fetch the pending agent's data from the pending_agents table
            const { data: pendingAgent, error: fetchError } = await supabase
                .from('pending_agents')
                .select('*')
                .eq('email', email)
                .single(); // Fetch only one agent by email

            if (fetchError) {
                throw fetchError;
            }

            if (!pendingAgent) {
                throw new Error('Agent not found in pending_agents.');
            }

            // Check if the agent's email is verified
            if (!pendingAgent.email_verified) {
                throw new Error('Agent email is not verified.');
            }

            // Move the agent to the "agents" table
            const { error: insertError } = await supabase
                .from('agents')
                .insert([{
                    full_name: pendingAgent.full_name,
                    email: pendingAgent.email,
                    license_number: pendingAgent.license_number,
                    profile_picture: pendingAgent.profile_picture,
                    status: 'active',  // Assuming the agent status is 'active' when they are verified
                    terms_accepted: pendingAgent.terms_accepted,
                    privacy_policy_accepted: pendingAgent.privacy_policy_accepted,
                    created_at: pendingAgent.created_at,
                    agent_id: pendingAgent.agent_id,  // Keep the agent's ID from the pending_agents table
                }]);


            if (insertError) {
                throw insertError;
            }

            // Delete the agent from the "pending_agents" table after successfully inserting into "agents"
            const { error: deleteError } = await supabase
                .from('pending_agents')
                .delete()
                .eq('email', email);

            if (deleteError) {
                throw deleteError;
            }

            alert('Agent successfully verified and moved to agents.');

            // Refresh the list of pending agents
            fetchPendingAgents();

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
                                <p className="text-sm text-gray-400">
                                    {agent.email_verified ? 'Email Verified' : 'Email Not Verified'}
                                </p>
                            </div>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                onClick={() => handleVerify(agent.email)}
                                disabled={agent.email_verified} // Disable the verify button if email is already verified
                            >
                                {agent.email_verified ? 'Verified' : 'Verify'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
