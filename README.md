[![Build Status](https://secure.travis-ci.org/aaronpowell/bespoke-markdown.png?branch=master)](https://travis-ci.org/aaronpowell/bespoke-markdown) [![Coverage Status](https://coveralls.io/repos/aaronpowell/bespoke-markdown/badge.png)](https://coveralls.io/r/aaronpowell/bespoke-markdown)

# bespoke-markdown

Allows you to use [(GitHub flavored) Markdown][gfm] to author your [bespoke.js](https://github.com/markdalgleish/bespoke.js) presentation.
There are 4 ways to use this plugin and they are described on the [demo page](http://aaronpowell.github.io/bespoke-markdown/demo/index.html).
[gfm]: https://help.github.com/articles/github-flavored-markdown

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/aaronpowell/bespoke-markdown/master/dist/bespoke-markdown.min.js
[max]: https://raw.github.com/aaronpowell/bespoke-markdown/master/dist/bespoke-markdown.js

## Usage

There are 3 steps to using this plugin.
  1. Including and initializing the plugin
  1. Including a stylesheet for code highlighting
  1. Authoring the presentation using Markdown


### 1. Including and initializing the plugin

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
    markdown = require('bespoke-markdown');

bespoke.from('#presentation', [
  markdown()
]);
```

If using browser globals:

```js
bespoke.from('#presentation', [
  bespoke.plugins.markdown()
]);
```


### 2. Stylesheet for code highlighting

If you want code highlighting, you also need to include a stylesheet from
[highlight.js][hljs]. One option to include it is via the dependencies of this
plugin, as highlight.js is a dependency of bespoke-markdown.
[hljs]: https://highlightjs.org/

In that case, you can include it by:

```html
<link rel="stylesheet" type="text/css" href="node_modules/bespoke-markdown/node_modules/highlight.js/styles/THEME_NAME.css" />
```

You can choose [any theme][th] from highlight.js and put it instead of
`THEME_NAME`. Some themes are:
  - default.css
  - monokai_sublime.css
  - sublime.css
  - github.css

[th]: https://highlightjs.org/static/test.html


### 3. Authoring presentation using Markdown

Just by including the plugin code and initializing bespoke with it will **allow
writing the content of the slides in Markdown**. You can use a markup similar to
the following:

```html
<article>
  <section>
# Title
This is **markdown content**.
  </section>
</article>
```

You can also write Markdown content in external files. You can do it for the
whole presentation or for specific slides. To mark a slide to be rendered using
Markdown, you need to add the `data-markdown="path-to-file.md"` attribute to the
presentation HTML element, like so:

```html
<article data-markdown="presentation.md"></article>
```

Or, you can add it to specific slides only:
```html
<article>
  <section data-markdown="slide-1.md"></section>
  <section>
    <p>A slide authored in HTML</p>
  </section>
  <section data-markdown="slide-3.md"></section>
</article>
```

You can split the `.md` file in multiple slides by using "`---`" to separate
them. For instance, `presentation.md`:

```markdown
This is the first slide
---
Second slide
---
And third!
```

Additionally, you can mix slides authored in HTML and in Markdown. To mark a
slide to have its contents rendered as Markdown, we also use the `data-markdown`
attribute, but without a value (or with an empty value, i.e.,
`data-markdown=""`). Check the example:
```html
<article>
  <section data-markdown>
    # Title 1
    This is a slide authored in Markdown.
  </section>
  <section data-markdown="">
    # Title 2
    This is also a slide authored in Markdown.
  </section>
  <section>
    <h1>Title 3</h1>
    <p>This is a slide authored in HTML.</p>
  </section>
</article>
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
