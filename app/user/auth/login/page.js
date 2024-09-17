"use client";

import React from "react";
import LandingNavbar from "@/components/LandingNavbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/user/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.status === 200) {
        toast.success("Logged in successfully, start solving");
        router.replace("/user/homepage");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.log("The error occurred: ", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <div className="flex-1 flex justify-center items-center px-4 py-8 md:px-8 md:py-12 mt-16">
        {" "}
        {/* Adjusted margin-top to account for navbar height */}
        <div className="w-full max-w-md">
          <p className="text-center text-lg p-2">
            Use a desktop for a better experience
          </p>

          <div className="bg-base-300 border rounded-lg shadow-lg p-4 md:p-8">
            <h2 className="text-center text-2xl md:text-3xl font-extrabold text-white mb-6">
              Log Into Your Account
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-md w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-white bg-base-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Email address"
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-md w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-white bg-base-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Password"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
