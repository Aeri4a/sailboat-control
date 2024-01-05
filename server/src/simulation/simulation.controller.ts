import {
    Controller,
    InternalServerErrorException,
    Post,
    Body,
} from '@nestjs/common';

import { SimulationInputData, PythonEngineStatus } from 'src/types/common';
import { createFile, getFile } from 'src/common/file.helper';

import { SimulationService } from './simulation.service';

@Controller('simulation')
export class SimulationController {
    constructor(private simulationService: SimulationService) {}

    @Post('/run')
    async getSimulationData(@Body() inputData: SimulationInputData) {
        console.log(
            `Preparing data for simulation...| Status: ${PythonEngineStatus.INITIALIZING}`,
        );

        const filesPath = `${process.cwd()}\\python_engine`;

        await createFile(
            filesPath,
            'input.json',
            JSON.stringify(inputData, null, 4),
        ).catch(() => {
            throw new InternalServerErrorException('Write file error');
        });

        console.log(
            `Starting simulation... | Status: ${PythonEngineStatus.RUNNING}`,
        );
        await this.simulationService.runPythonEngineSimulation().catch(() => {
            throw new InternalServerErrorException('Simulation error');
        });
        console.log(
            `Simulation completed | Status: ${PythonEngineStatus.DONE}`,
        );

        const outputFile: string = (await getFile(
            `${filesPath}\\output.json`,
        )) as string;

        return JSON.parse(outputFile);
    }
}
