"use client"
import React, { useState, useEffect } from 'react'
import { UserContextProvider } from '@/context/AuthContext';
import { useContext } from 'react';
export default function Friendrequest() {
    const [requests, setRequests] = useState([]);
    const user = useContext(UserContextProvider);
    const [userdata, setUserData] = useState(null);
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






    useEffect(() => {
        const fetchIncomingReq = async () => {
            const userId = user.data.uid;
            const response = await fetch(`/api/user/incomingreq/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const result = await response.json();
            console.log("this is the raw response",result)
            setRequests(result.requests);
        }

        fetchIncomingReq();
    }, [])





    if (loading) {
        return <div>Loading....</div>
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
            {requests.length === 0 ? (
                <p className="text-gray-500">No friend requests at the moment.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map(request => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                            <p className="font-semibold text-black">{request} sent a friend request.</p>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleAccept(request.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg focus:outline-none"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(request.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
    );

}