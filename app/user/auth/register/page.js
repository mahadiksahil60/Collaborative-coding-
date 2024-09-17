"use client";

import LandingNavbar from "@/components/LandingNavbar";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(`/api/user/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.status === 200) {
        toast.success("Registration Completed Successfully.....");
        router.push("/user/auth/login");
      } else if (result.status == 400) {
        toast.error("Email already in use.. try with a different email");
      } else {
        toast.error(
          "Registration failed, try with a different set of credentials"
        );
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("The error occurred: ", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <LandingNavbar />
      <div className="flex-1 flex justify-center items-center px-4 py-8 md:px-6 md:py-12">
        <div className="w-full max-w-md">
          <p className="text-center text-lg p-2">
            Use a desktop for a better experience
          </p>
          <div className="bg-base-300 border rounded-lg shadow-lg p-4 md:p-8">
            <h2 className="text-center text-2xl md:text-3xl font-extrabold text-white mb-4">
              Register with CodeTogether!
            </h2>
            <p className="text-center text-neutral-200 mb-6">It's free</p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-md w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-white bg-base-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Username"
                    onChange={handleInputChange}
                  />
                </div>
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
                <div>
                  <label htmlFor="confirmpassword" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    required
                    className="appearance-none rounded-md w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-white bg-base-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm Password"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Footer can be placed here if needed */}
    </div>
  );
}
