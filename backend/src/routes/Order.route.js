const express = require('express');
const router = express.Router();

const CreateNewOrder = require('../controllers/Order/CreateNewOrder.controller')

router.post('/', CreateNewOrder)

module.exports = router