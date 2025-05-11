const express = require('express');
const router = express.Router();

const listIngredientCategories = require('../controllers/ingredient-categories/listIngredientCategories.controller');

router.get('/', listIngredientCategories);

module.exports = router;
