import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);


/**
 * Recursively looks for files in a given directory in a asynchronous way.
 *
 * @export
 * @param {string} directory the directory to look in for files
 * @param {string[]} [content] the content to keep beetween recursive calls
 * @returns {Promise<string[]>} the list of files
 */
export async function ls(directory: string, content?: string[]): Promise<string[]> {
    let list = content || [];

    for (const node of await readdir(directory)) {
        const nodePath = `${directory}${path.sep}${node}`;
        const stats = await stat(nodePath);

        stats.isDirectory()
            // Recursive call if node is a directory
            ? list = await ls(nodePath, list)
            : list.push(nodePath);
    }

    return list;
}
