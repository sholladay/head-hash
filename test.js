import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import childProcess from 'child_process';
import test from 'ava';
import mkdirtemp from 'mkdirtemp';
import headHash from '.';

const exec = promisify(childProcess.exec);
const writeFile = promisify(fs.writeFile);

const git = async (command, option) => {
    const config = Object.assign(
        {
            // Tests will fail in CI without an identity.
            env : {
                GIT_AUTHOR_NAME     : 'Test',
                GIT_AUTHOR_EMAIL    : 'test@example.com',
                GIT_COMMITTER_NAME  : 'Test',
                GIT_COMMITTER_EMAIL : 'test@example.com'
            }
        },
        option
    );
    const { stdout } = await exec('git ' + command, config);
    return stdout.trimRight();
};

const initRepo = (cwd) => {
    return git('init --quiet', { cwd });
};

const commit = async (cwd) => {
    const filePath = path.resolve(cwd, 'foo.txt');
    await writeFile(filePath, 'testing 123');
    await git('add .', { cwd });
    const stdout = await git('commit --message=weee --no-verify', { cwd });
    // Return the commit hash.
    return stdout.match(/ [0-9a-f]{7,}(?=])/)[0].trimLeft();
};

const tag = (version, cwd) => {
    return git('tag -a -m hooray ' + version, { cwd });
};

test('headHash() basics', async (t) => {
    const hash = await headHash();
    t.is(typeof hash, 'string');
    // Must be a full commit hash.
    t.is(hash.length, 40);
    t.regex(hash, /^[\da-f]{40}$/);
    t.is(hash, hash.trim().toLowerCase());
});

test('short option', async (t) => {
    const fullHash = await headHash();
    t.is(fullHash.length, 40);

    const shortHash = await headHash({ short : true });
    t.true(shortHash.length > 6);
    t.true(shortHash.length < 40);
    t.true(fullHash.startsWith(shortHash));
});

test('cwd option', async (t) => {
    const tempDir = await mkdirtemp();

    await initRepo(tempDir);
    await commit(tempDir);

    const projectHead = await headHash();
    const tempDirHead = await headHash({ cwd : tempDir });
    t.is(typeof projectHead, 'string');
    t.is(projectHead.length, 40);
    t.is(typeof tempDirHead, 'string');
    t.is(tempDirHead.length, 40);
    t.not(projectHead, tempDirHead);
});

test('non-repo', async (t) => {
    const tempDir = await mkdirtemp();

    const err = await t.throws(headHash({ cwd : tempDir }));
    t.true(err.message.includes('fatal: Not a git repository (or any of the parent directories)'));
});

test('repo with no commits', async (t) => {
    const tempDir = await mkdirtemp();

    await initRepo(tempDir);

    const err = await t.throws(headHash({ cwd : tempDir }));
    t.true(err.message.includes('fatal: Needed a single revision'));
});

test('repo with one commit', async (t) => {
    const tempDir = await mkdirtemp();

    await initRepo(tempDir);
    const expectedShortHash = await commit(tempDir);

    const actualHash = await headHash({ cwd : tempDir });
    t.true(actualHash.startsWith(expectedShortHash));
    t.is(actualHash.length, 40);
});

test('short option with one commit', async (t) => {
    const tempDir = await mkdirtemp();

    await initRepo(tempDir);
    const expectedShortHash = await commit(tempDir);

    const actualHash = await headHash({
        cwd   : tempDir,
        short : true
    });
    t.is(typeof actualHash, 'string');
    t.is(actualHash.length, 7);
    t.is(actualHash, expectedShortHash);
});

test('ignore git tag', async (t) => {
    const tempDir = await mkdirtemp();

    await initRepo(tempDir);
    const expectedShortHash = await commit(tempDir);
    await tag('v1.2.3', tempDir);

    const actualHash = await headHash({ cwd : tempDir });
    t.true(actualHash.startsWith(expectedShortHash));
});
