'use client';

import React, { useState } from "react";
import { supabase } from "@utils/supabaseClient";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface FormData {
    fullName: string;
    licenseType: string;
    licenseNumber: string;
    email: string;
    password: string;
    termsAndPrivacyAccepted: boolean;
}

export default function SignupAgentStep1() {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        licenseType: "SL",
        licenseNumber: "",
        email: "",
        password: "",
        termsAndPrivacyAccepted: false,
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, termsAndPrivacyAccepted: e.target.checked }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, licenseType: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { fullName, licenseType, licenseNumber, email, password, termsAndPrivacyAccepted } = formData;

        if (!fullName || !licenseNumber || !email || !password) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        if (!termsAndPrivacyAccepted) {
            setErrorMessage("Please accept the Terms and Privacy Policy to proceed.");
            return;
        }

        const fullLicenseNumber = `${licenseType}${licenseNumber}`;

        // Sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/confirm-email`
            }
        });

        if (authError) {
            setErrorMessage(`Error during sign-up: ${authError.message}`);
            return;
        }

        const userId = authData?.user?.id;
        if (!userId) {
            setErrorMessage("User ID is missing after sign-up.");
            return;
        }

        // Insert data into the pending_agents table
        const { error: insertError } = await supabase
            .from('pending_agents')
            .insert([{
                email,
                full_name: fullName,
                license_number: fullLicenseNumber,
                profile_picture: "",  // Assuming profile picture will be uploaded later
                agent_id: userId,
                email_verified_at: null,
                terms_accepted: true,
                privacy_policy_accepted: true,
                created_at: new Date().toISOString(),
            }]);

        if (insertError) {
            setErrorMessage(`Error saving agent data: ${insertError.message}`);
            return;
        }

        // Redirect to waiting page
        window.location.href = "/waiting";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-200 relative">
            <div className="absolute inset-0 bg-cover bg-center bg-opacity-50" style={{ backgroundImage: "url('/agentsignup.jpg')" }}></div>

            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 rounded-xl p-8 shadow-lg">
                    <div className="flex justify-center mb-6">
                        <img src="/Fncherlogo1.png" alt="Fncher Logo" className="h-24" />
                    </div>

                    <h2 className="text-center text-3xl font-semibold text-gray-800">Sign Up as an Agent</h2>
                    <p className="text-center text-sm text-gray-600 opacity-70">
                        Please enter the same full name as it appears on your real estate license to ensure a smooth verification process.<br />
                        Additionally, please use your work email for this sign-up.
                    </p>

                    {errorMessage && (
                        <div className="text-red-600 text-sm text-center mt-4">
                            {errorMessage}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Full Name"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
                            />

                            <div className="flex space-x-4">
                                <select
                                    name="licenseType"
                                    value={formData.licenseType}
                                    onChange={handleSelectChange}
                                    className="w-1/5 px-3 py-2 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
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
                                    className="w-4/5 px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
                                />
                            </div>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Email Address"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
                            />

                            <div className="relative">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-600" />
                                    )}
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

                        <button
                            type="submit"
                            className="w-full py-3 px-6 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                        >
                            Next
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
