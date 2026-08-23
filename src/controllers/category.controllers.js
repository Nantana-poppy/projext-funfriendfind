import { getCategories } from "../services/category.services.js";

export async function getCategoriesController(req, res, next) {
  try {
    const categories = await getCategories();

    res.status(200).json({
      status: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}