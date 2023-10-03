const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        {
          name: "A/A-ML",
          one_month: 49,
          three_month: 139.65,
          semi_annual: 245,
          yearly: 441,
          MLSemi_annual: 225,
          MLyearly: 391,
        },
        {
          name: "B/B-ML",
          one_month: 44,
          three_month: 124.65,
          semi_annual: 220,
          yearly: 396,
          MLSemi_annual: 200,
          MLyearly: 346,
        },
        {
          name: "C/C-ML",
          one_month: 39,
          three_month: 109.65,
          semi_annual: 195,
          yearly: 351,
          MLSemi_annual: 175,
          MLyearly: 301,
        },
        {
          name: "D/D-ML",
          one_month: 34,
          three_month: 94.65,
          semi_annual: 170,
          yearly: 306,
          MLSemi_annual: 150,
          MLyearly: 256,
        },
        {
          name: "E/E-ML",
          one_month: 39,
          three_month: 109.65,
          semi_annual: 195,
          yearly: 351,
          MLSemi_annual: 175,
          MLyearly: 301,
        },
        {
          name: "F/F-ML",
          one_month: 34,
          three_month: 94.65,
          semi_annual: 170,
          yearly: 306,
          MLSemi_annual: 150,
          MLyearly: 256,
        },
        {
          name: "G/G-ML",
          one_month: 29,
          three_month: 79.65,
          semi_annual: 145,
          yearly: 261,
          MLSemi_annual: 125,
          MLyearly: 211,
        },
        {
          name: "H/H-ML",
          one_month: 24,
          three_month: 64.65,
          semi_annual: 120,
          yearly: 216,
          MLSemi_annual: 100,
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
