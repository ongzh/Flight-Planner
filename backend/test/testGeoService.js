const chai = require("chai");
const expect = chai.expect;
const geoService = require("../src/services/geoService");

describe("geoService test", () => {
	it("should process a waypoint correctly", () => {
		const waypoint = "WSSL (1.42,103.87)";
		const expectedResult = {
			name: "WSSL",
			latitude: 1.42,
			longitude: 103.87,
		};
		const result = geoService.processCoordinates(waypoint);
		expect(result).to.deep.equal(expectedResult);
	});
});
