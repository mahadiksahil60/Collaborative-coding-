import { cookies } from 'next/headers';
import { auth } from "@/configuration/firebaseconfig";
import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { sign, verify } from "jsonwebtoken";


export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;

        console.log("the user data is :", user);


        //logic to set the cookies in the user browser.         
        const userCookieData = {
            uid: user.uid,
            email: user.email
        }
        const token = sign(userCookieData,process.env.JWT_KEY);
        const isSecure = process.env.NODE_ENV === 'production';
        // Set the token as an HttpOnly cookie.
        cookies().set({
            name: 'user-auth-token',
            value: token,
            httpOnly: true,
            secure: isSecure,
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60
        });
        console.log("user logged in");
        return NextResponse.json({ status: 200, message: "logged in ", user });

    } catch (error) {
        console.error("error in logging user in", error);
        return NextResponse.json({ status: 500, message: "internal error from backend" })
    }
}