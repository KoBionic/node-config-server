#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const paths = {
    dist: path.resolve('dist'),
    index: path.resolve('dist', 'bin', 'www'),
    license: path.resolve('COPYRIGHT'),
};
const shebang = '#!/usr/bin/env node\n';


/**
 * Recursively lists a directory looking for JavaScript files.
 *
 * @param {*} dir the directory to list
 * @param {*} files the already listed files
 * @returns the files list
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
 * Prepends header to any listed file.
 */
async function prependHeader() {
    try {
        const license = (await readFile(paths.license, 'utf8')).trim();
        const files = await ls(paths.dist);
        files.push(paths.index);

        // Prepend header to each listed file
        for (const file of files) {
            const source = await readFile(file, 'utf8');
            const target = fs.createWriteStream(file, { start: 0 });
            // Prepend shebang to index file only
            if (file === paths.index) target.write(shebang);
            target.write(`/*\n${license}\n*/\n`);
            target.write(source);
            target.end();
        }
    } catch (err) {
        console.error(err);
    }
}

/**
 * Prepend license header to each JavaScript file if not present.
 */
(async () => {
    try {
        await prependHeader();
    } catch (err) {
        console.error(err);
    }
})();
