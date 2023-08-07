const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;
const geoService = require("./geoService");
const haversine = require("haversine-distance");

//retrieve all flight plans, convert to a more readable format
const getAllFlightPlans = async () => {
	let result = [];
	const response = await axios.get(BASE_URL + "/flight-manager/displayAll");
	for (const plan of response.data) {
		//some flight plan have enRoute instead of filedRoute
		if (plan["filedRoute"] === undefined) {
			continue;
		}
		result.push(processFlightPlan(plan));
	}
	return result;
};

//retrieve flight path with waypoint coordinates given flightPlan id
const getFlightPathById = async (flightId) => {
	const waypoints = await geoService.getAllWaypoints();
	const airports = await geoService.getAllAirports();
	const response = await axios.get(BASE_URL + "/flight-manager/displayAll");
	const flightPlan = processFlightPlan(
		response.data.find((plan) => plan._id === flightId)
	);
	const flightPath = processflightPath(flightPlan, waypoints, airports);
	return flightPath;
};

//add waypoint and airport coordinates to flight route
const processflightPath = (flightPlan, waypoints, airports) => {
	let flightPath = {};
	//set departure and arrival coordinates
	flightPath["aircraftId"] = flightPlan["aircraftId"];
	flightPlan["departure"]["departureAerodrome"] = airports.find(
		(airport) =>
			airport.name === flightPlan["departure"]["departureAerodrome"]
	);
	flightPlan["arrival"]["destinationAerodrome"] = airports.find(
		(airport) =>
			airport.name === flightPlan["arrival"]["destinationAerodrome"]
	);
	flightPath["departure"] = flightPlan["departure"];
	flightPath["arrival"] = flightPlan["arrival"];

	//set waypoint coordinates for each route element
	prevCoord = [
		flightPlan["departure"]["departureAerodrome"]["latitude"],
		flightPlan["departure"]["departureAerodrome"]["longitude"],
	];

	for (const routeElement of flightPlan["route"]["routeElement"]) {
		if (!routeElement["position"]) {
			continue;
		}
		const possibleWaypoints = waypoints.filter(
			(waypoint) =>
				waypoint.name === routeElement.position.designatedPoint
		);
		if (possibleWaypoints.length === 0) {
			continue;
		} else if (possibleWaypoints.length === 1) {
			routeElement.position = possibleWaypoints[0];
			prevCoord = [
				possibleWaypoints[0].latitude,
				possibleWaypoints[0].longitude,
			];
		}
		//if two waypoint have the same name, take the one with minimum distance from previous waypoint
		else if (possibleWaypoints.length > 1) {
			let minDistanceWaypoint = possibleWaypoints[0];
			let minDistance = haversine(prevCoord, [
				possibleWaypoints[0].latitude,
				possibleWaypoints[0].longitude,
			]);
			//go through list of possible waypoints and find the one with minimum distance
			for (let i = 1; i < possibleWaypoints.length; i++) {
				const distance = haversine(prevCoord, [
					possibleWaypoints[i].latitude,
					possibleWaypoints[i].longitude,
				]);
				if (distance < minDistance) {
					minDistanceWaypoint = possibleWaypoints[i];
					minDistance = distance;
				}
			}
			routeElement.position = minDistanceWaypoint;
			prevCoord = [
				minDistanceWaypoint.latitude,
				minDistanceWaypoint.longitude,
			];
		}
	}
	flightPath["route"] = flightPlan["route"];

	return flightPath;
};

//convert flightplan to a more readable format
const processFlightPlan = (flightPlan) => {
	const plan = {
		_id: flightPlan["_id"],
		aircraftId: flightPlan["aircraftIdentification"],
		departure: flightPlan["departure"],
		arrival: flightPlan["arrival"],
		route: flightPlan["filedRoute"],
	};

	return plan;
};

module.exports = {
	getAllFlightPlans,
	getFlightPathById,
};
