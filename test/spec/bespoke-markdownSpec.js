Function.prototype.bind = Function.prototype.bind || require('function-bind');

var bespoke = require('bespoke'),
    markdown = require('../../lib-instrumented/bespoke-markdown.js');
    FIXTURES_PATH = 'base/test/fixtures/';

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

  describe("deck.slide", function() {

    beforeEach(createDeck);
    beforeEach(function() {
      deck.slide(0);
    });

    it("should have parsed the slide from markdown to html", function() {
      expect(deck.slides[0].innerHTML.trim()).toBe('<p>just a <strong>bold</strong> text 0</p>');
    });

  });

  describe("external markdown file", function() {
    var parentNode,
        createParent = function() {
          parentNode = document.createElement('article');
        };

    beforeEach(createParent);

    it("should allow an external markdown file to be provided ", function() {
      parentNode.setAttribute("data-markdown", FIXTURES_PATH + "simple.md");
      deck = bespoke.from(parentNode, [markdown()]);
      var slideContent = deck.slides[0] ? deck.slides[0].innerHTML.trim() : '';
      expect(slideContent).toBe("<p>This is a simple " +
        "sentence with a <strong>bold</strong> word.</p>");
    });

    it("should allow a markdown file with multiple slides split by \n---\n",
      function() {
      parentNode.setAttribute("data-markdown", FIXTURES_PATH + "multiple.md");
      deck = bespoke.from(parentNode, [markdown()]);
      expect(deck.slides.length).toBe(3);
      expect(deck.slides[0].innerHTML).toMatch(/first/);
      expect(deck.slides[1].innerHTML).toMatch(/second/);
      expect(deck.slides[2].innerHTML).toMatch(/third/);
    });

    it("should render an error if the external file is not reachable",
      function() {
      parentNode.setAttribute("data-markdown", FIXTURES_PATH + "does-not-exist.md");
      deck = bespoke.from(parentNode, [markdown()]);
      var slideContent = deck.slides[0] ? deck.slides[0].innerHTML.trim() : '';
      expect(slideContent).toMatch(/erro/i);
    });

    it("should allow mixed html/markdown formats for slides", function() {
      var htmlNode = document.createElement("section"),
          markdownNode = document.createElement("section");
      htmlNode.innerHTML = "this is an html node";
      markdownNode.setAttribute("data-markdown", FIXTURES_PATH + "simple.md");
      parentNode.appendChild(htmlNode);
      parentNode.appendChild(markdownNode);

      deck = bespoke.from(parentNode, [markdown()]);
      var slideContent = deck.slides[1] ? deck.slides[1].innerHTML.trim() : '';
      expect(deck.slides.length).toBe(2);
      expect(slideContent).toMatch(/<strong>/);
    });
  });

});
