const flightService = require("../services/flightService");

const getAllFlights = async (req, res, next) => {
  try {
    res.status(200).json(await flightService.getAllFlightPlans());
  } catch (error) {
    console.error(error);
    next(err);
  }
};

const getAllAirways = async (req, res, next) => {
  try {
    res.status(200).json(await flightService.getAllAirways());
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getAllFlights,
};
