import { logger } from '@kobionic/server-lib';
import { path as rootPath } from 'app-root-path';
import { Router } from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
const readdir = promisify(fs.readdir);


const pluginRegExt = /^node-config-server-(\w{2,}(-\w{2,})*)+-plugin$/;
const pluginsDir = resolve(rootPath, 'node_modules', '@kobionic');

/**
 * Returns an array of routers loaded from plugins.
 *
 * @export
 * @returns {Promise<Router[]>} the plugins router array
 */
export async function getPlugins(): Promise<Router[]> {
    const entries = (await readdir(pluginsDir))
        .filter(val => val.match(pluginRegExt) ? true : false);

    const promises = [];
    for (const entry of entries) {
        promises.push(import(resolve(pluginsDir, entry, 'index')));
    }
    const plugins = await (Promise.all(promises));
    printPlugins(entries);
    return plugins;
}

/**
 * Prints loaded plugins list in console.
 *
 * @param {string[]} plugins the list of plugins to print
 */
function printPlugins(plugins: string[]): void {
    const toPrint = plugins.length
        ? plugins.map(val => val.replace(/^node-config-server-|-plugin$/g, '')).join(', ')
        : 'none';
    logger.info(`Plugins: ${toPrint}`);
}
