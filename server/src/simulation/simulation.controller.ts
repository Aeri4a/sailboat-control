import { Controller, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';

@Controller('simulation')
export class SimulationController {
    constructor(private simulationService: SimulationService) {}

    @Post('/run')
    getSimulationData() {
        // logger
        // check body based on model
        // make input file from body
        // run python and wait for it
        return this.simulationService.runPythonEngineSimulation();
        // collect data -> read output
        // send data from simulation output
    }
}
