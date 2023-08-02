const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");

router.get("/display", flightController.getAllFlights);

router.get(
  "/display/callsign/:callsign",
  flightController.getFlightPathByCallsign
);

router.get("/display/path/:flightId", flightController.getFlightPathById);

module.exports = router;
