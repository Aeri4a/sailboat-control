export enum PythonEngineStatus {
    INITIALIZING = 'initializing',
    RUNNING = 'running',
    DONE = 'done',
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
