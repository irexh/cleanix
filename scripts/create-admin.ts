import "dotenv/config";
import { PrismaClient } from "@/lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@cleanix.com";
  const password = "Admin123!";

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    console.log("✅ Admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: "Administrator",
      email,
      password: hashedPassword,
    },
  });

  console.log("✅ Admin created successfully!");
  console.log("--------------------------------");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });