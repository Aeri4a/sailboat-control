export enum PythonEngineStatus {
    INITIALIZING = 'initializing',
    RUNNING = 'running',
    DONE = 'done',
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
