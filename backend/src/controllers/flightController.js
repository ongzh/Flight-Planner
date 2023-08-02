const flightService = require("../services/flightService");

const getAllFlights = async (req, res, next) => {
  try {
    res.status(200).json(await flightService.getAllFlightPlans());
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getFlightRouteByCallsign = async (req, res, next) => {
  try {
    res
      .status(200)
      .json(await flightService.getFlightByCallsign(req.params.callsign));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getFlightRouteById = async (req, res, next) => {
  try {
    res
      .status(200)
      .json(await flightService.getFlightRouteById(req.params.flightId));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getAllFlights,
  getFlightRouteByCallsign,
  getFlightRouteById,
};
