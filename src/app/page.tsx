import React from 'react';
import Image from "next/image";


export default function Home() {
  return (
    <div className="bg-white text-black">
      {/* Header */}
      <header className="bg-[#5C76A3] py-6 px-10 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <Image
            src="/Fncherlogo.png"
            alt="Fncher Logo"
            width={90}
            height={90}
            className="mr-4"
          />
          {/* Fncher Title */}
          <h1 className="text-5xl font-serif font-bold text-white">Fncher.com</h1>
        </div>
      </header>


      {/* Hero Section with Parallax Background */}
      <section
        className="relative text-white text-center flex flex-col justify-center items-center h-[85vh] px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/DestinHarbour.JPG')",
          backgroundAttachment: "fixed", // Enables the parallax effect
        }}
      >
        {/* Darker Overlay for Better Readability */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>


        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-extrabold leading-tight">Homeowners, Meet Verified Local Experts</h2>
          <p className="text-xl mt-6 leading-relaxed">
            Need help while you're away? <strong>Fncher connects homeowners with licensed, trusted real estate agents</strong> who provide home care, pet sitting, and more—so you can leave with confidence.
          </p>


          {/* Sign-Up Options */}
          <h3 className="text-3xl font-bold mt-8">Sign Up As</h3>


          <div className="mt-6 flex flex-col sm:flex-row gap-6 justify-center">
            {/* Homeowner Sign-Up Button */}
            <a
              href="/signup-homeowner"
              className="bg-white text-[#5C76A3] py-4 px-8 text-xl font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Homeowner
            </a>


            {/* Agent Sign-Up Button */}
            <a
              href="/signup-agent/step1"
              className="bg-white text-[#5C76A3] py-4 px-8 text-xl font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Agent
            </a>
          </div>
        </div>
      </section>


      {/* How Homeowners Benefit */}
      <section id="how-it-works" className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold text-[#5C76A3]">Why Homeowners Love Fncher</h3>
          <p className="text-lg mt-6 text-gray-700 leading-relaxed">
            Whether you're traveling or just need an extra hand, our <strong>verified real estate professionals</strong> offer trusted home services. From home check-ins to pet sitting, we've got you covered—<strong>all with the reliability of licensed agents.</strong>
          </p>
        </div>
      </section>


      {/* Homeowner Trust Section */}
      <section id="why-trust" className="bg-[#f7f7f7] py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold text-[#5C76A3]">Your Home, Your Peace of Mind</h3>
          <p className="text-lg mt-6 text-gray-700 leading-relaxed">
            We ensure every agent on Fncher is <strong>licensed, background-checked, and reviewed</strong>—so you can trust that your home is in safe hands.
          </p>
        </div>
      </section>


      {/* Mission Section */}
      <section id="mission" className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold text-[#5C76A3]">A Win-Win for Homeowners & Agents</h3>
          <p className="text-lg mt-6 text-gray-700 leading-relaxed">
            <strong>Homeowners get security and convenience</strong>—agents get an opportunity to build relationships while earning extra income. It's a smarter way to care for your home and connect with real estate professionals who truly know your market.
          </p>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="bg-[#5C76A3] text-white text-center py-24 px-6">
        <h3 className="text-4xl font-bold">Start Today</h3>
        <p className="text-lg mt-4 max-w-3xl mx-auto">
          Whether you're a homeowner looking for trusted professionals or an agent ready to expand your business, Fncher makes it easy.
        </p>
        <a
          href="mailto:contact@fncher.com"
          className="mt-6 inline-block bg-white text-[#5C76A3] py-3 px-6 text-xl font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Fncher. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}


