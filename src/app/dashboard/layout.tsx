import { getOrCreateDbUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getOrCreateDbUser();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar isAdmin={user?.isAdmin} />
      <div className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
