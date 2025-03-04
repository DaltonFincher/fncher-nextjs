// C:\Users\dalto\fncher\src\app\api\pending-agent\route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@utils/supabaseClient'; // Ensure this is the correct path

export async function GET(request: Request) {
  // Extract token from query parameters
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  // Check if token exists and is of valid length
  if (!token || token.length < 32) {
    return NextResponse.json({ error: 'Invalid token length.' }, { status: 400 });
  }

  // Now, continue fetching pending agents if token is valid
  const { data, error } = await supabase
    .from('pending_agents')  // Ensure your table name is correct
    .select('*')  // Select all columns
    .eq('status', 'pending'); // Fetch only pending agents

  if (error) {
    console.error('Error fetching pending agents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('Fetched Data:', data);  // Log the fetched data to verify it's coming from Supabase
  return NextResponse.json({ data }); // Return the fetched data
}
