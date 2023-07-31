const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");

router.get("/display", flightController.getAllFlights);

router.get("/display/flight/:callsign", flightController.getFlightByCallsign);

router.get("/display/route/:flightId", flightController.getFlightRouteById);

module.exports = router;
