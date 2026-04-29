import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const isAuthenticated = cookieHeader?.includes("auth-token");
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  
  return NextResponse.json({ authenticated: isAuthenticated, token: token });
}
