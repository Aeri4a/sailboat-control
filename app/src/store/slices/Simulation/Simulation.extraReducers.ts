import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { SimulationDataState } from './Simulation.state';

import { startSimulation } from './Simulation.thunks';

const buildSimulationExtraReducers = (builder: ActionReducerMapBuilder<SimulationDataState>) => {
    builder
        .addCase(startSimulation.pending, (state) => {
            state.loading = true;
        })
        .addCase(startSimulation.fulfilled, (state, action) => {
            state.simulationData = action.payload;
            state.loading = false;
        })
        .addCase(startSimulation.rejected, (state) => {
            state.loading = false;
        });
};

export default buildSimulationExtraReducers;
