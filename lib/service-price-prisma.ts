import {prisma} from "@/lib/prisma";

export type ServicePriceRecord = {
  id: string;
  serviceKey: string;
  serviceName: string;
  propertyType: string;
  sizeRange: string;
  frequency: string;
  regularPrice: number;
  salePrice: number | null;
  saleStartsAt: string | null;
  saleEndsAt: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ServicePriceDelegate = {
  count(args?: unknown): Promise<number>;
  createMany(args: unknown): Promise<{count: number}>;
  delete(args: unknown): Promise<ServicePriceRecord>;
  findFirst(args: unknown): Promise<ServicePriceRecord | null>;
  findMany(args: unknown): Promise<ServicePriceRecord[]>;
  update(args: unknown): Promise<ServicePriceRecord>;
  upsert(args: unknown): Promise<ServicePriceRecord>;
};

export const servicePricePrisma = prisma as typeof prisma & {
  servicePrice: ServicePriceDelegate;
};
