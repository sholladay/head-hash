'use strict';

const { promisify } = require('util');
const childProcess = require('child_process');

const exec = promisify(childProcess.exec);

const headHash = async (option) => {
    const config = Object.assign({}, option);

    const short = config.short ? ' --short' : '';
    const command = `git rev-parse --verify${short} HEAD`;
    const { stdout } = await exec(command, { cwd : config.cwd });
    return stdout.trimRight();
};

module.exports = headHash;
