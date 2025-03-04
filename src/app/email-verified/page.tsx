export default function EmailVerifiedPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-green-600">Email Verified Successfully!</h1>
          <p className="mt-4 text-gray-600">
            Your email has been successfully verified. You can now log in and start using Fncher.com.
          </p>
          <a href="/login" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
            Go to Login
          </a>
        </div>
      </div>
    )
  }
  