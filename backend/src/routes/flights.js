const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");

router.get("/displayAll", flightController.getAllFlights);

module.exports = router;
