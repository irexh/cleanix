import {prisma} from "@/lib/prisma";

export type BusinessInquiryRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string | null;
  message: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
};

type BusinessInquiryDelegate = {
  create(args: unknown): Promise<BusinessInquiryRecord>;
  findMany(args?: unknown): Promise<BusinessInquiryRecord[]>;
  update(args: unknown): Promise<BusinessInquiryRecord>;
};

export const businessInquiryPrisma = prisma as typeof prisma & {
  businessInquiry: BusinessInquiryDelegate;
};
