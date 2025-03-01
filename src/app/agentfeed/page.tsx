'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@utils/supabaseClient'; // Corrected import path using alias
import { useRouter } from 'next/router';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  postedBy: string;
}

export default function FeedPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1); // Pagination state
  const [isClient, setIsClient] = useState<boolean>(false); // Ensure it's mounted on the client

  const [router, setRouter] = useState<any>(null);

  // Set router client-side to prevent issues during SSR
  useEffect(() => {
    setIsClient(true); // Set to true after mounting to ensure client-side rendering
    setRouter(useRouter()); // Initialize router client-side
  }, []);

  // Fetch jobs data with pagination
  const fetchJobs = async (page: number) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .range((page - 1) * 10, page * 10 - 1); // Load 10 jobs per request

    if (error) {
      console.error('Error fetching jobs:', error.message);
    } else {
      setJobs((prevJobs) => [...prevJobs, ...data]);
      setHasMore(data.length > 0); // If there are less than 10 jobs, no more data is available
    }

    setLoading(false);
  };

  // Infinite scroll functionality
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const bottom = e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchJobs(nextPage); // Fetch next page of jobs
        return nextPage;
      });
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    if (isClient) {
      fetchJobs(page);
    }
  }, [page, isClient]);

  if (!isClient) {
    return null; // Prevent rendering the component until after the client mounts
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-200 py-8 px-4">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Available Jobs</h2>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto overflow-y-auto"
        onScroll={handleScroll}
        style={{ maxHeight: '80vh' }} // Adjust height for scroll
      >
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600">No jobs available right now.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{job.description}</p>
              <p className="text-sm text-gray-500 mb-4">{job.location}</p>
              <p className="text-xs text-gray-400">Posted by: {job.postedBy}</p>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="col-span-full text-center text-gray-600 py-6">
            <p>Loading more jobs...</p>
          </div>
        )}
      </div>

      {/* Button to manually load more jobs */}
      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition ease-in-out duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
