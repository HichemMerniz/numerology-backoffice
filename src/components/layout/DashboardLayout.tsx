import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="absolute right-4 top-4">
              <ThemeToggle />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 