# Gerald — Full-Stack Developer Portfolio

A production-ready personal portfolio built around Gerald's full-stack development work. The site features an original responsive interface, dark/light themes, subtle motion, data-driven project cards, accessible project case studies, and a validated contact form ready for a delivery service.

## Technologies

- React 18 and Vite
- JavaScript and modern CSS
- Framer Motion
- Lucide React and React Icons
- Vercel-ready static deployment

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The compiled site is written to `dist/`.

## Edit profile information

Edit `src/data/profile.js`. This is the central location for the name, title, summary, email address, location, GitHub, LinkedIn, availability, resume path, and statistics.

The initial email and social links are intentionally obvious placeholders. Replace them before publishing.

## Add or edit projects

Projects are stored in `src/data/projects.js`. Add a new object to the exported array; no component changes are required.

```js
{
  id: 'unique-project-id',
  title: 'Project title',
  category: 'Project category',
  description: 'Short card description',
  image: '/images/projects/project-file.svg',
  imageAlt: 'Accessible image description',
  technologies: ['React', 'Node.js'],
  github: 'https://github.com/...',
  demo: 'https://...',
  featured: true,
  overview: 'Case-study overview',
  problem: 'The problem being solved',
  solution: 'How the project solves it',
  features: ['Feature one', 'Feature two'],
  challenges: 'Main implementation challenge',
  learned: 'What the work taught you',
}
```

Set `featured` to `true` to display the project. Empty GitHub and demo strings are handled gracefully and show a private-project note in the details view.

## Replace project screenshots

Place optimized screenshots in `public/images/projects/`. WebP or AVIF is recommended for photographic screenshots; SVG is suitable for illustrations. Update the corresponding `image` and `imageAlt` fields in `src/data/projects.js`.

For consistent cards, use a 16:10 image around 1440 × 900 pixels. Images below the fold are lazy-loaded automatically.

## Replace the CV

Replace `public/resume/Gerald-CV.pdf` with the real PDF while keeping the filename, or update the `resume` value in `src/data/profile.js`.

## Contact-form Gmail delivery

The form sends submissions to `api/contact.js`. The server validates and sanitizes the request, refreshes a Google OAuth access token, and sends an RFC 2822 message to `geraldfuntanar@gmail.com` using the Gmail API. Only visitor addresses ending in `@gmail.com` are accepted by both the browser and server.

### Gmail API setup

1. Create or select a project in Google Cloud Console.
2. Enable the Gmail API.
3. Configure the OAuth consent screen and add `geraldfuntanar@gmail.com` as a test user while setting up.
4. Create an OAuth 2.0 client ID and client secret.
5. Authorize that client for the narrow `https://www.googleapis.com/auth/gmail.send` scope with offline access and obtain a refresh token.
6. Copy `.env.example` to `.env.local` and provide `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN`.
7. Keep `GMAIL_SENDER_EMAIL=geraldfuntanar@gmail.com`; it must match the account that granted the refresh token.

Add the same variables under **Vercel → Project Settings → Environment Variables**, mark the client secret and refresh token as sensitive, and redeploy. Never prefix these values with `VITE_`, because that would expose them to the browser.

For stable production use, move an external OAuth consent app out of Testing status after setup. Google states that refresh tokens for external apps left in Testing normally expire after seven days. Use `npx vercel dev` for local form testing because ordinary `npm run dev` serves only the Vite frontend and does not run the `/api` function.

## SEO configuration

Before deploying, replace `https://your-domain.example` in:

- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`

The title, description, Open Graph image, favicon, theme color, robots file, and sitemap are already configured.

## Deploy to Vercel

1. Push this directory to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel should detect Vite automatically.
4. Confirm the build command is `npm run build`.
5. Confirm the output directory is `dist`.
6. Deploy.

Pushes to the production branch can create production deployments, while other branches receive preview deployments. No token or secret is required in the repository.

## Project structure

```text
portfolio/
├── public/
│   ├── images/projects/      Project artwork and screenshots
│   ├── resume/               Downloadable CV
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/           Reusable page sections and UI
│   ├── data/                 Profile, project, skill, and experience content
│   ├── styles/               Global responsive styling and theme variables
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```
