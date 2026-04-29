import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });

  response.headers.append(
    "Set-Cookie",
    "auth-token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
  );

  return response;
}
