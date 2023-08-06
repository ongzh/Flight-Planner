import { DateTimePickerProps } from "@mui/lab";

export interface FlightPlanOption {
	label: string;
	value: string;
}

export interface MapCoordinate {
	name: string;
	//longitude, latitude
	coordinates: [number, number];
}

export interface FixPosition {
	name: string;
	latitude: number;
	longitude: number;
}

export interface Arrival {
	alternativeAerodrome: FixPosition;
	destinationAerodrome: string[];
	timeOfArrival: number;
}

export interface Departure {
	dateOfFlight: string;
	departureAerodrome: FixPosition;
	estimatedOffBlockTime: number;
	timeOfFlight: number;
}

export interface Route {
	cruisingLevel: string;
	cruisingSpeed: string;
	flightRuleCategory: string;
	otherEstimatedElapsedTime?: string[];
	routeElement: RouteElement[];
	routeText: string;
	totalEstimatedElapsedTime: string;
}

export interface RouteElement {
	airway: string;
	airwayType: string;
	changeLevel: string;
	changeSpeed: string;
	position?: FixPosition;
	seqNum: number;
}
export interface FlightPath {
	aircraftId: string;
	arrival: Arrival;
	departure: Departure;
	route: Route;
}
