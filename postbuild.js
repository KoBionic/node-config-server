#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const paths = {
    dist: path.resolve('dist'),
    license: path.resolve('COPYRIGHT'),
};
const shebang = '#!/usr/bin/env node\n';


/**
 * Recursively lists a directory looking for JavaScript files.
 *
 * @param {any} dir the directory to list
 * @param {any} files the already listed files
 * @returns
 */
async function ls(dir, files) {
    const newFiles = files || [];
    try {
        for (const node of await readdir(dir)) {
            const nodePath = `${dir}${path.sep}${node}`;
            const stats = await stat(nodePath);

            if (stats.isDirectory()) {
                newFiles.concat(await ls(nodePath, newFiles));
            } else {
                if (path.extname(nodePath) === '.js') newFiles.push(nodePath);
            }
        }
    } catch (err) {
        console.error(err);
    }
    return newFiles;
}

/**
 * Prepend license header to each JavaScript file if not present.
 */
(async () => {
    try {
        const license = (await readFile(paths.license, 'utf8')).trim();
        const files = await ls(paths.dist);
        for (const file of files) {
            let source = await readFile(file, 'utf8');
            if (!source.includes(license)) {
                const hasShebang = source.startsWith(shebang);
                const target = fs.createWriteStream(`${file}`, { start: 0 });
                if (hasShebang) {
                    source = source.replace(shebang, '');
                    target.write(`${shebang}\n`);
                };
                target.write(`/*\n${license}\n*/\n`);
                target.write(source);
                target.end();
            }
        }
    } catch (err) {
        console.error(err);
    }
})();
