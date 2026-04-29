"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthLayout({children}: any) {
  const router = useRouter();
  // const token = useAuthStore.getState().token;

  // useEffect(() => {
  //   console.log("token", token);
  //   if (token) {
  //     router.push("/dashboard");
  //   }
  // }, [token]);

  return (
    <div>
      {children}
    </div>
  );
};
