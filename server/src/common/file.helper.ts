import { InternalServerErrorException } from '@nestjs/common';
import { promises as fsp } from 'fs';

/**
 * Check if a file exists at a given path.
 *
 * @param {string} path
 *
 * @returns {boolean}
 */
export const checkIfFileOrDirectoryExists = (path: string): Promise<void> => {
    return fsp.access(path);
};

/**
 * Gets file data from a given path via a promise interface.
 *
 * @param {string} path
 * @param {string} encoding
 *
 * @returns {Promise<Buffer>}
 */
export const getFile = async (path: string): Promise<string | Buffer> => {
    return fsp.readFile(path, { encoding: 'utf8' });
};

/**
 * Writes a file at a given path via a promise interface.
 *
 * @param {string} path
 * @param {string} fileName
 * @param {string} data
 *
 * @return {Promise<void>}
 */
export const createFile = async (
    path: string,
    fileName: string,
    data: string,
): Promise<void> => {
    await checkIfFileOrDirectoryExists(path).catch((err) => {
        throw new InternalServerErrorException(err);
    });

    return fsp.writeFile(`${path}\\${fileName}`, data, { encoding: 'utf8' });
};

/**
 * Delete file at the given path via a promise interface
 *
 * @param {string} path
 *
 * @returns {Promise<void>}
 */
export const deleteFile = async (path: string): Promise<void> => {
    return await fsp.unlink(path);
};
