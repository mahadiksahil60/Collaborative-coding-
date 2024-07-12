import { db } from "@/configuration/firebaseconfig";
import { updateDoc, doc, query, collection, where,getDocs,getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, {params}){
    try {
        const {UserId} = params;
        const UserDocRef = doc(db, "Users", UserId);
        const UserDoc = await getDoc(UserDocRef);
        const userData = UserDoc.data();
        const friends = userData.friends || []
        console.log("the friends fetched are : ", friends);
        return NextResponse.json({status: 200 , friends});
        
    
    
    } catch (error) {
        console.log("error fetching friends", error);
        return NextResponse.json({status: 500, message: "Could not fetch friends"})
    }
}