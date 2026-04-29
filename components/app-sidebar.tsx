"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { menus } from "@/constant/data";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getCurrentUser, hasPermission, getUserRole } from "@/lib/rbac";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const [isClient, setIsClient] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
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

  const isPathActive = (menuUrl: string): boolean => {
    if (!isClient || typeof window === "undefined") return false;
    return window.location.pathname.startsWith(menuUrl);
  };

  const canViewMenu = (item: any): boolean => {
    const permissionMap: { [key: string]: string } = {
      "/dashboard": "dashboard:view",
      "/data": "data:view",
      "/users": "users:view",
      "/roles": "roles:view",
    };
    const permission = permissionMap[item.url];
    if (!permission) return true;
    return hasPermission(currentUser, permission);
  };

  if (!isClient) {
    return null;
  }

  return (
    <Sidebar>
      <div className="flex justify-between px-5 py-8 relative">
        <div className="text-xl font-bold">
          M+ Software
        </div>
      </div>
      {menus?.map((menu, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{menu.group_name}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu?.items?.map((item: any, idx: number) => {
                const isActive = isPathActive(item.url);

                return (
                  !item.isHide && canViewMenu(item) && (
                    <div key={idx}>
                      {item?.child?.length === 0 && canViewMenu(item) ? (
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            className={`${
                              isActive
                                ? "border-l-4 border-l-default font-semibold"
                                : "text-muted-foreground"
                            } rounded-none hover:bg-muted `}
                          >
                            <a
                              href={item.url}
                              className={`flex items-center ${
                                isActive ? "" : ""
                              }`}
                            >
                              <Icon
                                icon={item.icon}
                                className={`${isActive && "text-default"}`}
                              />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ) : (
                        <Collapsible className="group/collapsible">
                          <SidebarMenuItem>
                            <CollapsibleTrigger
                              className="w-full"
                              onClick={() => setIsCollapse(!isCollapse)}
                            >
                              <SidebarMenuButton
                                asChild
                                className={`${
                                  isActive
                                    ? "border-l-4 border-l-default font-semibold"
                                    : "text-muted-foreground"
                                } rounded-none hover:bg-muted `}
                              >
                                <a
                                  href={item.url}
                                  className="flex w-full items-center"
                                >
                                  <Icon
                                    icon={item.icon}
                                    className={`${isActive && "text-default"}`}
                                  />
                                  <span>{item.title}</span>
                                  <ChevronDown className="ml-auto chevron-button-sidebar transition-transform data-[state=open]:rotate-180" />
                                </a>
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              {item?.child?.map((child: any, i: number) => {
                                const isChildActive = isPathActive(child.url);
                                const canViewChild = (): boolean => {
                                  const permissionMap: { [key: string]: string } = {
                                    "/users": "users:view",
                                    "/roles": "roles:view",
                                  };
                                  const permission = permissionMap[child.url];
                                  if (!permission) return true;
                                  return hasPermission(currentUser, permission);
                                };

                                return (
                                  !child.isHide && canViewChild() && (
                                    <SidebarMenuButton
                                      key={i}
                                      asChild
                                      className={`pl-6 ${
                                        isChildActive
                                          ? "border-l-4 border-l-default font-semibold"
                                          : "text-muted-foreground"
                                      } rounded-none hover:bg-muted`}
                                    >
                                      <a href={child.url}>{child.title}</a>
                                    </SidebarMenuButton>
                                  )
                                );
                              })}
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      )}
                    </div>
                  )
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}

      {/* User Info & Logout at Bottom */}
      {isClient && currentUser && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-sidebar">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-default/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-default">
                  {currentUser.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currentUser.username}</span>
                <span className="text-xs text-muted-foreground">
                  {userRole?.name || currentUser.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
