const express = require("express");
const router = express.Router();

const {
  createMenuValidator,
  updateMenuValidator,
} = require("../middlewares/menuValidator.middleware");
const createMenu = require("../controllers/menu/createMenu.controller");
const updateMenu = require("../controllers/menu/updateMenu.controller");
const updateMenuStatus = require('../controllers/menu/updateMenuStatus.controller')
const getMenuByCategory = require('../controllers/menu/getMenuByCategory.controller')
const getMenuById = require('../controllers/menu/getMenuById.controller')
const listAllMenu = require('../controllers/menu/listAllMenu.controller')
const deleteMenu = require('../controllers/menu/deleteMenu.controller')
const getDefaultRecipeForMenu = require('../controllers/menu/getDefaultRecipeForMenu.controller');

//router.get("/", getMenuByCategory);
router.get("/category/:menuCategory", getMenuByCategory);
router.post("/", createMenuValidator, createMenu);
router.put("/:menuId", updateMenuValidator, updateMenu);
router.patch("/:menuId", updateMenuStatus);
router.get("/:menuId/recipe", getDefaultRecipeForMenu);
router.get("/:menuId", getMenuById);
router.get("/", listAllMenu);
router.delete("/:menuId", deleteMenu);

module.exports = router;