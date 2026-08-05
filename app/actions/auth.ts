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
  let admin = await db.adminUser.findUnique({ where: { email } }).catch(() => null);

  if (!admin) {
    const defaultEmail = process.env.ADMIN_EMAIL ?? "admin@velocitymotors.example";
    const defaultPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
    
    if (email.toLowerCase() === defaultEmail.toLowerCase() || (await db.adminUser.count().catch(() => 0)) === 0) {
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      admin = await db.adminUser.upsert({
        where: { email: defaultEmail },
        update: { passwordHash },
        create: { email: defaultEmail, name: "Dealership Admin", passwordHash },
      }).catch(() => null);
    }
  }

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
