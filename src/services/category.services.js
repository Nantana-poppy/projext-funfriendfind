import prisma from "../lib/prisma.js";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return categories;
}
