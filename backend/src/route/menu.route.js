const express = require("express");
const router = express.router();
const {
  menuValidator,
  createMenu,
  updateMenu,
} = require("../controller/menu/menu.controller");

router.post("/", menuValidator, createMenu);
router.put("/:menuId", menuValidator, updateMenu);