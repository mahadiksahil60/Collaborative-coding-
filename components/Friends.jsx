"use client"
import React, { useEffect, useState, useContext } from 'react'
import { UserContextProvider } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Friends() {
    const user = useContext(UserContextProvider);
    const [loading, setLoading] = useState(true);
    const [friends, setFriends] = useState([])
    useEffect(() => {
        const fetchContext = async () => {
            if (user && user.data) {
                console.log(user.data.username);
                setLoading(false);
            }
        }
        fetchContext();
    }, [user])

    useEffect(() => {
        const fetchFriends = async () => {
            const UserId = user.data.uid;
            const response = await fetch(`/api/user/acceptRequest/${UserId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const result = await response.json();
            console.log(result);
            setFriends(result.friends);
        }
        fetchFriends();
    }, [])


    if (loading) {
        return <div>Loading.....</div>
    }

    return (

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Friends List</h1>
            {friends.length === 0 ? (
                <p className="text-gray-500">You have no friends yet.</p>
            ) : (
                <ul className="space-y-4">
                    {friends.map((friend, index) => (
                        <li key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                            <p className="font-semibold">{friend}</p>
                            {/* You can add more friend details or actions here */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
    );
}