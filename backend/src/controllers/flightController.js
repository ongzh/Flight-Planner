const axios = require("axios");
const { API_KEY, BASE_URL } = require("../utils/utils");
axios.defaults.headers["apikey"] = API_KEY;
const getAllFlights = async (req, res) => {
  try {
    const response = await axios.get(BASE_URL + "/flight-manager/displayAll");
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = {
  getAllFlights,
};
