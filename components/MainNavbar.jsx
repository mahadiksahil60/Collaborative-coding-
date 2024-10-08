"use client";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { UserContextProvider } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiCyberdefenders } from "react-icons/si";

export default function MainNavbar() {
  const router = useRouter();
  const user = useContext(UserContextProvider);
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContext = async () => {
      if (user && user.data) {
        setUserData(user);
        setLoading(false);
      }
    };

    fetchContext();
  }, [user]);

  const handleLogout = async () => {
    try {
      const userId = user.data.uid;
      const logout = await fetch(`/api/user/auth/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await logout.json();
      router.replace("/user/auth/login");

      if (response.status == 200) {
        toast.success("Logout successfully");
      }
    } catch (error) {
      toast.error("Server is not responding, unable to logout");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="navbar bg-black p-5 top-0 w-full flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <Link
            href="/user/homepage"
            className="btn text-xl font-sans flex items-center"
          >
            <SiCyberdefenders /> {user.data.username}
          </Link>
        </div>
        <div className="bg-slate-800 flex-1 text-center border-double border-2 border-white p-2 rounded-xl">
          <p className="text-white text-lg font-semibold">
            The best ideas come to life through collaboration. Let’s code!
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <ul className="menu menu-horizontal px-1 text-lg font-bold">
            <button
              onClick={handleLogout}
              className="p-3 rounded-full hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            >
              Logout
            </button>
          </ul>
        </div>
      </div>
    </>
  );
}
