const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");

router.get("/displayAll", flightController.getAllFlights);

router.get("/display/:callsign", flightController.getFlightByCallsign);

module.exports = router;
