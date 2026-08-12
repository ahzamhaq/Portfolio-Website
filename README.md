# The Ahzam Haque — Portfolio Newspaper

A single-page personal portfolio, designed as a beautiful old newspaper.

## Run

```bash
npm install
npm run dev
```

Open the dev URL printed by Vite (usually http://localhost:5173).

## Structure

- `src/components/NewspaperIntro.jsx` — closed newspaper + unfold animation
- `src/components/Newspaper.jsx` — the full editorial page
- `src/components/Portrait.jsx` — subtly-moving portrait placeholder
- `src/data/projects.js` — project content (edit here to update)

## Replacing placeholders

- **Portrait** — swap the SVG inside `Portrait.jsx` for `<img src="/me.jpg" className="h-full w-full object-cover" />` and drop the image into `public/`.
- **Project photos** — swap the SVG inside `ProjectPhoto.jsx` similarly, or accept a `src` prop per project.
- **LinkedIn / Resume** — update the `LINKS` array in `Contact.jsx`.
