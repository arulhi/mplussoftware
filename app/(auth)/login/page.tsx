"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { AuthServices } from "@/app/_services/login-api.services";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginInterface } from "@/app/_interface/login.interface";
import { getUsersExceptSuperadmin } from "@/lib/localStorage";

export default function Login() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [otherUsers, setOtherUsers] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const users = getUsersExceptSuperadmin();
      setOtherUsers(users);
    }
  }, []);

  const schema = z.object({
    email: z
      .string({ required_error: "Email or username is required" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
  });

  type LoginFormData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const login = await AuthServices.loginWithProtobuf({
        email: data.email,
        password: data.password,
      });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: login }),
      });

      if (!res.ok) throw new Error("Login failed");

      useAuthStore.getState().setAuthenticated(true);

      toast({ description: "Login Success", variant: "success" });
      router.push("/dashboard");
    } catch (error) {
      toast({ variant: "destructive", description: "Login Failed " + error });
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{
          backgroundImage: `url('bg_leaf.webp')`,
        }}
      >
        <div className="max-w-[25%]">
          <Card className="px-6 py-7">
            <div className="text-2xl font-medium">Sign In</div>
            <div className="mt-8 text-center">Loading...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: `url('bg_leaf.webp')`,
      }}
    >
      <div className="max-w-[25%]">
        <Card className="px-6 py-7">
          <div className="text-2xl font-medium">Sign In</div>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="mt-5 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email or username"
                  {...register("email")}
                  isError={!!errors?.email}
                />
                {errors.email && (
                  <small className="text-red-500">
                    {errors.email.message}
                  </small>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="password"
                  {...register("password")}
                  isError={!!errors?.password}
                />
                {errors.password && (
                  <small className="text-red-500">
                    {errors.password.message}
                  </small>
                )}
              </div>
            </div>
            <Button
              className="w-full rounded-2xl mt-8"
              type="submit"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin" />}
              Sign In
            </Button>
          </form>

          {/* Other Users Info */}
          {otherUsers.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <div className="font-medium mb-2">Other Users (use password: &quot;password&quot;):</div>
              <div className="space-y-2 text-muted-foreground">
                {otherUsers.map((user, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-background rounded">
                    <span className="font-mono text-xs">{user.email}</span>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded">{user.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center mt-3 justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember Me
              </label>
            </div>
            <div className="underline cursor-pointer text-sm">Need Help?</div>
          </div>
          <div className="text-sm text-muted-foreground mt-10">
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot.
          </div>
        </Card>
      </div>
    </div>
  );
}
