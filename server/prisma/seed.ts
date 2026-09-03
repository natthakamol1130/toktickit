import { getPrisma } from "../src/prisma.js";

async function main() {
  const prisma = getPrisma();

  // 1. Seed Categories (4 required)
  const categories = [
    "Account and Access",
    "Hardware",
    "Software",
    "Network",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
  }

  // 2. Seed Related Systems (7 systems)
  const relatedSystems = [
    "Email",
    "Campus Wi-Fi",
    "VPN",
    "LEB2 App",
    "Grade Submission App",
    "Printer",
    "Corporate Laptop",
  ];

  for (const name of relatedSystems) {
    await prisma.relatedSystem.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
  }

  // 3. Seed Development Requesters (4 active, 1 inactive)
  const requesters = [
    {
      name: "Jennifer Anderson",
      email: "jennifer.anderson@kmutt.ac.th",
      department: "Computer Engineering",
      isActive: true,
    },
    {
      name: "Michael Brown",
      email: "michael.brown@kmutt.ac.th",
      department: "Information Technology",
      isActive: true,
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@kmutt.ac.th",
      department: "Electronic Engineering",
      isActive: true,
    },
    {
      name: "David Lee",
      email: "david.lee@kmutt.ac.th",
      department: "Software Engineering",
      isActive: true,
    },
    {
      name: "Inactive Test User",
      email: "inactive.user@kmutt.ac.th",
      department: "Archived Staff",
      isActive: false,
    },
  ];

  for (const req of requesters) {
    await prisma.requesterUser.upsert({
      where: { email: req.email },
      update: {
        name: req.name,
        department: req.department,
        isActive: req.isActive,
      },
      create: req,
    });
  }

  console.log("Seeded Lab 2 categories, related systems, and requesters successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
