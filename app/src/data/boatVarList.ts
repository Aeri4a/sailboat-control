import { VariableObject } from "../types/commonTypes";


const boatVarList: VariableObject[] = [
    {
        name: "Length",
        shortName: "length",
        unit: "",
        max: 12,
        min: 5,
        step: 1
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
        min: 0.3,
        step: 0.05
    },
    {
        name: "Keel area to sail area ratio",
        shortName: "katsar",
        unit: "",
        max: 0.1,
        min: 0.02,
        step: 0.01
    },
    {
        name: "Rudder area to sail area ratio",
        shortName: "ratsar",
        unit: "",
        max: 0.02,
        min: 0.007,
        step: 0.001
    },
    {
        name: "Ballast mass to upper hull mass",
        shortName: "bmtuhm",
        unit: "",
        max: 1.0,
        min: 0.6,
        step: 0.01
    }
];

export default boatVarList;