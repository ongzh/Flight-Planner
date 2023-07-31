const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;

const getAllAirways = async () => {
  const response = await axios.get(BASE_URL + "/geopoints/list/airways");
  return response.data;
};

module.exports = {
  getAllAirways,
};
