import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminHeader mode="demo" email="admin@proloanmatch.local" />
        {children}
      </div>
    </div>
  );
}
