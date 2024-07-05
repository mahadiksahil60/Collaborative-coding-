import { db } from "@/configuration/firebaseconfig";
import { addDoc } from "firebase/firestore";
import { auth } from "@/configuration/firebaseconfig";
import { NextResponse } from "next/server";
import { signInWithCredential } from "firebase/auth";


export async function POST(req){
    try{
        const {email, password} = await req.json();
        const userCredentials = await signInWithCredential(auth, email, password);
        const user = userCredentials.user;

        return NextResponse.json({status : 200, message: "logged in ", user});




    }catch(error){
        console.error("error in logging user in");
        return NextResponse.json({status: 500, message: "internal error from backend"})
    }
}