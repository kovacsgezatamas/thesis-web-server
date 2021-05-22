const express = require('express');

const SubscriptionController = require('../controllers/subscriptionController');
const CarController = require('../controllers/carController');

const router = express.Router();

router.get('/subscriptions', SubscriptionController.getSubscriptions);
router.get('/cars/subscription/:subscriptionId', CarController.getCarsBySubscriptionId);
router.post('/cars/subscription/:subscriptionId', CarController.createCar);
router.delete('/cars/:vin', CarController.deleteCar);

module.exports = router;
