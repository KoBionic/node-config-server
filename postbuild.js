#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const chmod = promisify(fs.chmod);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const Vars = {
    dist: path.resolve('dist'),
    index: path.resolve('dist', 'bin', 'www'),
    license: path.resolve('COPYRIGHT'),
    shebang: '#!/usr/bin/env node\n',
};


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
function prependHeader() {
    return new Promise(async (resolve, reject) => {
        try {
            const license = (await readFile(Vars.license, 'utf8')).trim();
            const files = await ls(Vars.dist);
            files.unshift(Vars.index);

            // Prepend header to each listed file
            for (const file of files) {
                const source = await readFile(file, 'utf8');
                const target = fs.createWriteStream(file, { start: 0 });
                if (file === Vars.index) target.write(Vars.shebang);
                target.write(`/*\n${license}\n*/\n`);
                target.end(source);
            }
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Does chmod 775 on binary file.
 */
function chmodBinary() {
    return chmod(Vars.index, 0o775);
}

/**
 * Prepend license header to each JavaScript file if not present.
 */
(async () => {
    try {
        await prependHeader();
        await chmodBinary();
    } catch (err) {
        console.error(err);
    }
})();
