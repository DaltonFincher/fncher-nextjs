import Image from 'next/image';

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#5C76A3] to-[#4C5D75]">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full text-center transform transition-all hover:scale-105">
        <div className="flex justify-center mb-6">
          <Image src="/Fncherlogo1.png" alt="Fncher Logo" width={120} height={120} />
        </div>
        <h1 className="text-3xl font-semibold text-[#5C76A3] mb-4">Email Confirmed Successfully!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your email has been successfully confirmed! Now, we are reviewing your real estate license number for verification. Once it's approved, you'll be able to fully access the platform.
        </p>
        <div className="bg-[#5C76A3] p-4 rounded-lg shadow-lg mb-6">
          <p className="text-white font-medium">Thank you for your patience!</p>
        </div>
        <a href="/login" className="mt-6 inline-block bg-[#5C76A3] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-[#4c5d75] transition">
          Go to Login
        </a>
      </div>
    </div>
  );
}
