"use client"
import React from "react"
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { UserContextProvider } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import Link from "next/link";
export default function MainNavbar() {

    const router = useRouter();
    const user = useContext(UserContextProvider);
    const [userData, setUserData] = useState(user);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchContext = async () => {
            if (user && user.data) {
                const userId = user.data.uid;
                console.log('User ID:', user);
                await setUserData(user);
                setLoading(false);
            }
        }

        fetchContext();
    }, [user]);



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
                toast.success("Logout successfully");
            }
        } catch (error) {
            console.error("Not able to log out", error)
            toast.error("Server is not responding unable to logout");
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <>
            <div className="navbar bg-black p-5 fixed top-0 w-full z-10">
                <div className="flex-1">
                    <Link href='/user/homepage' className="btn  text-xl font-serif">Welcome {user.data.username} </Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1 text-lg font-bold">

                        <Link href='/user/Friends' className="p-3 rounded-full hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Connect</Link>
                        <button onClick={handleLogout} className="p-3 rounded-full hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Logout</button>

                    </ul>
                </div>
            </div>
        </>
    );
}
