
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
