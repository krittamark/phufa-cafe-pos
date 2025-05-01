const express = require("express");
const router = express.router();

const menuValidator = require("../middlewares/menuValidator.middleware");
const createMenu = require("../controllers/menu/createMenu.controller");
const updateMenu = require("../controllers/menu/updateMenu.controller");

router.post("/", menuValidator, createMenu);
router.put("/:menuId", menuValidator, updateMenu);
