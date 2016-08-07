'use strict';

const { exec } = require('child_process');

const headHash = () => {
    return new Promise((resolve, reject) => {
        exec('git rev-parse --verify HEAD', (err, stdout) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stdout.trimRight());
        });
    });
};

module.exports = headHash;
