import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Autocomplete, TextField } from "@mui/material";
import { parse, format } from "date-fns";

const Home: React.FC = () => {
  const [flightPlans, setFlightPlans] = useState([]);

  useEffect(() => {
    const fetchFlightPlans = async () => {
      try {
        const res = await axios.get("http://localhost:3001/flights/display");
        setFlightPlans(res.data);
        console.log(res.data[0]);
      } catch (err) {
        console.error(err);
        alert("Error fetching flight plans");
      }
    };
    fetchFlightPlans();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box></Box>
      <DropDownBox flightPlans={flightPlans}></DropDownBox>
    </Box>
  );
};

export default Home;

const DropDownBox: React.FC<{
  flightPlans: any[];
}> = ({ flightPlans }) => {
  return (
    <Autocomplete
      sx={{ width: 500 }}
      id="drop-down-box"
      freeSolo
      options={flightPlans.map((plan) => parseFlightPlan(plan))}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select a flight plan or search by callsign"
        />
      )}
    />
  );
};

const parseFlightPlan = (flightPlan: any) => {
  const flightDate = flightPlan.departure.dateOfFlight.toString();
  //convert to milliseconds
  const flightDateTime = new Date(
    flightPlan.departure.timeOfFlight * 1000
  ).toUTCString();
  const date = parse(
    flightDateTime,
    "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
    new Date()
  );
  const flightTime = format(date, "HH:mm:ss");

  return (
    flightPlan.aircraftId +
    " " +
    flightDate +
    " " +
    flightTime +
    " " +
    flightPlan.departure.departureAerodrome +
    " to " +
    flightPlan.arrival.destinationAerodrome
  );
};
