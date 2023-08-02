import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Autocomplete, TextField, CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { FlightPlanOption, parseFlightPlan } from "../utils/utils";

const Home: React.FC = () => {
	const [flightPlans, setFlightPlans] = useState<any>([]);
	const [selectedFlightId, setSelectedFlightId] = useState<string>("");
	const [displayedFlightPath, setDisplayedFlightPath] = useState<any>(null);
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
			setDisplayedFlightPath(res.data);
			console.log(res.data);
			setLoading(false);
		} catch (err) {
			console.error(err);
			alert("Error fetching flight path");
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				height: "100vh",
			}}
		>
			<Box sx={{ mt: "5rem" }}>
				<DropDownBox
					flightPlans={flightPlans}
					setSelectedFlightId={setSelectedFlightId}
				></DropDownBox>

				<LoadingButton
					onClick={() => {
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
				{displayedFlightPath && (
					<div>{displayedFlightPath.route.routeText}</div>
				)}
			</Box>
		</Box>
	);
};

const sleep = (delay = 0) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};

const DropDownBox: React.FC<{
	flightPlans: any[];
	setSelectedFlightId: (flightId: string) => void;
}> = ({ flightPlans, setSelectedFlightId }) => {
	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = React.useState<readonly FlightPlanOption[]>(
		[]
	);
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
			isOptionEqualToValue={(option, value) =>
				option.label === value.label
			}
			onChange={(event, option) => {
				setSelectedFlightId((option as FlightPlanOption).value);
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
