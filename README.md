# Portfolio Website

## About

A static resume and portfolio website for Abhishek Karnam, a Computer Science Engineering student focused on cybersecurity, AI/ML, network security, and software development.

## Features

- Responsive dark professional design
- Sticky navigation and mobile menu
- Smooth scrolling
- Active navigation highlighting
- Scroll progress indicator
- Subtle hero entrance animation
- Lightweight hero network visualization
- Staggered reveal animations
- Interactive project cards
- Accessible project filtering
- Recruiter-friendly project presentation
- Keyboard-visible focus states
- Reduced motion support
- SEO and social sharing metadata

## Tech Stack

- HTML5
- CSS3
- JavaScript

## Project Structure

```text
.
|-- index.html                  # Main page content, SEO metadata, sections, and project data
|-- styles.css                  # Theme, responsive layout, cards, animations, and accessibility styles
|-- script.js                   # Navigation, filtering, reveal animations, progress bar, and hero canvas
|-- Abhishek_Karnam_Resume.pdf  # Resume file linked from CTA buttons
`-- *.jpeg                      # Profile image assets
```

## Local Setup

No build step is required.

Open `index.html` directly in a browser, or run a simple local server from the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Customization

Update these areas in `index.html`:

- Personal introduction: hero heading and supporting text
- Profile highlights: the cards inside `.hero-panel`
- Skills: the categorized `.skill-card` sections
- Education: the timeline items in `#experience`
- Projects: each `.project-card`, including `data-category`, descriptions, tech stack, highlights, and links
- Contact links: email, GitHub, LinkedIn, and resume link
- Profile image: the `<img>` inside `.profile-image-wrap`

Update these areas in `styles.css`:

- Color variables in `:root`
- Spacing and container width variables
- Card, button, and animation styling

Update these areas in `script.js`:

- Project filter behavior if new categories are added
- Hero network node count or motion if you want a stronger or lighter effect

## Deployment

### Vercel

1. Sign in to [Vercel](https://vercel.com).
2. Click **New Project**.
3. Import the GitHub repository.
4. Use the default static-site settings. No build command is required.
5. Deploy.

### GitHub Pages

1. Push this folder to a GitHub repository.
2. Open the repository on GitHub.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/root`, then save.

## Accessibility

This site includes semantic sections, keyboard-visible focus states, accessible navigation labels, `aria-expanded` mobile menu state, accessible project filter buttons, descriptive image alt text, and reduced motion support.

## License

No license file is currently included. Add a `LICENSE` file if you want to define reuse permissions.
