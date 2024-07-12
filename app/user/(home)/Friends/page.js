"use client"
import { Input } from 'postcss';
import React, { useState, useEffect, useContext } from 'react'
import Friends from '@/components/Friends';
import Friendrequest from '@/components/FriendRequest';
import { UserContextProvider } from '@/context/AuthContext';
export default function ManageFriends() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [option, setOption] = useState(0);
    const [loading, setLoading] = useState(true);
    const gainContext = useContext(UserContextProvider);
    const [contextuser, setContextUser] = useState(null);
    useEffect(() => {
        const fetchContext = async () => {
            if (gainContext && gainContext.data) {
                const userId = gainContext.data.uid;
                console.log('User ID:', gainContext);
                await setContextUser(gainContext);
                setLoading(false);
            }
        }

        fetchContext();
    }, [gainContext]);






    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`/api/user/getUsers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const result = await response.json();
            setUsers(result.data);

        }

        fetchUsers();
    }, [])

    useEffect(() => {

        if (Array.isArray(users)) {
            setFilteredUsers(
                users.filter((user) =>
                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
        console.log("the filtered users are ", filteredUsers);
        setLoading(false);
    }, [searchQuery, users]);


    const handleAddFriend = async (ReceiveruserId) => {

        
        const senderusername = gainContext.data.username;
        
        try {
            const addfriendrequest = await fetch(`/api/user/addRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({senderusername, ReceiveruserId}),
            })
            const result = await addfriendrequest.json();
            if (result.status === 200) {
                toast.success("Request Sent");
                console.log("friend request send successfully");
            }
        } catch (error) {
            console.log("error sending request", error);
        }
    }


    if (loading) {
        return <div>Loading.. Please wait.</div>
    }

    return (




        <div className='flex flex-col justify-center items-center'>
           
            <div className="flex mb-3">
                <button
                    className={`py-2 px-4 ${option === 0 ? 'bg-slate-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-tl-lg`}
                    onClick={() => { setOption(0) }}
                >
                    Add friends
                </button>
                <button
                    className={`py-2 px-4 ${option === 1 ? 'bg-slate-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => { setOption(1) }}
                >
                    Friend Requests
                </button>
                <button
                    className={`py-2 px-4 ${option === 2 ? 'bg-slate-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-tr-lg`}
                    onClick={() => { setOption(2) }}
                >
                    Friends
                </button>
            </div>

            {option === 0 && (
                <>
                    <h1 className='mb-3 p-3 text-3xl font-bold '>Add Friends</h1>

                    <input
                        type="text"
                        className='bg-white text-black px-7 py-3 w-96 rounded-2xl font-extrabold font-mono'
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            console.log(searchQuery);
                        }}
                        placeholder='Search to add friends'

                    />
                    <div className='p-10 m-14 bg-slate-700 w-1/2'>
                        <ul>
                            {filteredUsers.map((user, index) => (
                                <li className='w-full bg-slate-600 p-6 border-2 border-black font-extrabold font-mono text-white' key={index}>
                                    <div className='flex justify-between items-center'>
                                        <span>{user.username}</span>
                                        <button onClick={() => { handleAddFriend(user.uid) }} className='bg-white p-1 text-black'>
                                            Add Friend
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {option === 1 && (
              <Friendrequest/>
            )}

            {option === 2 && (
              <Friends/>
            )}

        </div>

    );
}