# Is Sonam Wangchuk Dead Yet?

A clearly labeled satirical GitHub Pages status page about Sonam Wangchuk's 2026 hunger strike.

The main answer is manually editorialized from current reporting. The site is not a medical monitor, death notice, or prediction. Factual support is visible on the page and preserved in `data/sources.json`.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Test

```bash
npm test
```

## Updating the status

1. Verify current reporting and primary-source posts.
2. Update the visible status and checked time in `index.html`.
3. Update `STATUS_DATE` in `app.js`.
4. Update `data/sources.json` and keep each claim tied to a source.
5. Run `npm test` and check desktop/mobile layouts before publishing.

## Publishing

The site is dependency-free static HTML/CSS/JavaScript and is ready for GitHub Pages from the `main` branch root.
