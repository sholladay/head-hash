'use strict';

const { exec } = require('child_process');

const headHash = (option) => {
    return new Promise((resolve, reject) => {
        const cmd = [
            'git rev-parse --verify',
            option.short ? ' --short' : '',
            ' HEAD'
        ].join('');
        exec(cmd, (err, stdout) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stdout.trimRight());
        });
    });
};

module.exports = headHash;
