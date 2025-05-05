const express = require('express');
const router = express.Router();

const updateMenuStatus = require('../controllers/menu/updateMenuStatus.controller')
const getMenuByCategory = require('../controllers/menu/getMenuByCategory.controller')

router.patch('/:menuId', updateMenuStatus);
router.get('/', getMenuByCategory);

module.exports = router;