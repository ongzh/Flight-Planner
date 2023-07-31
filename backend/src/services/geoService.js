const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;

const getAllAirways = async (req, res) => {
  const response = await axios.get(BASE_URL + "/geopoints/list/airways");
  return response.data;
};

const getAllWaypoints = async (req, res) => {
  let result = [];
  const response = await axios.get(BASE_URL + "/geopoints/list/fixes");
  for (const waypoint of response.data) {
    result.push(ProcessWaypoint(waypoint));
  }
  return result;
};

const ProcessWaypoint = (waypoint) => {
  let result = {};
  const [name, latitude, longitude] = waypoint
    .replace("(", "")
    .replace(")", "")
    .replace(",", " ")
    .split(" ");
  result["name"] = name;
  result["latitude"] = parseFloat(latitude);
  result["longitude"] = parseFloat(longitude);
  return result;
};

module.exports = {
  getAllAirways,
  getAllWaypoints,
};
