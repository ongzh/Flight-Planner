const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");

router.get("/display", flightController.getAllFlights);

router.get(
  "/display/flight/:callsign",
  flightController.getFlightRouteByCallsign
);

router.get(
  "/display/flight/route/:flightId",
  flightController.getFlightRouteById
);

module.exports = router;
