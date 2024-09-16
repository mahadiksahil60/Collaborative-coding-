"use client";
import { UserContextProvider } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";
import toast, { Toaster } from "react-hot-toast";

//This function provides the context with user data
export default function Servicelayout({ children }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const rendercontext = async () => {
      const getuserdata = await fetch(`/api/user/get-user-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await getuserdata.json();
      setUserData(result);
      if (result.status === 200) {
        console.log("the user data is fetched ");
      }
    };

    rendercontext();
  }, []);

  return (
    <UserContextProvider.Provider value={userData}>
      <div>
        {/* <MainNavbar /> */}
        <main className="">
          <Toaster />
          {children}
        </main>
      </div>
    </UserContextProvider.Provider>
  );
}
