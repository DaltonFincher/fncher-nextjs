'use client';

import React, { useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface FormData {
    fullName: string;
    licenseType: string; // License type: SL, BL
    licenseNumber: string;
    email: string;
    password: string;
    termsAndPrivacyAccepted: boolean;
}

export default function SignupAgentStep1() {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        licenseType: "SL", // Default to SL
        licenseNumber: "",
        email: "",
        password: "",
        termsAndPrivacyAccepted: false,
    });

    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, licenseType: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { fullName, licenseType, licenseNumber, email, password, termsAndPrivacyAccepted } = formData;

        if (!termsAndPrivacyAccepted) {
            console.error("Please accept the Terms and Privacy Policy to proceed.");
            return;
        }

        const fullLicenseNumber = `${licenseType}${licenseNumber}`; // Combine the license type and number

        // Sign up the user with email confirmation
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/verify-email`
            }
        });

        if (authError) {
            console.error("Error during sign-up:", authError.message);
            return;
        }

        const userId = authData?.user?.id;
        if (!userId) {
            console.error("User ID is missing after sign-up.");
            return;
        }

        // Save to pending_agents table
        const { error: insertError } = await supabase
            .from('pending_agents')
            .insert([{
                email,
                full_name: fullName,
                license_number: fullLicenseNumber, // Save the combined license number
                profile_picture: "", // Placeholder, to be updated later
                agent_id: userId,
                email_verified_at: null, // Add null to email_verified_at as placeholder
                terms_accepted: true,
                privacy_policy_accepted: true,
                created_at: new Date().toISOString(), // Set the current timestamp
            }]);

        if (insertError) {
            console.error("Error saving agent data:", insertError.message);
            return;
        }

        // Redirect to the waiting page after signup
        window.location.href = "/waiting";  // Redirect to waiting page
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-200 relative">
            <div className="absolute inset-0 bg-cover bg-center bg-opacity-50" style={{ backgroundImage: "url('/agentsignup.jpg')" }}></div>

            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 rounded-xl p-8 shadow-lg">
                    <div className="flex justify-center mb-6">
                        <img src="/Fncherlogo1.png" alt="Fncher Logo" className="h-24" /> {/* Increased logo size */}
                    </div>
                    <h2 className="text-center text-3xl font-semibold text-gray-800">Sign Up as an Agent</h2>
                    <p className="text-center text-sm text-gray-600" style={{ opacity: 0.7 }}>
                        Please enter the same full name as it appears on your real estate license to ensure a smooth verification process.
                        <br />
                        Additionally, please use your work email for this sign-up.
                    </p>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Full Name"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition ease-in-out duration-200"
                            />
                            
                            <div className="flex space-x-4">
                                <select
                                    name="licenseType"
                                    value={formData.licenseType}
                                    onChange={handleSelectChange}
                                    className="w-1/5 px-3 py-2 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition ease-in-out duration-200"
                                >
                                    <option value="SL">SL</option>
                                    <option value="BL">BL</option>
                                </select>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="Real Estate License Number"
                                    className="w-4/5 px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition ease-in-out duration-200"
                                />
                            </div>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Email Address"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition ease-in-out duration-200"
                            />
                            <div className="relative">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition ease-in-out duration-200"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <EyeSlashIcon className="h-5 w-5 text-gray-600" /> : <EyeIcon className="h-5 w-5 text-gray-600" />}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="termsAndPrivacyAccepted"
                                checked={formData.termsAndPrivacyAccepted}
                                onChange={handleCheckboxChange}
                                required
                                className="h-5 w-5 text-indigo-600"
                            />
                            <label className="ml-2 text-sm text-gray-600">
                                I accept the <a href="/terms" className="text-indigo-600">Terms and Conditions</a> and <a href="/privacy-policy" className="text-indigo-600">Privacy Policy</a>.
                            </label>
                        </div>

                        <button type="submit" className="w-full py-3 px-6 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition ease-in-out duration-200">
                            Next
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
