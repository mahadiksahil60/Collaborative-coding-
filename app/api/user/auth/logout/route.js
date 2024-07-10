import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        cookies().delete("user-auth-token"); 
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 500, error: { message: error.message } });
    }
}