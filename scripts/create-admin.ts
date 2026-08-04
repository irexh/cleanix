import "dotenv/config";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const adminEmail = "admin@cleanix.si";
const adminPassword = "Ljubljana1";

async function main() {
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail
    },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      name: "cleanix admin"
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      name: "cleanix admin"
    }
  });

  console.log("Admin user created or updated:");
  console.log(admin.email);
  console.log(admin.role);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });