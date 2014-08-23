Function.prototype.bind = Function.prototype.bind || require('function-bind');

var bespoke = require('bespoke');
var markdown = require('../../lib-instrumented/bespoke-markdown.js');

describe("bespoke-markdown", function() {

  var deck,

    createDeck = function() {
      var parent = document.createElement('article');
      for (var i = 0; i < 10; i++) {
        var slide = document.createElement('section');
        slide.innerHTML = 'just a __bold__ text ' + i;
        parent.appendChild(slide);
      }

      deck = bespoke.from(parent, [
        markdown()
      ]);
    };

  beforeEach(createDeck);

  describe("deck.slide", function() {

    beforeEach(function() {
      deck.slide(0);
    });

    it("should have parsed the slide from markdown to html", function() {
      expect(deck.slides[0].innerHTML.trim()).toBe('<p>just a <strong>bold</strong> text 0</p>');
    });

  });

});
