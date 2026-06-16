# Deploying this resume site to Vercel

This repository is a static site (files: `index.html`, `styles.css`, `script.js`). Two easy ways to host on Vercel:

1) Deploy via Vercel Dashboard (recommended)

- Go to https://vercel.com and sign in or create an account.
- Click **New Project** → **Import Git Repository** and authorize GitHub (or GitLab/Bitbucket).
- Select this repository from your account.
- For a plain static site: set Framework Preset to "Other" (or leave blank). No build command is required.
- Set the Root Directory to the repository root (default) and leave the Output Directory empty.
- Click **Deploy**. Vercel will build (no-op for static) and publish; the generated URL appears in the dashboard.

2) Drag-and-drop (manual upload)

- In the Vercel dashboard, click **New Project** → **Deploy** and choose **Drag & Drop** (or go to https://vercel.com/import/clone and use the upload option).
- Zip your site files or select the folder, then drop them into the browser. Vercel will upload and publish.

3) (Optional) CLI deploy

If you prefer the command line, install the Vercel CLI and run from this project folder:

```bash
npm install -g vercel
vercel        # follow prompts
vercel --prod # publish to production
```

Notes:
- No environment variables are needed for a static resume site.
- To enable continuous deployment, connect the repository in the dashboard so Vercel deploys on every push.
- To add a custom domain, open the project settings in the Vercel dashboard and follow the DNS instructions.

---

If you want, I can:
- connect this repo to Vercel from your account (you'll need to authorize GitHub),
- or run the CLI deploy interactively from your terminal.
# Resume Website

A static resume portfolio for GitHub Pages.

## Edit your details

Update `index.html` with your real summary, email, education, experience, projects, GitHub, LinkedIn, and resume PDF link.

## Host on GitHub Pages

1. Push this folder to a GitHub repository.
2. Open the repository on GitHub.
3. Go to Settings > Pages.
4. Under Build and deployment, choose Deploy from a branch.
5. Select the `main` branch and `/root`, then save.

Your site will be published at the URL GitHub shows in the Pages settings.
