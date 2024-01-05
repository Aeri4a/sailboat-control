import { BoatData, SimulationInputData, WindData } from "../types/commonTypes";

const mapInputData = (
    boatData: BoatData,
    windData: WindData,
    direction
): SimulationInputData => ({
    length: boatData.length,
    widthToLength: boatData.wtlr,
    hullHeightToLength: boatData.hhtlr,
    sailAreaToLengthSquared: boatData.satlsr,
    keelAreaToLengthSquared: boatData.katlsr,
    rudderAreaToLengthSquared: boatData.ratsar,
    ballastToUpperHullMass: boatData.bmtuhm,

    windSpeed: windData.sp,

    targetDirection: direction
});

export default mapInputData;
