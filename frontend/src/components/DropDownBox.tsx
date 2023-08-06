import React, { useEffect, useState } from "react";
import { FlightPlanOption } from "../utils/schema";
import { parseFlightPlan, sleep } from "../utils/utils";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
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

export default DropDownBox;
