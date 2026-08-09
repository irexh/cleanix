import {prisma} from "@/lib/prisma";

export type EmployeeRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  availability: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type EmployeeDelegate = {
  create(args: unknown): Promise<EmployeeRecord>;
  findMany(args?: unknown): Promise<EmployeeRecord[]>;
  update(args: unknown): Promise<EmployeeRecord>;
};

export const employeePrisma = prisma as typeof prisma & {
  employee: EmployeeDelegate;
};
