const express = require("express");
const app = express();

//parse json
app.use(express.json());

const port = process.env.PORT || 3000;

const flightRoutes = require("./src/routes/flights");
app.use("/flights", flightRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
