# Lakshya Portfolio (React + Tailwind CSS + Vite)

Animated developer portfolio. Sections: Home (request-flow hero), Projects (animated workflow for each project), Bugs that taught me something, About, Contact.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Production build
```bash
npm run build      # output goes to dist/
npm run preview
```

## Deploy (free)
- **Vercel**: push this folder to GitHub, then Import Project on vercel.com. Framework: Vite. Build command `npm run build`, output `dist`.
- **Netlify**: same steps, or drag and drop the `dist/` folder after `npm run build`.
- **GitHub Pages**: build, then publish the `dist/` folder.

## What to edit
- Email, phone, LinkedIn, GitHub, resume link: `CONFIG` at the top of `src/App.jsx`
  (leave `resume` empty to hide the Resume button, or paste your Drive/PDF link)
- Projects and their workflow steps: `PROJECTS` in `src/App.jsx`
- Bugs list: `BUGS` in `src/App.jsx`
- Photo: replace `src/assets/lakshya.jpg`
- Colors and animations: `src/index.css` (colour tokens are at the top, in `:root`)
- Theme: toggle with the sun/moon button in the nav (choice is saved to localStorage)
- Contact form: fill in the form in the Contact section — sends email automatically via EmailJS (see below) or opens your email app

### EmailJS Setup (free, 200 emails/month)
To make the contact form send emails automatically:
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Add your Gmail as a service
3. Create a template with variables: `{{name}}`, `{{email}}`, `{{title}}`, `{{message}}`
4. In `src/App.jsx`, find the `EMAILJS` object and replace the placeholder values:
   - `serviceId`: your EmailJS service ID
   - `templateId`: your EmailJS template ID
   - `publicKey`: your EmailJS public key
5. Reload the site — emails will now send automatically

## Files
- `src/App.jsx` : all components and data
- `src/index.css` : Tailwind + custom animations (aurora, marquee, workflow, etc.)
- `standalone/portfolio-standalone.html` : single-file version of the same site (open directly in a browser)

Built with AI (Claude) for the InAmigos Foundation, Task 3.
