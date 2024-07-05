"use client"
import Footer from "@/components/Footer";
import LandingNavbar from "@/components/LandingNavbar";
import React from "react"
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Register() {
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password:'',
  confirmpassword: ''
})


const handleInputChange = (e) => {
  const {name, value} = e.target;
  setFormData({
    ...formData,
    [name] : value,
  })
}

const handleSubmit = async (e)=>{
  e.preventDefault();
  if (formData.password !== formData.confirmpassword) {
   toast.error("Passwords do not match")
    return;
  }
try {
  const response = await fetch(`/api/user/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(formData),
  });
  const result = await response.json()
  if(result.status === 200){
    toast.success("Registration Completed Successfully.....")
  }else{
    toast.error("Something went wrong");
  }
  Router.push('/login');
} catch (error) {
  console.error("the error occured is : ", error);
}
}



    return (
        <div className="flex flex-col justify-center items-center m-5">
            <LandingNavbar />
            <div className="m-40 w-1/2 "> {/* Adjust the top margin value as needed */}
                <div className="mockup-window bg-base-300 border">
                    <div className="bg-base-200 flex justify-center px-4 py-16">

       
                    <div className="flex items-center justify-center mt-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none text-white rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500  rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Confirm Password</label>
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
                    </div>
                </div>
            </div>
       
            <Footer/>
       
        </div>
    );
}