const pool = require("../../utils/database");
const { body, validationResult } = require("express-validator");

async function createTable() {
  try {
    const conn = await pool.getConnection();

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Menu (
        MenuID VARCHAR(10) PRIMARY KEY,
        MenuStatus VARCHAR(20),
        MenuName VARCHAR(20),
        MenuPrice DECIMAL(5,2),
        MenuDescription VARCHAR(10),
        MenuCategory VARCHAR(20),
        MenuURL VARCHAR(100)
      )
    `);
    console.log("Menu table created success.");

    await conn.query(`
      CREATE TABLE IF NOT EXISTS DefaultRecipe (
        Quantity DECIMAL(8,2),
        IsBaseIngredient BOOLEAN,
        IngredientID VARCHAR(10),
        MenuID VARCHAR(10),
        isReplaceable BOOLEAN,
        PRIMARY KEY (IngredientID, MenuID),
        FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
    )
    `);
    console.log("DefaultRecipe table created success.");
  } catch (err) {
    console.error("Error creating tables:", err.message);
    process.exit(1);
  } finally {
    if (conn) {
      conn.release();
    }
  }
}
createTable();

const menuValidator = [
  body("menuName").isString().notEmpty(),
  body("menuPrice").isFloat({ gt: 0 }),
  body("menuStatus").isIn(["พร้อมขาย", "ไม่พร้อมขาย"]),
  body("menuCategory").isString().notEmpty(),
  body("menuDescription").isString(),
  body("menuUrl").isURL(),
  body("defaultRecipe").isArray({ min: 1 }),
  body("defaultRecipe.*.ingredientId").isString().notEmpty(),
  body("defaultRecipe.*.quantity").isFloat({ gt: 0 }),
  body("defaultRecipe.*.isBaseIngredient").isBoolean(),
  body("defaultRecipe.*.isReplaceable").isBoolean(),
];

const createMenu = async (req, res) => {
  const { menu } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Bad Request - Invalid input data.",
    });
  }

  try {
    const insertMenu = `
    INSERT INTO Menu (MenuName, MenuPrice, MenuStatus, MenuDescription, MenuURL, MenuCategory)
    VALUES (?, ?, ?, ?, ?, ?);
    `;

    const insertDefaultRecipe = `
    INSERT INTO DefaultRecipe (MenuID, IngredientID, Quantity, IsBaseIngredient, IsReplaceable)
    VALUES (?, ?, ?, ?, ?);
    `;

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    let result = await conn.query(insertMenu, [
      menu.menuName,
      menu.menuPrice,
      menu.menuStatus,
      menu.menuDescription,
      menu.menuURL,
      menu.menuCategory,
    ]);

    const menuId = result.insertId;
    for (const recipe of menu.defaultRecipe) {
      await conn.query(insertDefaultRecipe, [
        menuId,
        recipe.ingredientId,
        recipe.quantity,
        recipe.isBaseIngredient,
        recipe.isReplaceable,
      ]);
    }

    await conn.commit();
    conn.release();

    return res.status(201).json({
      menuId: menuId,
      menuName: menu.menuName,
      menuPrice: menu.menuPrice,
      menuStatus: menu.menuStatus,
      menuCategory: menu.menuCategory,
      menuDescription: menu.menuDescription,
      menuUrl: menu.menuURL,
    });
  } catch (err) {
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

const updateMenu = async (req, res) => {
  const { menu } = req.body;
  const menuId = req.params("menuId");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Bad Request - Invalid input data.",
    });
  }

  try {
    const updateMenu = `
    UPDATES Menu
    SET 
      MenuName = ?, 
      MenuPrice = ?, 
      MenuURL = ?, 
      MenuStatus = ?, 
      MenuCategory = ?, 
      MenuDescription = ?, 
    WHERE MenuID = ?;
    `;

    const updateDefaultRecipe = `
    UPDATES DefaultRecipe
    SET
      Quantity = ?, 
      IsBaseIngredient = ?, 
      IsReplaceable = ?
    WHERE MenuID = ? AND IngredientId = ?
    `;

    const conn = pool.getConnection();
    await conn.beginTransaction();

    await conn.query(updateMenu, [
      menu.menuName,
      menu.menuPrice,
      menu.menuURL,
      menu.menuStatus,
      menu.menuCategory,
      menu.menuDescription,
      menuId,
    ]);

    for (const recipe of menu.defaultRecipe) {
      await conn.query(updateDefaultRecipe, [
        recipe.quantity,
        recipe.isReplaceable,
        recipe.isBaseIngredient,
      ]);
    }

    await conn.commit();
    conn.release();

    return res.status(201).json({
      menuId: menuId,
      menuName: menu.menuName,
      menuPrice: menu.menuPrice,
      menuStatus: menu.menuStatus,
      menuCategory: menu.menuCategory,
      menuDescription: menu.menuDescription,
      menuUrl: menu.menuURL,
    });
  } catch (err) {
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

module.exports = {
  createMenu,
  updateMenu,
  menuValidator,
};