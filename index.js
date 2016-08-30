'use strict';

const { exec } = require('child_process');

const headHash = (option) => {
    const config = Object.assign({}, option);

    return new Promise((resolve, reject) => {
        const command = [
            'git rev-parse --verify',
            config.short ? ' --short' : '',
            ' HEAD'
        ].join('');
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
