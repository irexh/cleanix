import {prisma} from "@/lib/prisma";

export type AnnouncementRecord = {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AnnouncementDelegate = {
  create(args: unknown): Promise<AnnouncementRecord>;
  delete(args: unknown): Promise<AnnouncementRecord>;
  findMany(args: unknown): Promise<AnnouncementRecord[]>;
};

export const announcementPrisma = prisma as typeof prisma & {
  announcement: AnnouncementDelegate;
};
