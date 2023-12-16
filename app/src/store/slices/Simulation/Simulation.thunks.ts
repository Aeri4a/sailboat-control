import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SimulationData, SimulationInputData } from "../../../types/commonTypes";
import { RootState } from "../..";

export const startSimulation = createAsyncThunk<SimulationData, SimulationInputData, { state: RootState }>(
    'simulation/run', (boatData, { rejectWithValue }) =>
        axios.post('http://localhost:3000/simulation/run', boatData)
            .then(response => response.data)
            .catch(err => rejectWithValue(err.response.data))
);
