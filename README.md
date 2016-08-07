# head-hash [![Build status for head-hash on Circle CI.](https://img.shields.io/circleci/project/sholladay/head-hash/master.svg "Circle Build Status")](https://circleci.com/gh/sholladay/head-hash "Head Hash Builds")

> Get the current commit hash.

## Why?

 - Useful hash for cache busting.
 - Can be used as a [build version](https://github.com/sholladay/build-version).
 - Identify code without leaking secrets.

## Install

```sh
npm install head-hash --save
```

## Usage

Get it into your program.

```js
const headHash = require('head-hash');
```

Get the hash of the current [HEAD](http://stackoverflow.com/a/2529982 "The git HEAD is the current commit.").

```js
headHash().then((hash) => {
    console.log('hash:', hash);
});
```

## Contributing

See our [contributing guidelines](https://github.com/sholladay/head-hash/blob/master/CONTRIBUTING.md "The guidelines for participating in this project.") for more details.

1. [Fork it](https://github.com/sholladay/head-hash/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/head-hash/compare "Submit code to this project for review.").

## License

[MPL-2.0](https://github.com/sholladay/head-hash/blob/master/LICENSE "The license for head-hash.") © [Seth Holladay](http://seth-holladay.com "Author of head-hash.")

Go make something, dang it.
