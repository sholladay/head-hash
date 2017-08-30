'use strict';

const { exec } = require('child_process');

const headHash = (option) => {
    const config = Object.assign({}, option);

    return new Promise((resolve, reject) => {
        const short = config.short ? ' --short' : '';
        const command = `git rev-parse --verify${short} HEAD`;
        exec(command, { cwd : config.cwd }, (err, stdout) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stdout.trimRight());
        });
    });
};

module.exports = headHash;
