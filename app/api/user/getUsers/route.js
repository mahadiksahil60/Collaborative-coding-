import { db } from "@/configuration/firebaseconfig";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const snapshot  = await getDocs(collection(db, 'Users'));
        const users = snapshot.docs.map((doc) =>  doc.data());
        
        return NextResponse.json({status:200, data: users});
               
    } catch (error) {
     
        return NextResponse.json({status: 500, message: "Error fetching users"})
    }
}