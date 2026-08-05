import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-bold text-foreground">
            VELOCITY<span className="text-accent">.</span>
          </span>
          <p className="mt-2 text-sm text-muted">Dealer Admin Console</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
