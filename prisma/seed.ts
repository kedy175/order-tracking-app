import { PrismaClient, Prisma, Role } from "../lib/generated/prisma/index.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const TOTAL_CUSTOMERS = 100;

async function main() {
  console.log("🌱 Seeding database (without statuses)...");

  // ---------- 1) Fetch existing statuses ----------
  const statuses = await prisma.status.findMany();
  if (statuses.length === 0) {
    throw new Error("❌ No statuses found in database. Seed aborted.");
  }

  const randomStatus = () =>
    statuses[Math.floor(Math.random() * statuses.length)];

  // ---------- 2) Admin user ----------
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.customer.upsert({
    where: { phone: "9999999999" },
    update: {},
    create: {
      phone: "9999999999",
      first_name: "Admin",
      last_name: "User",
      password_hash: adminPassword,
      role: Role.ADMIN,
    },
  });

  // ---------- 3) Create Customers ----------
  for (let i = 0; i < TOTAL_CUSTOMERS; i++) {
  const first = faker.person.firstName();
  const last = faker.person.lastName();
  const phone = "07" + faker.string.numeric(9); // ✅ fixed
  const passwordHash = await bcrypt.hash("password123", 10);

  const customer = await prisma.customer.create({
    data: {
      phone,
      first_name: first,
      last_name: last,
      password_hash: passwordHash,
      role: Role.USER,
    },
  });

  const orderCount = faker.number.int({ min: 1, max: 4 });

  for (let j = 0; j < orderCount; j++) {
    const status = randomStatus();
    const price = faker.number.float({
      min: 5,
      max: 300,
      precision: 0.01,
    });

    await prisma.order.create({
      data: {
        customer_id: customer.customer_id,
        status_id: status.status_id,
        price,
        date_delivered:
          status.description === "Delivered" ? faker.date.past() : null,
      },
    });
  }
}


  console.log("✔ Seeding complete!");
}

main()
  .catch((err) => {
    console.error("❌ Error while seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
