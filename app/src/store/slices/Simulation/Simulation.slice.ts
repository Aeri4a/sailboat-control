import { createSlice } from '@reduxjs/toolkit';
import * as simThunks from './Simulation.thunks';
import buildExtraReducers from './Simulation.extraReducers';
import { RootState } from '../..';
import { SimulationDataState } from './Simulation.state';

const initialState: SimulationDataState = {
    simulationData: null,
    loading: false
};

const slice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {},
    extraReducers: buildExtraReducers
});

export const simReducer = slice.reducer;
export const simSelector = (state: RootState) => state.sim;
export const simActions = { ...slice.actions, ...simThunks };