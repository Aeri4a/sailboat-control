import { VariableObject } from "../types/commonTypes";


const boatVarList: VariableObject[] = [
    {
        name: "Length",
        shortName: "length",
        unit: "m",
        max: 12,
        min: 8,
        step: 0.01
    },
    {
        name: "Width to length ratio",
        shortName: "wtlr",
        unit: "",
        max: 0.4,
        min: 0.2,
        step: 0.01
    },
    {
        name: "Hull height to length ratio",
        shortName: "hhtlr",
        unit: "",
        max: 0.15,
        min: 0.05,
        step: 0.01
    },
    {
        name: "Sail area to length squared ratio",
        shortName: "satlsr",
        unit: "",
        max: 0.6,
        min: 0.4,
        step: 0.05
    },
    {
        name: "Keel area to length squared ratio",
        shortName: "katlsr",
        unit: "",
        max: 0.06,
        min: 0.02,
        step: 0.001
    },
    {
        name: "Rudder area to sail area ratio",
        shortName: "ratsar",
        unit: "",
        max: 0.01,
        min: 0.004,
        step: 0.0001
    },
    {
        name: "Ballast mass to upper hull mass",
        shortName: "bmtuhm",
        unit: "",
        max: 1.0,
        min: 0.6,
        step: 0.001
    }
];

export default boatVarList;