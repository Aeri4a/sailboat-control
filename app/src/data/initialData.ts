import { BoatData, TargetData, WindData } from "../types/commonTypes";

export const initialBoatData: BoatData = {
    length: 5,
    wtlr: 0.2,
    hhtlr: 0.05,
    satlsr: 0.3,
    katlsr: 0.02,
    ratsar: 0.004,
    bmtuhm: 0.6
};

export const initialWindData: WindData = {
    sp: 2
};

export const initialTargetData: TargetData = {
    value: 2,
    maxValue: 3.14,
    minValue: 0.5,
    step: 0.1
};
