'use client';

import React, { useState } from "react";  // <-- Import React here
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function SignupHomeowner() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    window.location.href = "/signup-homeowner-step2";
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-6 relative"
      style={{
        backgroundImage: "url('/homeownersignup.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex justify-center mb-6">
        <Image src="/Fncherlogo1.png" alt="Fncher Logo" width={90} height={90} />
      </div>

      <div className="relative z-10 bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-[#5C76A3] text-center">Sign Up as a Homeowner</h2>
        <p className="text-gray-600 text-center mt-2">Connect with trusted agents for home services.</p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-2 px-4 py-3 border rounded-lg text-black focus:ring-[#5C76A3] focus:border-[#5C76A3] outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-3 border rounded-lg text-black focus:ring-[#5C76A3] focus:border-[#5C76A3] outline-none"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-semibold">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full mt-2 px-4 py-3 border rounded-lg text-black focus:ring-[#5C76A3] focus:border-[#5C76A3] outline-none pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#5C76A3]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#5C76A3] text-white py-3 text-lg font-semibold rounded-lg hover:bg-[#4A6187] transition"
          >
            Continue
          </button>
        </form>

        <p className="text-gray-600 text-center mt-4">
          Already have an account? <a href="/signin" className="text-[#5C76A3] font-semibold hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}
