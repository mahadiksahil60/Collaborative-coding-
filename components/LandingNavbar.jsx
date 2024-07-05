"use client"
import React from "react"
import Link from "next/link";

export default function LandingNavbar() {
    return (
        <>
            <div className="navbar bg-black p-5 fixed top-0 w-full z-10">
                <div className="flex-1">
                    <Link href="/" className="btn  text-xl font-mono">Collaborative Coding</Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1 text-lg font-bold font-mono">
                        <Link href='/user/auth/register' className="p-3 rounded-full hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Register</Link>
                        <Link href='/user/auth/login' className="p-3 rounded-full hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Login</Link>
                        {/* <li className="p-1 rounded-full hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"><a>Login</a></li> */}
                    </ul>
                </div>
            </div>
        </>
    );
}