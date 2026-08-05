import {prisma} from "@/lib/prisma";

export type GalleryImageRecord = {
  id: string;
  title: string;
  src: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type GalleryImageDelegate = {
  create(args: unknown): Promise<GalleryImageRecord>;
  delete(args: unknown): Promise<GalleryImageRecord>;
  findMany(args?: unknown): Promise<GalleryImageRecord[]>;
};

export const galleryPrisma = prisma as typeof prisma & {
  galleryImage: GalleryImageDelegate;
};
