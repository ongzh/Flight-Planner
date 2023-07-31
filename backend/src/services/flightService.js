const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;

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

const getAllAirways = async () => {
  const response = await axios.get(BASE_URL + "/geopoints/list/airways");
  return response.data;
};

const processFlightPlan = (flightPlan) => {
  let plan = {};
  plan["aircraftId"] = flightPlan["aircraftIdentification"];
  plan["departure"] = flightPlan["departure"];
  plan["arrival"] = flightPlan["arrival"];
  plan["route"] = flightPlan["filedRoute"];
  return plan;
};

module.exports = {
  getAllFlightPlans,
};
