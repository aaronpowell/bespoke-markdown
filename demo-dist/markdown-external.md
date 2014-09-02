# &lt; [Back](index.html)

This is a sample usage of [bespoke-markdown](https://github.com/aaronpowell/bespoke-markdown)
using **an external markdown file** for the whole presentation.

The structure of the html of the presentation:

```html
<article data-markdown="markdown-external.md"></article>
```

For reference, look for these files in this plugin folder structure:
  - `demo/markdown-external.html`
  - `demo/markdown-external.md`

<br><br>

Please, proceed to the next slide.

---

And the markdown-external.md file:

```markdown
# Sample usage

What does the fox say?

  * Ding ding ding ding ding
  * Wapapapapa-papow
  * Rati-rati-rati-how

---

# Second slide

The "---" in its own line creates a new slide.

```

<br><br>

Go to the next slides to **see how that code gets rendered**.

---

# Sample usage

What does the fox say?
  * (  ) Ding ding ding ding ding
  * (  ) Wapapapapa-papow
  * (  ) Rati-rati-rati-how

---

# Second slide

The "---" in its own line creates a new slide.
