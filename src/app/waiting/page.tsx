'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@utils/supabaseClient';  // Import using your alias

const fonts = [
  'font-serif',
  'font-sans',
  'font-mono',
  'font-extrabold',
];

const wordList = [
  'Success', 'Opportunity', 'Growth', 'Innovation', 'Empowerment', 'Leadership', 'Collaboration', 'Future', 'Impact', 'Community',
  'Networking', 'Vision', 'Possibilities', 'Determination', 'Resilience', 'Excellence', 'Motivation', 'Creativity', 'Teamwork', 'Inspiration',
  'Passion', 'Courage', 'Commitment', 'Focus', 'Perseverance', 'Drive', 'Ambition', 'Ideas', 'Knowledge', 'Action', 'Adaptability',
  'Opportunity', 'Discovery', 'Progress', 'Solution', 'Change', 'Strategy', 'Success', 'Synergy', 'Trust', 'Agility',
  'Achievement', 'Collaboration', 'Opportunity', 'Endurance', 'Curiosity', 'Visionary', 'Innovation', 'Skill', 'Hard Work', 'Problem Solving',
  'Growth', 'Networking', 'Innovation', 'Resilience', 'Leadership', 'Insight', 'Focus', 'Determination', 'Creativity', 'Initiative',
  'Sustainability', 'Passion', 'Drive', 'Purpose', 'Teamwork', 'Vision', 'Invention', 'Knowledge', 'Future', 'Inspiration',
  'Strategy', 'Excellence', 'Empowerment', 'Connection', 'Solutions', 'Strength', 'Momentum', 'Impact', 'Adaptation', 'Learning',
  'Openness', 'Success', 'Pioneering', 'Progress', 'Courage', 'Potential', 'Dedication', 'Partnership', 'Collaboration', 'Enthusiasm',
  'Motivation', 'Determination', 'Trust', 'Resilience', 'Creativity', 'Hard Work', 'Innovation', 'Ambition', 'Endurance', 'Perseverance',
  'Influence', 'Growth', 'Self-Improvement', 'Challenge', 'Balance', 'Flexibility', 'Mindset', 'Openness', 'Curiosity', 'Achievement',
  'Connection', 'Collaboration', 'Energy', 'Leadership', 'Passion', 'Learning', 'Success', 'Action', 'Community', 'Results',
  'Ambition', 'Positivity', 'Sustainability', 'Breakthrough', 'Empathy', 'Strategic', 'Insight', 'Vision', 'Impact', 'Empowerment',
  'Networking', 'Possibilities', 'Transform', 'Exploration', 'Adventure', 'Boldness', 'Creativity', 'Transformation', 'Strategy', 'Growth',
  'Leadership', 'Innovation', 'Passion', 'Vision', 'Impact', 'Strategy', 'Purpose', 'Collaboration', 'Solutions', 'Strength',
  'Momentum', 'Openness', 'Excellence', 'Determination', 'Resilience', 'Creativity', 'Sustainability', 'Focus', 'Opportunity', 'Energy',
  'Teamwork', 'Commitment', 'Growth', 'Balance', 'Trust', 'Connection', 'Impact', 'Adaptation', 'Challenge', 'Learning',
  'Hard Work', 'Creativity', 'Confidence', 'Dedication', 'Growth', 'Potential', 'Empathy', 'Innovation', 'Curiosity', 'Leadership',
  'Results', 'Networking', 'Commitment', 'Success', 'Teamwork', 'Courage', 'Positivity', 'Strategy', 'Resilience', 'Vision',
  'Passion', 'Knowledge', 'Purpose', 'Opportunity', 'Determination', 'Inspiration', 'Sustainability', 'Hard Work', 'Exploration', 'Success',
  'Creativity', 'Momentum', 'Influence', 'Transformation', 'Dedication', 'Perseverance', 'Excellence', 'Challenge', 'Innovation', 'Strategy'
];

export default function WaitingPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);  // State to track client-side rendering

  useEffect(() => {
    setIsClient(true);  // Ensure we're in a client-side environment

    const fetchVerificationStatus = async () => {
      // Get the current session and user
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        // Query the database to check the user's verification status
        const { data, error } = await supabase
          .from('pending_agents')
          .select('status')
          .eq('agent_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching verification status:', error.message);
        } else if (data?.status === 'verified') {
          setIsVerified(true);  // If the user is verified, update state
        }
      }

      setLoading(false);  // Set loading to false after the check
    };

    fetchVerificationStatus();
  }, []);

  // Wait until we are on the client side before rendering
  if (!isClient) {
    return null;  // Prevent rendering until we're client-side
  }

  // Show the loading screen while checking verification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4D6575] to-[#E8F1F5] relative">
        <div className="absolute inset-0 bg-cover bg-center bg-opacity-30" style={{ backgroundImage: "url('/waiting-bg.jpg')" }}>
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>

        {/* Word cloud background */}
        <div className="absolute inset-0 flex flex-wrap justify-center items-center z-0 text-white opacity-40">
          <div className="word-cloud-container flex flex-wrap justify-center w-full h-full absolute inset-0">
            {wordList.map((word, index) => (
              <div
                key={index}
                className={`${fonts[Math.floor(Math.random() * fonts.length)]} word absolute text-4xl font-bold opacity-80`}
                style={{
                  top: `${Math.random() * 90 + 5}%`, // Adjusted spacing to keep words from overlapping with content
                  left: `${Math.random() * 90 + 5}%`,
                  transform: 'translate(-50%, -50%)', // Keep words upright
                  whiteSpace: 'nowrap',
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* Main content with animated text */}
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <img src="/Fncherlogo1.png" alt="Fncher Logo" className="mx-auto w-36 mb-4" />
              <h2 className="text-4xl font-semibold text-[#4D6575]">You're almost there!</h2>
              <p className="text-lg text-gray-700 mt-4">Your account is currently under review. We’re putting the finishing touches on your verification.</p>
              <p className="text-lg text-gray-700 mt-4">We’ll notify you as soon as it’s approved, so stay tuned!</p>
            </div>

            <button
              onClick={() => window.location.reload()}  // Refresh the page to check status again
              className="w-full py-3 px-6 text-white bg-[#4D6575] rounded-md hover:bg-[#32434D] transition ease-in-out duration-300 transform hover:scale-105"
            >
              Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4D6575] to-[#E8F1F5] relative">
      <div className="absolute inset-0 bg-cover bg-center bg-opacity-30" style={{ backgroundImage: "url('/waiting-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      {/* Word cloud background */}
      <div className="absolute inset-0 flex flex-wrap justify-center items-center z-0 text-white opacity-40">
        <div className="word-cloud-container flex flex-wrap justify-center w-full h-full absolute inset-0">
          {wordList.map((word, index) => (
            <div
              key={index}
              className={`${fonts[Math.floor(Math.random() * fonts.length)]} word absolute text-4xl font-bold opacity-80`}
              style={{
                top: `${Math.random() * 90 + 5}%`, // Adjusted spacing to keep words from overlapping with content
                left: `${Math.random() * 90 + 5}%`,
                transform: 'translate(-50%, -50%)', // Keep words upright
                whiteSpace: 'nowrap',
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>

      {/* Main content with animated text */}
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <img src="/Fncherlogo1.png" alt="Fncher Logo" className="mx-auto w-36 mb-4" />
            <h2 className="text-4xl font-semibold text-[#4D6575]">Account Review in Progress</h2>
            <p className="text-lg text-gray-700 mt-4">Please be patient while we review your account. We’ll notify you once it’s approved!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
