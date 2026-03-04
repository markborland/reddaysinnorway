# Red Days in Norway

A lightweight static web app that shows upcoming Norwegian public holidays ("red days") with a calendar view.

## Run locally

Because this is a static site, you can open `index.html` directly, but using a local server is recommended:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying to GitHub Pages (recommended)

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that deploys automatically.

### 1) Push to GitHub
Push this repository to GitHub.

### 2) Set default branch to `main`
The workflow deploys on push to `main`. If your default branch is different, update:

- `.github/workflows/deploy-pages.yml` → `on.push.branches`

### 3) Enable Pages in repo settings
In GitHub:

- Go to **Settings → Pages**
- Under **Build and deployment**, choose **Source: GitHub Actions**

### 4) Trigger deploy
- Push a commit to `main` (or run the workflow manually from **Actions**)
- After it finishes, your site is available at:
  - `https://<your-username>.github.io/<repo-name>/` (project site), or
  - your configured custom domain

## Alternative hosting options

Since this is static HTML/CSS/JS, it can also be deployed to:

- Netlify (drag-and-drop or Git integration)
- Vercel (import repo)
- Cloudflare Pages
- Any basic web server / object storage static hosting
