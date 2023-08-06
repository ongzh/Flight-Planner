import React, { useState, useEffect } from "react";
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
	Marker,
	Line,
} from "react-simple-maps";
import { FlightPath, MapCoordinate } from "../utils/schema";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const FlightPathMap: React.FC<{ selectedFlightPath: FlightPath }> = ({
	selectedFlightPath,
}) => {
	const [displayedFlightPath, setDisplayedFlightPath] =
		useState<FlightPath | null>(null);
	const [mapCoordinates, setMapCoordinates] = useState<MapCoordinate[]>([]);

	useEffect(() => {
		if (selectedFlightPath !== displayedFlightPath) {
			setDisplayedFlightPath(selectedFlightPath);
			setMapCoordinates(parseCoordinates(selectedFlightPath));
		}
		console.log(mapCoordinates);
	}, [displayedFlightPath, mapCoordinates, selectedFlightPath]);

	if (mapCoordinates.length === 0 || selectedFlightPath === null) {
		return <div></div>;
	} else
		return (
			<ComposableMap projection="geoEqualEarth">
				<ZoomableGroup
					center={getCenterCoordinate(mapCoordinates)}
					zoom={20}
					maxZoom={150}
				>
					<Geographies geography={geoUrl}>
						{({ geographies }) =>
							geographies.map((geo) => (
								<Geography
									key={geo.rsmKey}
									geography={geo}
									style={{
										default: {
											fill: "#9998a3",
										},
									}}
								/>
							))
						}
					</Geographies>

					<Line
						coordinates={mapCoordinates.map(
							(mapCoordinate) => mapCoordinate.coordinates
						)}
						stroke="#2196f3"
						strokeWidth={0.5}
						style={{ fill: "transparent" }}
						strokeLinecap="round"
					/>
					{mapCoordinates.map(({ name, coordinates }, index) => (
						<Marker key={name} coordinates={coordinates}>
							<circle
								r={0.5}
								fill={
									index === 0
										? "green"
										: index === mapCoordinates.length - 1
										? "red"
										: "#2a354d"
								}
							/>
							<text
								textAnchor="middle"
								style={{
									fontFamily: "system-ui",
									fill: "#2a354d",
									fontSize: "0.05rem",
								}}
								x={index % 2 === 0 ? -2.5 : 2.5}
							>
								{name}
							</text>
						</Marker>
					))}
				</ZoomableGroup>
			</ComposableMap>
		);
};

const parseCoordinates = (displayedFlightPath: any) => {
	const coordinates: MapCoordinate[] = [];
	const startCoordinate: MapCoordinate = {
		name: displayedFlightPath.departure.departureAerodrome.name,
		coordinates: [
			displayedFlightPath.departure.departureAerodrome.longitude,
			displayedFlightPath.departure.departureAerodrome.latitude,
		],
	};
	coordinates.push(startCoordinate);
	displayedFlightPath.route.routeElement.forEach((element: any) => {
		if (
			element["position"] &&
			element["position"]["longitude"] &&
			element["position"]["latitude"]
		) {
			const coordinate: MapCoordinate = {
				name: element.position.name,
				coordinates: [
					element.position.longitude,
					element.position.latitude,
				],
			};
			coordinates.push(coordinate);
		}
	});
	const endCoordinate: MapCoordinate = {
		name: displayedFlightPath.arrival.destinationAerodrome.name,
		coordinates: [
			displayedFlightPath.arrival.destinationAerodrome.longitude,
			displayedFlightPath.arrival.destinationAerodrome.latitude,
		],
	};
	coordinates.push(endCoordinate);
	return coordinates;
};

const getCenterCoordinate = (
	coordinates: MapCoordinate[]
): [number, number] => {
	const centerCoordinate: MapCoordinate =
		coordinates[Math.floor(coordinates.length / 2)];
	return [centerCoordinate.coordinates[0], centerCoordinate.coordinates[1]];
};

export default FlightPathMap;
