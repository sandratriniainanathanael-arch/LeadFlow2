import { UsersTable } from "@/components/admin/users-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">User management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search users, review activity, and update plans.</p>
      </div>
      <UsersTable />
    </div>
  );
}
