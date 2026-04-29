import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) return NextResponse.json({ error: "Token is required" }, { status: 400 });

  const response = NextResponse.json({ success: true });

  response.headers.append(
    "Set-Cookie",
    `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
  );

  return response;
}
