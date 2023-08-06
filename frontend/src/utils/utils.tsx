import { parse, format } from "date-fns";
import { FlightPlanOption } from "./schema";

export const parseFlightPlan = (flightPlan: any): FlightPlanOption => {
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
	const label =
		flightPlan.aircraftId +
		" " +
		flightDate +
		" " +
		flightTime +
		" " +
		flightPlan.departure.departureAerodrome +
		" to " +
		flightPlan.arrival.destinationAerodrome;

	return { label: label, value: flightPlan._id };
};

export const sleep = (delay = 0) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};
