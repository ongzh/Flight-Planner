const flightService = require("../services/flightService");

const getAllFlights = async (req, res, next) => {
  try {
    res.status(200).json(await flightService.getAllFlightPlans());
  } catch (error) {
    console.error(error);
    next(err);
  }
};

const getFlightByCallsign = async (req, res, next) => {
  try {
    res
      .status(200)
      .json(await flightService.getFlightByCallsign(req.params.callsign));
  } catch (error) {
    console.error(error);
    next(err);
  }
};

module.exports = {
  getAllFlights,
  getFlightByCallsign,
};
