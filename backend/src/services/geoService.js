const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;

const getAllAirways = async (req, res) => {
  const response = await axios.get(BASE_URL + "/geopoints/list/airways");
  return res.json(response.data);
};

const getAllWaypoints = async (req, res) => {
  const response = await axios.get(BASE_URL + "/geopoints/list/airways");
  return res.json(response.data);
};

module.exports = {
  getAllAirways,
  getAllWaypoints,
};
