import { db } from "@/lib/db";
import { getOrCreateDbUser, isPaidPlan } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const user = await getOrCreateDbUser();
  const leadCount = user ? await db.lead.count({ where: { search: { userId: user.id } } }) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account, plan, and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={isPaidPlan(user?.plan ?? "FREE") ? "success" : "muted"}>
                {user?.plan ?? "FREE"}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {leadCount} leads generated to date.
              </p>
            </div>
            {!isPaidPlan(user?.plan ?? "FREE") && (
              <Button asChild>
                <a href="/#pricing">Upgrade plan</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsPanel />
        </CardContent>
      </Card>

      <Separator />

      <p className="text-xs text-muted-foreground">
        Need help with your account? <a href="/contact" className="text-cyan hover:underline">Contact support</a>.
      </p>
    </div>
  );
}
