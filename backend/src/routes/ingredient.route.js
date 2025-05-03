const express = require("express");
const router = express.Router();

const { editIngredient } = require("../controller/ingredient/editIngredient.controller");
const { createNewIngredient } = require("../controller/ingredient/createNewIngredient.controller");
const { deleteIngredient } = require("../controller/ingredient/deleteIngredient.controller");


router.post("/", createNewIngredient);
router.put("/:ingredientId", editIngredient);
router.delete("/:ingredientId", deleteIngredient);

module.exports = router;