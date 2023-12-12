import { Injectable } from '@nestjs/common';

import { spawn } from 'child_process';

@Injectable()
export class SimulationService {
    async runPythonEngineSimulation() {
        const exec = () =>
            new Promise((resolve, reject) => {
                const scriptPath = './main.py';
                const pythonEngine = spawn('python', [scriptPath], {
                    cwd: `${process.cwd()}\\python_engine`,
                    env: process.env,
                });

                let datax = '';
                let errorMsg = '';
                pythonEngine.stdout.on('data', (data) => {
                    datax += ` ${data.toString()}`;
                });

                pythonEngine.stderr.on('data', (data) => {
                    errorMsg += ` ${data.toString()}`;
                });

                pythonEngine.on('close', (code) => {
                    if (code !== 0) reject(errorMsg);
                    else resolve(datax);
                });
            });

        return await exec();

        // const path = './python_engine/test.py';
        // const pythonEngine = spawn('python', [path], {
        //     cwd: process.cwd(),
        //     env: process.env,
        // });
        // pythonEngine.stdout.on('data', (data) => {
        // });
    }
}
