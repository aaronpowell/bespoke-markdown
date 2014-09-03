var marked = require('marked'),
    hljs = require('highlight.js'),
    hljsRenderer = new marked.Renderer();

hljsRenderer.code = function(code, lang, escaped) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      code = hljs.highlight(lang, code).value;
    } catch (e) {
    }
  }

  return '<pre><code'
    + (lang
        ? ' class="hljs ' + this.options.langPrefix + lang + '"'
        : ' class="hljs"')
    + '>'
    + code
    + '\n</code></pre>\n';
};

marked.setOptions({
  renderer: hljsRenderer,
  highlight: function(code, lang) {
    var params = [code];
    if (lang) {
      params.push([lang]);
    }
    return hljs.highlightAuto.apply(this, params).value;
  }
});




/**
 * Fetches the content of a file through AJAX.
 * @param {string} path the path of the file to fetch
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
var fetchFile = function(path, callbackSuccess, callbackError) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        callbackSuccess(xhr.responseText);
      } else {
        callbackError();
      }
    }
  };
  xhr.open('GET', path, false);
  try {
    xhr.send();
  } catch (e) {
    callbackError();
  }
};

var markdownSlide = function(slide) {
  slide.innerHTML = marked(slide.innerHTML);
};

var createSlide = function(deck, slide) {
  var newSlide = document.createElement('section'),
      index;

  newSlide.className = 'bespoke-slide';
  if (typeof slide !== 'undefined' && slide instanceof HTMLElement) {
    deck.parent.insertBefore(newSlide, slide);
    index = deck.slides.indexOf(slide);
    deck.slides.splice(index, 0, newSlide);
  } else {
    deck.parent.appendChild(newSlide);
    deck.slides.push(newSlide);
  }

  return newSlide;
};

var removeSlide = function(deck, slide) {
  var slideIndex = deck.slides.indexOf(slide);
  deck.slides.splice(slideIndex, 1);
  deck.parent.removeChild(slide);
};

var slidify = function(deck, slide) {
  var markdownAttribute = slide.getAttribute('data-markdown'),
      slideIndex = deck.slides.indexOf(slide);

  switch (true) {
    // data-markdown="path-to-file.md" (so we load the .md file)
    case markdownAttribute && markdownAttribute.trim() !== '':
      fetchFile(markdownAttribute.trim(), function(fileContents) {
        var slidesContent = fileContents.split(/\r?\n---\r?\n/);
        slidesContent.forEach(function(slideContent) {
          var slideContainer = createSlide(deck, slide);
          slideContainer.innerHTML = slideContent;
          markdownSlide(slideContainer);
        });

        // removes original slide
        removeSlide(deck, slide);

      }, function() {
        slide.innerHTML = 'Error loading the .md file for this slide.';
      });
      break;

    // data-markdown="" or data-markdown (so we markdown the content)
    case markdownAttribute !== null:
      markdownSlide(slide);
      break;

    // plain html slide. Don't do anything
    default:
      break;
  }
};

var processDeckForMarkdownAttributes = function(deck) {
  var markdownAttribute = deck.parent.getAttribute('data-markdown'),
      slide;

  if (markdownAttribute && markdownAttribute.trim()) {
    // <article data-markdown="...">
    // load the whole deck from md file
    // we create an initial slide with the same markdown attribute
    slide = createSlide(deck);
    slide.setAttribute('data-markdown', markdownAttribute);
  }

  // traverse slides to see which are html and which are md (data-markdown)
  deck.slides.forEach(function(slide) {
    slidify(deck, slide);
  });
};

/**
 * Checks whether we should consider for markdown rendering:
 * - elements with the attribute data-markdown, if at least one element has
 * that. It can be one or some slides or the parent object (full presentation).
 * - the content of all slides, if no element has data-markdown.
 */
var getPluginMode = function(deck) {
  var hasDataMarkdownAttribute,
      elements = [];

  elements.push(deck.parent);
  deck.slides.forEach(function(slide) {
    elements.push(slide);
  });
  hasDataMarkdownAttribute = elements.some(function(current) {
    return current.getAttribute('data-markdown') !== null;
  });

  return hasDataMarkdownAttribute ? 'transform-marked-elements-only' :
    'transform-content-of-all-slides';
};

module.exports = function() {
  return function(deck) {
    var mode = getPluginMode(deck);

    switch (mode) {
      case 'transform-marked-elements-only':
        processDeckForMarkdownAttributes(deck);
        break;
      case 'transform-content-of-all-slides':
        deck.slides.forEach(markdownSlide);
        break;
    }
  };
};
