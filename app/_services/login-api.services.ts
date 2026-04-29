import request from "@/app/_network/request";
import { getUsers, User } from "@/lib/localStorage";

interface LoginCredentials {
  email: string;
  password: string;
}

const loginWithProtobuf = async (credentials?: LoginCredentials) => {
  // If credentials provided, try local users first
  if (credentials?.email && credentials?.password) {
    const users = getUsers();
    const user = users.find(
      (u: User) => 
        (u.email.toLowerCase() === credentials.email.toLowerCase() || 
         u.username.toLowerCase() === credentials.email.toLowerCase()) && 
        credentials.password === "password" &&
        u.status === "active"
    );
    
    if (user) {
      // Store current user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("app_current_user", JSON.stringify(user));
      }
      // Return fake token
      return `token_${user.id}_${Date.now()}`;
    }
  }

  // Fallback to DummyJSON API for emilys
  try {
    const response = await request({
      url: `https://dummyjson.com/auth/login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
        expiresInMins: 30,
      }),
    });
    return response.accessToken || response.access_token;
  } catch (error) {
    console.log("Login failed", error);
    throw error;
  }
};

export const AuthServices = {
  loginWithProtobuf,
};
