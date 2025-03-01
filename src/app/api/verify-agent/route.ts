import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@utils/supabaseClient';

export async function POST(req: NextRequest) {
    const { email } = await req.json();  // Extract email from the body

    // Get the authorization token from the headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the header

    const { data: user, error } = await supabase.auth.getUser(token);  // Verify the token

    if (error || !user) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { data: agent, error: agentError } = await supabase
        .from('pending_agents')
        .select('*')
        .eq('email', email)
        .single();  // Fetch agent by email

    if (agentError || !agent) {
        return NextResponse.json({ error: 'Agent not found in pending_agents' }, { status: 404 });
    }

    // Insert into the agents table
    const { error: insertError } = await supabase
        .from('agents')
        .insert([{
            email: agent.email,
            full_name: agent.full_name,
            license_number: agent.license_number,
            profile_picture: agent.profile_picture,
            status: 'active',
            created_at: new Date().toISOString(),
        }]);

    if (insertError) {
        return NextResponse.json({ error: 'Failed to add agent to agents table' }, { status: 500 });
    }

    // Remove the agent from pending_agents
    const { error: deleteError } = await supabase
        .from('pending_agents')
        .delete()
        .eq('email', email);

    if (deleteError) {
        return NextResponse.json({ error: 'Failed to remove agent from pending_agents' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Agent verified and moved to agents table' });
}
