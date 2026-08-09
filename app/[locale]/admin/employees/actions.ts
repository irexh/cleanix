"use server";

import {revalidatePath} from "next/cache";
import bcrypt from "bcryptjs";

import {sendAdminEmail} from "@/lib/admin-email";
import {employeePrisma} from "@/lib/employee-prisma";
import {prisma} from "@/lib/prisma";

const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

export async function createEmployeeAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const availability = String(formData.get("availability") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const role = String(formData.get("role") ?? "EMPLOYEE").trim();

  if (!name) {
    throw new Error("Employee name is required");
  }

  await employeePrisma.employee.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      availability: availability || null,
      notes: notes || null,
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

export async function deleteEmployeeAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Missing employee id");
  }

  const employee = await employeePrisma.employee.findUnique({
    where: {id},
    select: {email: true}
  });

  await employeePrisma.employee.delete({
    where: {id}
  });

  if (employee?.email) {
    await prisma.user
      .delete({
        where: {email: employee.email}
      })
      .catch(() => null);
  }

  revalidatePath("/sl/admin/employees");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
}

export async function createEmployeeLoginAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "").trim();
  const sendEmail = formData.get("sendEmail") === "on";

  if (!id) {
    throw new Error("Missing employee id");
  }

  if (!password || password.length < 6) {
    throw new Error("Geslo mora imeti vsaj 6 znakov.");
  }

  const employee = await employeePrisma.employee.findUnique({
    where: {id},
    select: {name: true, email: true, role: true}
  });

  if (!employee?.email) {
    throw new Error("Zaposleni nima e-poštnega naslova.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: {email: employee.email},
    create: {
      email: employee.email,
      name: employee.name,
      role: employee.role,
      password: hashedPassword
    },
    update: {
      name: employee.name,
      role: employee.role,
      password: hashedPassword
    }
  });

  if (sendEmail) {
    await sendAdminEmail({
      to: employee.email,
      subject: "Cleanix dostop",
      text: `Pozdravljeni ${employee.name},\n\nvaš Cleanix dostop je pripravljen.\n\nE-pošta: ${employee.email}\nGeslo: ${password}\n\nPrijava: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login\n\nLep pozdrav,\nCleanix`
    });
  }

  revalidatePath("/sl/admin/employees");
  revalidatePath("/sl/admin");
}
