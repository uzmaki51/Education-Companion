const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        {
          name: "A/A-ML",
          oneMonth: 49,
          threeMonth: 139.65,
          semiAnnual: 245,
          yearly: 441,
          MLSemiAnnual: 225,
          MLyearly: 391,
        },
        {
          name: "B/B-ML",
          oneMonth: 44,
          threeMonth: 124.65,
          semiAnnual: 220,
          yearly: 396,
          MLSemiAnnual: 200,
          MLyearly: 346,
        },
        {
          name: "C/C-ML",
          oneMonth: 39,
          threeMonth: 109.65,
          semiAnnual: 195,
          yearly: 351,
          MLSemiAnnual: 175,
          MLyearly: 301,
        },
        {
          name: "D/D-ML",
          oneMonth: 34,
          threeMonth: 94.65,
          semiAnnual: 170,
          yearly: 306,
          MLSemiAnnual: 150,
          MLyearly: 256,
        },
        {
          name: "E/E-ML",
          oneMonth: 39,
          threeMonth: 109.65,
          semiAnnual: 195,
          yearly: 351,
          MLSemiAnnual: 175,
          MLyearly: 301,
        },
        {
          name: "F/F-ML",
          oneMonth: 34,
          threeMonth: 94.65,
          semiAnnual: 170,
          yearly: 306,
          MLSemiAnnual: 150,
          MLyearly: 256,
        },
        {
          name: "G/G-ML",
          oneMonth: 29,
          threeMonth: 79.65,
          semiAnnual: 145,
          yearly: 261,
          MLSemiAnnual: 125,
          MLyearly: 211,
        },
        {
          name: "H/H-ML",
          oneMonth: 24,
          threeMonth: 64.65,
          semiAnnual: 120,
          yearly: 216,
          MLSemiAnnual: 100,
          MLyearly: 166,
        },
      ],
    });
  } catch (error) {
    console.error("Error seeding default categories:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
