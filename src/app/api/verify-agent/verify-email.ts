import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@utils/supabaseClient'; // Adjusted to match your import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query; // Token from the query string

  if (!token) {
    return res.status(400).json({ error: 'Token is missing' });
  }

  // Log the token received for debugging
  console.log("Token received:", token);

  try {
    // Use Supabase's method to verify the token (using getUser())
    const { data, error } = await supabase.auth.getUser(token as string); // Correct method for token verification

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // If user data is returned, the token is valid
    return res.status(200).json({ message: 'Email successfully verified' });
  } catch (err) {
    console.error("Error during verification:", err);
    return res.status(500).json({ error: 'Something went wrong during email verification' });
  }
}
