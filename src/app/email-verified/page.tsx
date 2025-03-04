import Image from 'next/image';

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-[#5C76A3] p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Image src="/Fncherlogo1.png" alt="Fncher Logo" width={120} height={120} />
        </div>
        <h1 className="text-2xl font-bold text-white">Email Verified Successfully!</h1>
        <p className="mt-4 text-white">
          Your email has been successfully verified. You can now log in and start using Fncher.com.
        </p>
        <a href="/login" className="mt-6 inline-block bg-white text-[#5C76A3] font-bold px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition">
          Go to Login
        </a>
      </div>
    </div>
  )
}
