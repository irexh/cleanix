import {redirect} from "next/navigation";

import {auth} from "@/auth";
import AdminShell from "@/components/admin/AdminShell";
import {prisma} from "@/lib/prisma";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sl/login");
  }

  const user = await prisma.user
    .findUnique({
      where: {email: session.user.email},
      select: {role: true}
    })
    .catch((error) => {
      console.error("Admin auth database check failed:", error);
      return null;
    });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
