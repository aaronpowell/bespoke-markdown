[![Build Status](https://secure.travis-ci.org/aaronpowell/bespoke-markdown.png?branch=master)](https://travis-ci.org/aaronpowell/bespoke-markdown) [![Coverage Status](https://coveralls.io/repos/aaronpowell/bespoke-markdown/badge.png)](https://coveralls.io/r/aaronpowell/bespoke-markdown)

# bespoke-markdown

Allows you to use Markdown for the content of your slides

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/aaronpowell/bespoke-markdown/master/dist/bespoke-markdown.min.js
[max]: https://raw.github.com/aaronpowell/bespoke-markdown/master/dist/bespoke-markdown.js

## Usage

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  markdown = require('bespoke-markdown');

bespoke.from('#presentation', [
  markdown()
]);
```

When using browser globals:

```js
bespoke.from('#presentation', [
  bespoke.plugins.markdown()
]);
```

## Package managers

### npm

```bash
$ npm install bespoke-markdown
```

### Bower

```bash
$ bower install bespoke-markdown
```

## Credits

This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
