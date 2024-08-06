import { db } from "@/configuration/firebaseconfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { NextResponse } from "next/server";



export async function POST(req) {
    try {
        const { senderusername, ReceiveruserId } = await req.json();
        console.log("the senderusername is : ",senderusername);
        const ReceiverRef = doc(db, "Users", ReceiveruserId); 
       
            await updateDoc(ReceiverRef, {
            incomingRequests: arrayUnion(senderusername)
        });
        console.log("successfully added user");
        
        return NextResponse.json({ status: 200, message: "Friend request sent..." })
    } catch (error) {
        
        console.log("error adding users", error);
        return NextResponse.json({ status: 500, message: "Could not send friend request" })
    }
}
