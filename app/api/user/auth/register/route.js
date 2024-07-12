import { db } from "@/configuration/firebaseconfig";
import { Firestore } from "firebase/firestore";
import { getDoc, addDoc, setDoc, doc  } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/configuration/firebaseconfig";
import { NextResponse } from "next/server";
export async function POST(req){
    try {
        const {username, email, password} = await req.json()
        
        //checking the uniqueness of the username
        const userRef = doc(db, "Users", username);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          return NextResponse.json({ status: 400, error: "Username already taken. Please choose another one." });
        }
        
        
        //authenticating using firebase inbuilt functioon

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;

      await setDoc(doc(db, "Users", user.uid), {
        username,
        email, 
        uid: user.uid
      });

      return NextResponse.json({status: 200 , message: "User Registered successfully", user})

    }catch(error){
        let errorMessage = 'Error registering user';

        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'The email address is already in use by another account.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'The email address is not valid.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'The password is too weak.';
        }
    
        console.error('Error registering user:', error);
        return NextResponse.json({status: 500, error :errorMessage});
    }
}