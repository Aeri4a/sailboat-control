
export enum Tab {
    VARIABLES = 'variables',
    STATISTICS = 'statistics'
}

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
    katlsr: number;
    ratsar: number;
    bmtuhm: number;
}

export interface WindData {
    sp: number;
}

export interface TargetData {
    value: number;
    maxValue: number;
    minValue: number;
    step: number;
}

export interface SimulationInputData {
    length: number;
    widthToLength: number;
    hullHeightToLength: number;
    sailAreaToLengthSquared: number;
    keelAreaToLengthSquared: number;
    rudderAreaToLengthSquared: number;
    ballastToUpperHullMass: number;
    windSpeed: number;
    targetDirection: number;
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
}

