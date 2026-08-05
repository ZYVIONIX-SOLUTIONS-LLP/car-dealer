"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, type LoginFormState } from "@/lib/definitions";

export async function login(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: "Enter a valid email and password." };
  }

  const { email, password } = validated.data;
  const admin = await db.adminUser.findUnique({ where: { email } });

  if (!admin) {
    return { error: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession(admin);
  redirect("/admin/dashboard");
}

export async function logout() {
  "use server";
  await deleteSession();
  redirect("/admin/login");
}
