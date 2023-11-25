import { VariableObject } from "../types/commonTypes";

const windVarList: VariableObject[] = [
    {
        name: "Speed mean",
        shortName: "sm",
        unit: "",
        max: 12,
        min: 4,
        step: 1
    },
    {
        name: "Speed standard deviation",
        shortName: "ssd",
        unit: "",
        max: 3,
        min: 0,
        step: 0.05
    },
    {
        name: "Direction standard deviation",
        shortName: "dsd",
        unit: "",
        max: 45, // in degrees
        min: 0,
        step: 5
    }
];

export default windVarList;