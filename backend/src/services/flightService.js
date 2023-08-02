const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;
const geoService = require("./geoService");

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

//retrieve flight path with waypoint coordinates given callsign
const getFlightPathByCallsign = async (callsign) => {
  const waypoints = await geoService.getAllWaypoints();
  const flightPlans = await axios.get(BASE_URL + "/flight-manager/displayAll");
  const flightPlan = flightPlans.data.find(
    (plan) =>
      plan.aircraftIdentification === callsign && plan.filedRoute !== undefined
  );
  if (flightPlan) {
    return processFlightRoute(processFlightPlan(flightPlan), waypoints);
  } else {
    return null; // Flight plan with the provided callsign not found
  }
};
//retrieve flight path with waypoint coordinates given flightPlan id
const getFlightPathById = async (flightId) => {
  const waypoints = await geoService.getAllWaypoints();
  const response = await axios.get(BASE_URL + "/flight-manager/displayAll");
  const flightPlan = processFlightPlan(
    response.data.find((plan) => plan._id === flightId)
  );
  const flightRoute = processFlightRoute(flightPlan, waypoints);
  return flightRoute;
};

//add waypoint coordinates to flight route
const processFlightRoute = (flightPlan, waypoints) => {
  let flightRoute = {};
  flightRoute["aircraftId"] = flightPlan["aircraftId"];
  flightRoute["departure"] = flightPlan["departure"];
  flightRoute["arrival"] = flightPlan["arrival"];
  for (const routeElement of flightPlan["route"]["routeElement"]) {
    const waypoint = waypoints.find(
      (waypoint) => waypoint.name === routeElement.position.designatedPoint
    );
    routeElement.position = waypoint;
  }
  flightRoute["route"] = flightPlan["route"];
  return flightRoute;
};

//convert flightplan to a more readable format
const processFlightPlan = (flightPlan) => {
  let plan = {};
  plan["_id"] = flightPlan["_id"];
  plan["aircraftId"] = flightPlan["aircraftIdentification"];
  plan["departure"] = flightPlan["departure"];
  plan["arrival"] = flightPlan["arrival"];
  plan["route"] = flightPlan["filedRoute"];
  return plan;
};

module.exports = {
  getAllFlightPlans,
  getFlightPathByCallsign,
  getFlightPathById,
};
