const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;

//helper function to retrieve all airways and waypoints
const getAllAirways = async (req, res) => {
	const response = await axios.get(BASE_URL + "/geopoints/list/airways");
	return response.data;
};

const getAllWaypoints = async (req, res) => {
	let result = [];
	const response = await axios.get(BASE_URL + "/geopoints/list/fixes");
	for (const waypoint of response.data) {
		result.push(processCoordinates(waypoint));
	}
	return result;
};

const getAllAirports = async (req, res) => {
	let result = [];
	const response = await axios.get(BASE_URL + "/geopoints/list/airports");
	for (const airport of response.data) {
		result.push(processCoordinates(airport));
	}
	return result;
};

//"WSSL (1.42,103.87)" => {name: "WSSL", latitude: 1.42, longitude: 103.87}
const processCoordinates = (waypoint) => {
	const [name, latitude, longitude] = waypoint
		.replace("(", "")
		.replace(")", "")
		.replace(",", " ")
		.split(" ");

	const result = {
		name: name,
		latitude: parseFloat(latitude),
		longitude: parseFloat(longitude),
	};
	return result;
};

module.exports = {
	getAllAirways,
	getAllWaypoints,
	getAllAirports,
	processCoordinates,
};
