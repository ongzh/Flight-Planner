import React from "react";
import { render, screen } from "@testing-library/react";
import DropDownBox from "../../components/DropDownBox";

test("renders without errors", () => {
	render(<DropDownBox flightPlans={[]} setSelectedFlightId={() => {}} />);

	const inputElement = screen.getByLabelText(
		"Select a flight plan or search by callsign"
	);

	expect(inputElement).toBeInTheDocument();
});
