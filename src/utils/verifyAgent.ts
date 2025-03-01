// C:\Users\dalto\fncher\src\utils\verifyAgent.ts
import { supabase } from '@utils/supabaseClient';

// Existing verifyAgent function for email-based verification
export async function verifyAgent(email: string) {
    // Fetch the agent from the pending_agents table
    const { data: pendingAgent, error: fetchError } = await supabase
        .from('pending_agents')
        .select('*')
        .eq('email', email)
        .single(); // Only expecting one agent

    if (fetchError || !pendingAgent) {
        throw new Error(`Agent with email ${email} not found in pending_agents.`);
    }

    // Get authenticated user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User is not authenticated.');
    }

    // Insert into the agents table
    const { error: insertError } = await supabase
        .from('agents')
        .insert([{
            email: pendingAgent.email,
            full_name: pendingAgent.full_name,
            license_number: pendingAgent.license_number,
            profile_picture: pendingAgent.profile_picture,
            status: 'verified',
            created_at: new Date(),
            agent_id: user.id, // Use the authenticated user ID
            privacy_policy_accepted: pendingAgent.privacy_policy_accepted, // Make sure to map all fields
            terms_accepted: pendingAgent.terms_accepted, // Mapping the accepted terms
        }]);

    if (insertError) {
        throw new Error(`Failed to add agent to agents table: ${insertError.message}`);
    }

    // Delete from pending_agents
    const { error: deleteError } = await supabase
        .from('pending_agents')
        .delete()
        .eq('email', email);

    if (deleteError) {
        throw new Error(`Failed to remove agent from pending_agents table: ${deleteError.message}`);
    }

    return 'Agent verified and moved successfully.';
}

// Function to verify and transfer the agent data from pending_agents to agents
export async function verifyAndTransferAgent(agentId: string) {
    // Fetch the agent's data from 'pending_agents'
    const { data: pendingAgent, error: fetchError } = await supabase
        .from('pending_agents')
        .select('*')
        .eq('agent_id', agentId) // Assuming 'agent_id' is unique for each agent
        .single();

    if (fetchError || !pendingAgent) {
        throw new Error(`Agent with ID ${agentId} not found in pending_agents.`);
    }

    // Get authenticated user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User is not authenticated.');
    }

    // Insert into the agents table
    const { error: insertError } = await supabase
        .from('agents')
        .insert([{
            full_name: pendingAgent.full_name,
            email: pendingAgent.email,
            license_number: pendingAgent.license_number,
            profile_picture: pendingAgent.profile_picture,
            status: 'verified',
            terms_accepted: pendingAgent.terms_accepted,
            privacy_policy_accepted: pendingAgent.privacy_policy_accepted,
            created_at: pendingAgent.created_at,
            agent_id: pendingAgent.agent_id,
        }]);

    if (insertError) {
        throw new Error(`Failed to add agent to agents table: ${insertError.message}`);
    }

    // Remove the agent from the 'pending_agents' table
    const { error: deleteError } = await supabase
        .from('pending_agents')
        .delete()
        .eq('agent_id', agentId);

    if (deleteError) {
        throw new Error(`Failed to remove agent from pending_agents table: ${deleteError.message}`);
    }

    return 'Agent verified and transferred successfully.';
}
