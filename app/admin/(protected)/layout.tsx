import { verifySession } from "@/lib/dal";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar adminName={session.name} />
      <main className="flex-1 overflow-x-hidden p-6 lg:p-10">{children}</main>
    </div>
  );
}
