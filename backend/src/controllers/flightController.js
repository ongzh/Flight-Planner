const flightService = require("../services/flightService");

const getAllFlights = async (req, res, next) => {
	try {
		res.status(200).json(await flightService.getAllFlightPlans());
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const getFlightPathById = async (req, res, next) => {
	try {
		res.status(200).json(
			await flightService.getFlightPathById(req.params.flightId)
		);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

module.exports = {
	getAllFlights,
	getFlightPathById,
};
