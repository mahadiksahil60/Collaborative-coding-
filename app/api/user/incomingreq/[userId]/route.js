import { db } from "@/configuration/firebaseconfig";
import { getDoc, getDocs, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    const userDocRef = doc(db, "Users", userId);

    // Fetch the document snapshot
    const userDocSnap = await getDoc(userDocRef);

    const userDoc = userDocSnap.data();
    const requests = userDoc.incomingRequests || [];
    return NextResponse.json({ status: 200, requests });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Could not fetch requests",
    });
  }
}
