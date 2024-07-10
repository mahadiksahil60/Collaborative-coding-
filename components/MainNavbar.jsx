"use client"
import React from "react"
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContextProvider } from "@/context/AuthContext";
import {useRouter} from 'next/navigation';

export default function MainNavbar() {
    
    const router = useRouter();    
    const user = useContext(UserContextProvider);
    const handleLogout = async () => {
        
        try {
            const userId = user.data.uid;
            console.log('User ID:', userId);
            const logout = await fetch(`/api/user/auth/logout`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
           
            console.log("req to logout is made");
           
            const response = await logout.json();
           
            router.replace('/user/auth/login');

            if (response.status == 200) {
                toast.success("Logout successfully")
            }
        } catch (error) {
            console.error("Not able to log out", error)
            toast.error("Server is not responding unable to logout");
        }
    }


    return (
        <>
            <div className="navbar bg-black p-5 fixed top-0 w-full z-10">
                <div className="flex-1">
                    <p  className="btn  text-xl font-mono">Collaborative Coding</p>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1 text-lg font-bold">

                        <button onClick={handleLogout} className="p-3 rounded-full hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Logout</button>

                    </ul>
                </div>
            </div>
        </>
    );
}