import { NextResponse } from "next/server";
import { Firestore } from "firebase/firestore";
import { getDoc, doc, addDoc, where } from "firebase/firestore";
import { db } from "@/configuration/firebaseconfig";
import {cookies} from 'next/headers'
import { verify } from "jsonwebtoken";
export async function GET(){
try {
    //logic to fetch user data from the stored cookies
    const userToken = cookies().get("user-auth-token").value;
    const decryptedToken = verify(userToken, process.env.JWT_KEY);
    const userId = decryptedToken.uid;
    
    const userSnapshot = await getDoc(doc(db, "Users", userId));
    if (!userSnapshot.exists()) {
        cookies().delete("user-auth-token");
        return NextResponse.json({ status: 404, error: "User not found..." });
    }
    const userinfo = userSnapshot.data();
    return NextResponse.json({status: 200, data : userinfo});

} catch (error) {
    return NextResponse.json({status : 500, message : "The server isn't responding"})
}
}