const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;
const geoService = require("./geoService");

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

const getFlightByCallsign = async (callsign) => {
  const response = await axios.get(BASE_URL + "/flight-manager/displayAll");
  const flightPlan = response.data.find(
    (plan) =>
      plan.aircraftIdentification === callsign && plan.filedRoute !== undefined
  );
  if (flightPlan) {
    return processFlightPlan(flightPlan);
  } else {
    return null; // Flight plan with the provided callsign not found
  }
};

const getFlightRouteById = async (flightId) => {
  const waypoints = await geoService.getAllWaypoints();
  const response = await axios.get(BASE_URL + "/flight-manager/displayAll");
  const flightPlan = processFlightPlan(
    response.data.find((plan) => plan._id === flightId)
  );
  const flightRoute = processFlightRoute(flightPlan, waypoints);
  return flightRoute;
};

const processFlightRoute = (flightPlan, waypoints) => {
  let flightRoute = {};
  flightRoute["aircraftId"] = flightPlan["aircraftId"];
  flightRoute["departure"] = flightPlan["departure"];
  flightRoute["arrival"] = flightPlan["arrival"];
  for (const routeElement of flightPlan["route"]["routeElement"]) {
    console.log(routeElement);
    const waypoint = waypoints.find(
      (waypoint) => waypoint.name === routeElement.position.designatedPoint
    );
    routeElement.position = waypoint;
  }
  flightRoute["route"] = flightPlan["route"];
  return flightRoute;
};

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
  getFlightByCallsign,
  getFlightRouteById,
};
