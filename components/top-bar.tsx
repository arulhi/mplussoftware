"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, getUserRole } from "@/lib/rbac";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { useGlobalStore } from "@/store/globalStore";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<any>(null);
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const title = useGlobalStore((state) => state.title);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const role = getUserRole(user);
      setUserRole(role);
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_current_user");
    }
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-40 bg-background border-b">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section: Sidebar Trigger + Breadcrumbs */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Breadcrumbs />
        </div>

        {/* Center Section: Page Title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>

        {/* Right Section: User Info + Logout + Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground">
                  {userRole?.name || currentUser.role}
                </p>
              </div>
              <div className="relative group">
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {currentUser.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Dropdown Menu on Hover/Click */}
                <div className="absolute right-0 top-12 w-56 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.username}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <div className="px-2 py-1.5 border-t">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm">{userRole?.name || currentUser.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded transition-colors flex items-center gap-2"
                  >
                    <Icon icon="mdi:logout" className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Icon icon="bi:bell" className="text-muted-foreground text-xl" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
