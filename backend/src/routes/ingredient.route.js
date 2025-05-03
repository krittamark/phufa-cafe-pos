const express = require("express");
const router = express.Router();

const { editIngredient } = require("../controller/ingredient/editIngredient.controller");
const { createNewIngredient } = require("../controller/ingredient/createNewIngredient.controller");
const { deleteIngredient } = require("../controller/ingredient/deleteIngredient.controller");


router.post("/", createNewIngredient);
router.put("/:IngredientID", editIngredient);
router.delete("/:IngredientID", deleteIngredient);

module.exports = router;