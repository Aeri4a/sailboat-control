import { BoatData, SimulationInputData, WindData } from "../types/commonTypes";

const mapInputData = (
    boatData: BoatData,
    windData: WindData
): SimulationInputData => ({
    length: boatData.length,
    width_to_length: boatData.wtlr,
    hull_height_to_length: boatData.hhtlr,
    sail_area_to_length_squared: boatData.satlsr,
    keel_to_sail_area: boatData.katsar,
    rudder_to_sail_area: boatData.ratsar,
    ballast_to_upper_hull_mass: boatData.bmtuhm,

    wind_speed_mean: windData.sm,
    wind_speed_sd: windData.ssd,
    wind_direction_sd: windData.dsd,

    target_x: 700.0,
    target_y: 700.0,
});

export default mapInputData;
