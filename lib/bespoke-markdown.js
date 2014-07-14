var marked = require('marked');
module.exports = function() {
  return function(deck) {
    deck.slides.forEach(function(slide) {
      slide.innerHTML = marked(slide.innerHTML);
    });
  };
};
