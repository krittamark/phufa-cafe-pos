const express = require('express');
const router = express.Router();

const createNewOrder = require('../controllers/order/createNewOrder.controller');
const updateOrderStatus = require('../controllers/order/updateOrderStatus.controller');
const deleteOrderById = require('../controllers/order/deleteOrderById.controller');

router.delete('/:orderId', deleteOrderById)
router.post('/', createNewOrder)
router.patch('/:orderId', updateOrderStatus);

module.exports = router