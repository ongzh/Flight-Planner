import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Autocomplete, TextField, CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { parseFlightPlan, sleep } from "../utils/utils";
import FlightPathMap from "../components/FlightPathMap";
import { FlightPlanOption } from "../utils/schema";

const Home: React.FC = () => {
	const [flightPlans, setFlightPlans] = useState([]);
	const [selectedFlightId, setSelectedFlightId] = useState<string>("");
	const [selectedFlightPath, setselectedFlightPath] = useState<any>(null);
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

				<Box sx={{ mt: "5rem" }}>
					{selectedFlightPath && (
						<div>{selectedFlightPath.route.routeText}</div>
					)}
				</Box>

				<FlightPathMap selectedFlightPath={selectedFlightPath} />
				<Box sx={{ mt: "5rem" }}></Box>
			</Box>
		</>
	);
};

const DropDownBox: React.FC<{
	flightPlans: any[];
	setSelectedFlightId: (flightId: string) => void;
}> = ({ flightPlans, setSelectedFlightId }) => {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<FlightPlanOption[]>([]);
	const loading = open && options.length === 0;

	useEffect(() => {
		let active = true;

		if (!loading) {
			return undefined;
		}

		(async () => {
			await sleep(1e3); // For demo purposes.

			if (active) {
				setOptions(flightPlans.map((plan) => parseFlightPlan(plan)));
			}
		})();
		return () => {
			active = false;
		};
	}, [loading, flightPlans]);

	return (
		<Autocomplete
			sx={{ width: 500 }}
			open={open}
			onOpen={() => {
				setOpen(true);
			}}
			onClose={() => {
				setOpen(false);
			}}
			onChange={(event, option) => {
				option === null
					? setSelectedFlightId("")
					: setSelectedFlightId((option as FlightPlanOption).value);
			}}
			getOptionLabel={(option) => option.label}
			options={options}
			loading={loading}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Select a flight plan or search by callsign"
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<React.Fragment>
								{loading ? (
									<CircularProgress
										color="inherit"
										size={20}
									/>
								) : null}
								{params.InputProps.endAdornment}
							</React.Fragment>
						),
					}}
				/>
			)}
		/>
	);
};

export default Home;
