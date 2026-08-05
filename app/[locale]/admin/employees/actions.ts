"use server";

import {revalidatePath} from "next/cache";

import {employeePrisma} from "@/lib/employee-prisma";

const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

export async function createEmployeeAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const role = String(formData.get("role") ?? "EMPLOYEE").trim();

  if (!name) {
    throw new Error("Employee name is required");
  }

  await employeePrisma.employee.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      role: allowedRoles.includes(role) ? role : "EMPLOYEE",
      isActive: true
    }
  });

  revalidatePath("/sl/admin/employees");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
}

export async function toggleEmployeeAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "on";

  if (!id) {
    throw new Error("Missing employee id");
  }

  await employeePrisma.employee.update({
    where: {id},
    data: {isActive}
  });

  revalidatePath("/sl/admin/employees");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
}
