import { Injectable } from '@nestjs/common';

import { spawn } from 'child_process';

@Injectable()
export class SimulationService {
    runPythonEngineSimulation() {
        return new Promise<string>((resolve, reject) => {
            const scriptPath = './main.py';
            const pythonEngine = spawn('python', [scriptPath], {
                cwd: `${process.cwd()}\\python_engine`,
                env: process.env,
            });

            let stdOutMessages: string = '';
            let stdErrMessages: string = '';

            pythonEngine.stdout.on('data', (data) => {
                stdOutMessages += data.toString();
            });

            pythonEngine.stderr.on('data', (data) => {
                stdErrMessages += data.toString();
            });

            pythonEngine.on('close', (code) => {
                if (code !== 0) reject(stdErrMessages);
                else resolve(stdOutMessages);
            });
        });
    }
}
