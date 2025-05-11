// backend/controllers/menu/listAllMenuItems.controller.js
const db = require("../../utils/database");

/**
 * @desc    List All Menu Items
 * @route   GET /api/menu
 * @access  Private (Requires bearerAuth)
 */
module.exports = async (req, res) => {

  const { category } = req.query;

  try {
    let query =
      "SELECT MenuID, MenuName, MenuPrice, MenuStatus, MenuCategory, MenuDescription, MenuURL FROM Menu";
    const queryParams = [];

    if (category) {
      query += " WHERE MenuCategory = ?";
      queryParams.push(category);
    }

    const menus = await db.query(query, queryParams);

    if (!menus || (menus.length === 0 && category)) {
      // If filtering by category and no items found, it's not necessarily an error,
      // could be an empty category or non-existent one.
      // The spec for /menu doesn't define a 404 for non-existent category query param.
      // It lists 200 for "A list of menu items." which can be an empty list.
    }

    res.status(200).json(menus);
  } catch (error) {
    console.error("Error listing all menu items:", error);
    res
      .status(500)
      .json({
        message: "An unexpected error occurred while retrieving menu items.",
      });
  }
};
