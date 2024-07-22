import { db } from "@/configuration/firebaseconfig";
import { updateDoc, doc, query, collection, where,getDocs,getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req){
try {
        const {request, UserId} = await req.json();
        
        const UserDocRef = doc(db, "Users", UserId);
        const UserDoc = await getDoc(UserDocRef);
        const userData = UserDoc.data();
        
         //referening the receivers document 
        const usersCollection = collection(db, "Users");
        const q = query(usersCollection, where("username", "==", request));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error(`User with username '${request}' not found.`);
        }
       //referencing the senders document 
        const targetUserDoc = querySnapshot.docs[0];
        const targetUserDocRef = doc(db, "Users", targetUserDoc.id);
        await updateDoc(UserDocRef, {
            friends: arrayUnion(request),
            incomingRequests: arrayRemove(request)

        });
        await updateDoc(targetUserDocRef, {
            friends : arrayUnion(userData.username)
        });

        
        console.log("successfull in  accepting requests");
        return NextResponse.json({status: 200, message:"Request accepted successfully"});
} catch (error) {
    console.log("error accepting requests", error);
    return NextResponse.json({status: 500, message: "Could not accept friend request"});
}
}
