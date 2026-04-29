"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopBar } from "@/components/top-bar";

export default function DashboardLayout({ children }: any) {
  return (
    <SidebarProvider>
      <div>
        <AppSidebar />
      </div>
      <main className="pt-16 w-full px-6 pb-10">
        <TopBar />
        <div className="mt-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
