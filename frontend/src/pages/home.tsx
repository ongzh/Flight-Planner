import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import FlightPathMap from "../components/FlightPathMap";
import DropDownBox from "../components/DropDownBox";
import { FlightPath } from "../utils/schema";

const Home: React.FC = () => {
	const [flightPlans, setFlightPlans] = useState([]);
	const [selectedFlightId, setSelectedFlightId] = useState<string>("");
	const [selectedFlightPath, setselectedFlightPath] =
		useState<FlightPath | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchFlightPlans = async () => {
			try {
				const res = await axios.get(
					"http://localhost:3001/flights/display"
				);
				setFlightPlans(res.data);
			} catch (err) {
				console.error(err);
				alert("Error fetching flight plans");
			}
		};
		fetchFlightPlans();
	}, []);

	const fetchFlightRouteById = async (id: string) => {
		try {
			const res = await axios.get(
				`http://localhost:3001/flights/display/path/${id}`
			);
			setselectedFlightPath(res.data);
			console.log(res.data);
			setLoading(false);
		} catch (err) {
			console.error(err);
			alert("Error fetching flight path");
			setLoading(false);
		}
	};

	return (
		<>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
					height: "100vh",
				}}
			>
				<Box
					sx={{
						mt: "5rem",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<DropDownBox
						flightPlans={flightPlans}
						setSelectedFlightId={setSelectedFlightId}
					></DropDownBox>

					<LoadingButton
						sx={{ height: 50, width: 120, ml: 10 }}
						onClick={() => {
							if (selectedFlightId === "") {
								alert("Please select a flight plan");
								return;
							}
							setLoading(true);
							fetchFlightRouteById(selectedFlightId);
						}}
						endIcon={<SendIcon />}
						loading={loading}
						loadingPosition="end"
						variant="contained"
					>
						<span>Submit</span>
					</LoadingButton>
				</Box>

				<Box sx={{ m: "5rem" }}>
					{selectedFlightPath && (
						<div>{selectedFlightPath.route.routeText}</div>
					)}
				</Box>

				{selectedFlightPath !== null && (
					<FlightPathMap selectedFlightPath={selectedFlightPath} />
				)}
				<Box sx={{ mt: "5rem" }}></Box>
			</Box>
		</>
	);
};

export default Home;
