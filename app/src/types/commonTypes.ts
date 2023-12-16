
export interface VariableObject {
    name: string;
    shortName: string;
    unit: string;
    min: number;
    max: number;
    step: number;

    defaultValue?: number;
}

export interface BoatData {
    length: number;
    wtlr: number;
    hhtlr: number;
    satlsr: number;
    katsar: number;
    ratsar: number;
    bmtuhm: number;
}

export interface WindData {
    sm: number;
    ssd: number;
    dsd: number;
}

export interface SimulationInputData {
    length: number;
    width_to_length: number;
    hull_height_to_length: number;
    sail_area_to_length_squared: number;
    keel_to_sail_area: number;
    rudder_to_sail_area: number;
    ballast_to_upper_hull_mass: number;
    wind_speed_mean: number;
    wind_speed_sd: number;
    wind_direction_sd: number;
    target_x: number;
    target_y: number;
}

export interface SimulationData {
    positionX: number[];
    positionY: number[];
    velocityX: number[];
    velocityY: number[];
    yaw: number[];
    roll: number[];
    rudderPosition: number[];
    sailPosition: number[];
    windX: number[];
    windY: number[];
}

