import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@utils/supabaseClient'; // Adjusted to match your import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, email } = req.query; // Email and token from the query string

  if (!token || !email) {
    return res.status(400).json({ error: 'Token or email is missing' });
  }

  // Log the token and email received for debugging
  console.log("Token received:", token);
  console.log("Email received:", email);

  try {
    // Use Supabase's method to verify the email OTP token
    const { error } = await supabase.auth.verifyOtp({
      token: token as string,
      email: email as string,  // Pass the email field here
      type: 'signup', // or 'email' depending on the case
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // If successful, return a success message
    return res.status(200).json({ message: 'Email successfully verified' });
  } catch (err) {
    console.error("Error during verification:", err);
    return res.status(500).json({ error: 'Something went wrong during email verification' });
  }
}
