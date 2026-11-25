/**
 * Static site generator for The Louisian
 * Generates HTML files from Astro content without needing the Astro CLI
 * Works around Netlify container permission issues with the astro binary
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('remark-html');
const { format } = require('date-fns');

// ─── CONFIGURATION ───────────────────────────────────────────────────────

const SITE_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(SITE_DIR, 'dist');
const SRC_DIR = path.join(SITE_DIR, 'src');

// Design tokens (matching global.css)
const TOKENS = {
  navy: '#081426',
  navy800: '#0F2342',
  gold: '#FBBF24',
  gold500: '#F59E0B',
  gold700: '#8A6D1F',
  blue200: '#BFDBFE',
  paper: '#FFFDF8',
  ink: '#111827',
  muted: '#4B5563',
  line: '#E5E7EB',
};

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────

function htmlEscape(text) {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

function formatDate(date, formatStr = 'MMMM d, yyyy') {
  return format(new Date(date), formatStr);
}

function uppercaseFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// ─── PAGE TEMPLATES ─────────────────────────────────────────────────────

const createPageHtml = (opts) => {
  const {
    title,
    metaDesc,
    canonical,
    bodyHtml,
    styles,
    scripts,
    isHomepage,
  } = opts;

  const styleBlock = styles
    ? `<style>
${styles}
</style>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en-PH">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${htmlEscape(title)}</title>
    <meta name="description" content="${htmlEscape(metaDesc)}" />
    <link rel="canonical" href="${htmlEscape(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="The Louisian" />
    <meta name="twitter:card" content="summary" />
    ${styleBlock}
    <link rel="stylesheet" href="/global.css" />
  </head>
  <body class="bg-navy-800 text-paper">
    <a href="#main" class="skip-link">Skip to content</a>

    <header class="border-b --line bg-navy-900/80">
      <div class="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img
            src="/brand/crest.svg"
            alt="The Louisian — Home"
            width="48"
            height="48"
            class="hidden sm:block"
          />
          <h1 class="text-2xl font-playfair display:block">The Louisian</h1>
        </div>

        <nav class="hidden sm:block">
          <a href="/news/" class="mr-4 text-[--gold-700] underline">News</a>
          <a href="/feature/" class="mr-4 text-[--gold-700] underline">Feature</a>
          <a href="/sports/" class="mr-4 text-[--gold-700] underline">Sports</a>
          <a href="/sci-tech/" class="mr-4 text-[--gold-700] underline">Sci-Tech</a>
          <a href="/opinion/" class="mr-4 text-[--gold-700] underline">Opinion</a>
          <a href="/cartoon/" class="mr-4 text-[--gold-700] underline">Cartoon</a>
          <a href="/multimedia/" class="mr-4 text-[--gold-700] underline">Multimedia</a>
          <a href="/issues/" class="text-[--gold-700] underline">Issues</a>
        </nav>

        <div class="flex items-center gap-4">
          <a href="/about/" class="text-[--blue-200] hover:text-[--gold-500]">About</a>
          <a href="/board/" class="text-[--blue-200] hover:text-[--gold-500]">Board</a>
          <a href="/contact/" class="text-[--blue-200] hover:text-[--gold-500]">Contact</a>
        </div>
      </div>
    </header>

    <main id="main">
      ${bodyHtml}
    </main>

    <footer class="border-t --line bg-navy-900 py-8">
      <div class="max-w-[1280px] mx-auto px-4">
        <p class="text-[--muted] text-sm">
          &copy; 2026 The Louisian. All rights reserved.
        </p>
      </div>
    </footer>

    <style>
      .skip-link {
        position: absolute;
        left: -1000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        transition: top 0.2s;
      }
      .skip-link:focus {
        left: 0;
        top: 0;
        width: auto;
        height: auto;
        color: var(--navy-800);
        background: var(--paper);
        padding: 8px;
        z-index: 100;
      }
      .prose {
        max-width: 68ch;
        margin-left: auto;
        margin-right: auto;
      }
    </style>
  </body>
</html>`;
};

// ─── CONTENT DATA ────────────────────────────────────────────────────────

// Board data (S.Y. 2026–2027)
const boardData = [
  { order: 1, name: 'Crissa Mae B. Umengan', role: 'Editor-in-Chief', group: 'leadership' },
  { order: 2, name: 'Chester Kyle B. Balingit', role: 'Associate Editor-in-Chief', group: 'leadership' },
  { order: 3, name: 'Prince Jasper M. De Guzman', role: 'Managing Editor', group: 'leadership' },
  { order: 4, name: 'Hannah Sophia L. Foronda', role: 'Circulation Editor', group: 'editors' },
  { order: 5, name: 'Keirsten Hayce P. Aberin', role: 'News Editor', group: 'editors' },
  { order: 6, name: 'Sophia Isabelle A. Dumo', role: 'Feature Editor', group: 'editors' },
  { order: 7, name: 'Princess Rhyel G. Solis', role: 'Sci-Tech Editor', group: 'editors' },
  { order: 8, name: 'Ada Ellesse A. Castillo', role: 'Sports Editor', group: 'editors' },
  { order: 9, name: 'Danielle Mae E. Caccam', role: 'Editorial Writing Editor', group: 'editors' },
  { order: 10, name: 'Alkean J. Dela Peña', role: 'Editorial Cartooning Editor', group: 'editors' },
  { order: 11, name: 'Jhillyane Rayne M. Lorenzo', role: 'Column Editor', group: 'editors' },
  { order: 12, name: 'Frances Elaine M. Olsim', role: 'Copyediting Editor', group: 'editors' },
  { order: 13, name: 'Aurora Consuelo J. Soriano', role: 'Photojournalism Editor', group: 'editors' },
  { order: 14, name: 'Jurimae Nica P. Balaoag', role: 'Broadcasting Editor', group: 'editors' },
  { order: 15, name: 'Justine Faye J. Burgos', role: 'Layout Editor', group: 'editors' },
  { order: 16, name: 'Christof Julian J. De Leon', role: 'Video or Technical Editor', group: 'editors' },
  { order: 17, name: 'Ma. Niza Rodillas', role: 'Publication Adviser', group: 'adviser' },
];

// ─── GENERATE PAGES ─────────────────────────────────────────────────────

async function generateSite() {
  // Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // Copy static assets from public/ to dist/
  const PUBLIC_DIR = path.join(SITE_DIR, 'public');
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });
    console.log('📁 Copied static assets from public/ to dist/');
  }

  // ─── Generate Homepage ──────────────────────────────────────────────
  const homepageHtml = createPageHtml({
    title: 'The Louisian',
    metaDesc: 'The official student publication of Saint Louis University BEdS – Senior High Department',
    canonical: 'https://thelouisian.netlify.app/',
    bodyHtml: `
      <section class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-7">
        <!-- Hero story -->
        <article class="group border rounded --radius overflow-hidden">
          <img
            src="/brand/hero-placeholder.jpg"
            alt="Hero story image"
            class="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
          />
          <div class="p-4">
            <p class="uppercase text-[--gold-500] text-sm tracking-wider">News</p>
            <h2 class="text-xl font-playfair mt-2 group-hover:text-[--gold-400] transition-colors">SLU BEdS opens new senior high annex</h2>
            <p class="text-[--muted] text-sm mt-1">November 20, 2026</p>
          </div>
        </article>

        <!-- Secondary leads -->
        <article class="group border rounded --radius overflow-hidden sm:col-span-2 lg:col-span-5 p-4">
          <img
            src="/brand/lead-placeholder.jpg"
            alt="Lead story image"
            class="w-full h-24 object-cover group-hover:opacity-90 transition-opacity mb-3"
          />
          <p class="uppercase text-[--gold-500] text-sm tracking-wider">Feature</p>
          <h3 class="font-playfair text-base mt-1 group-hover:text-[--gold-400] transition-colors">Inside the first Louisian podcast recording</h3>
          <p class="text-[--muted] text-xs mt-1">November 22, 2026</p>
        </article>

        <article class="group border rounded --radius overflow-hidden sm:col-span-2 lg:col-span-5 p-4">
          <img
            src="/brand/lead-placeholder.jpg"
            alt="Lead story image"
            class="w-full h-24 object-cover group-hover:opacity-90 transition-opacity mb-3"
          />
          <p class="uppercase text-[--gold-500] text-sm tracking-wider">Sports</p>
          <h3 class="font-playfair text-base mt-1 group-hover:text-[--gold-400] transition-colors">Senior high intramurals 2026</h3>
          <p class="text-[--muted] text-xs mt-1">November 18, 2026</p>
        </article>
      </section>

      <!-- Latest news rail -->
      <section class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <article class="border rounded --radius p-4 bg-paper">
          <p class="uppercase text-[--gold-500] text-sm tracking-wider">News</p>
          <h3 class="font-playfair text-base mt-1">SLU BEdS opens new annex</h3>
          <p class="text-[--muted] text-sm">New 18-classroom annex opens November 20.</p>
        </article>

        <article class="border rounded --radius p-4 bg-paper">
          <p class="uppercase text-[--gold-500] text-sm tracking-wider">Feature</p>
          <h3 class="font-playfair text-base mt-1">Podcast pilot</h3>
          <p class="text-[--muted] text-sm">First recording in the JVB media lab.</p>
        </article>

        <article class="border rounded --radius p-4 bg-paper">
          <p class="uppercase text-[--gold-500] text-sm tracking-wider">Sci-Tech</p>
          <h3 class="font-playfair text-base mt-1">Tech tips for students</h3>
          <p class="text-[--muted] text-sm">Productivity tools for senior high.</p>
        </article>
      </section>

      <!-- Current issue card -->
      <section class="mt-8 p-4 bg-paper rounded --radius">
        <p class="uppercase text-[--gold-500] text-sm tracking-wider">Current Issue</p>
        <h3 class="font-playfair text-lg mt-1">Volume 04, No. 1, S.Y. 2026–2027</h3>
        <p class="text-[--muted] text-sm">The facilities issue: new annex, library renovation, cost of staying cool.</p>
        <a
          href="/issues/vol-04-issue-01/"
          class="mt-2 inline-block text-[--gold-700] underline"
          >Read the issue
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="/issues/vol-04-issue-01/pdf/"
          class="mt-2 inline-block ml-2 text-[--gold-400] underline"
          >Download PDF
        </a>
      </section>

      <!-- Newsletter band -->
      <section class="mt-12">
        <h3 class="font-playfair text-lg mb-2">Get The Louisian in your inbox.</h3>
        <p class="text-[--muted] text-sm mb-4">New issues and top stories. No spam.</p>
        <form
          action="https://buttondown.com/api/emails/embed-subscribe/thelouisianprototype"
          method="post"
          class="max-w-md"
          style="display: flex; gap: 8px;"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            required
            style="flex: 1; padding: 8px; border: 1px solid var(--ink); border-radius: var(--radius);"
          />
          <button
            type="submit"
            style="padding: 8px 16px; background: var(--gold-400); color: var(--navy-800); border: none; border-radius: var(--radius); font-weight: 700;"
          >
            Subscribe
          </button>
        </form>
        <p class="text-[--muted] text-xs mt-4">
          We respect your privacy. <a href="/contact/#privacy" style="color: var(--gold-400);">View our privacy policy.</a>
        </p>
      </section>
    `,
    styles: `.skip-link { position: absolute; left: -1000px; top: auto; width: 1px; height: 1px; overflow: hidden; transition: top 0.2s; } .skip-link:focus { left: 0; top: 0; width: auto; height: auto; color: var(--navy-800); background: var(--paper); padding: 8px; z-index: 100; } .prose { max-width: 68ch; margin-left: auto; margin-right: auto; }`,

    scripts: '',
    isHomepage: true,
  });

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homepageHtml);
  console.log('✅ Generated index.html');

  // ─── Generate About page ────────────────────────────────────────────
  let aboutBody = `
    <article class="prose lg:prose-lg">
      <h1 id="main">About The Louisian</h1>

      <h2 class="font-playfair text-[--gold-400] mt-8">Mission</h2>
      <p>
        The Louisian is the official student publication of Saint Louis University
        BEdS – Senior High Department. We are students writing for students,
        covering campus life, administration, arts, sports, and everything in
        between.
      </p>

      <h2 class="font-playfair text-[--gold-400] mt-8" id="standards">How we work</h2>
      <ul class="list-disc pl-6 space-y-2 text-[--muted]">
        <li>Human-written articles only. No AI-generated text or AI-altered news images.</li>
        <li>Our photos are taken by Louisian photojournalists. Every image is credited.</li>
        <li>We correct major factual errors publicly, with a dated note.</li>
        <li>Identifiable photos of students require consent (see Photo Consent policy on Contact).</li>
        <li>Editorial decisions are made by the student board. The adviser reviews sensitive material for safety and legal risk, not to dictate position.</li>
      </ul>

      <h2 class="font-playfair text-[--gold-400] mt-8">Contact</h2>
      <p>Official email: <a href="mailto:13007796@slu.edu.ph">13007796@slu.edu.ph</a></p>
      <p>Send a tip, a letter to the editor, a correction/privacy request, or join the staff via the <a href="/contact/">Contact</a> page.</p>

      <h2 class="font-playfair text-[--gold-400] mt-8">Board (S.Y. 2026–2027)</h2>
      <ol class="list-decimal pl-6 space-y-1 text-[--muted]">
`;

  let boardHtml = '';
  boardData.forEach((member) => {
    boardHtml += `<li>${member.name} — ${member.role}</li>\n`;
  });
  aboutBody += boardHtml;

  aboutBody += `</ol></article>`;

  const aboutHtml = createPageHtml({
    title: 'About The Louisian',
    metaDesc: 'The official student publication of Saint Louis University BEdS – Senior High Department',
    canonical: 'https://thelouisian.netlify.app/about/',
    bodyHtml: aboutBody,
    styles: `.prose { max-width: 68ch; margin-left: auto; margin-right: auto; } .prose h1, .prose h2, .prose h3 { font-family: "Playfair Display", Georgia, "Times New Roman", serif; }`,
    isHomepage: false,
  });

  fs.writeFileSync(path.join(DIST_DIR, 'about.html'), aboutHtml);
  console.log('✅ Generated about.html');

  // ─── Generate Board page ────────────────────────────────────────────
  const boardBody = `
    <article class="prose lg:prose-lg">
      <h1 id="main">Editorial Board</h1>
      <p class="text-[--muted] text-lg mb-8">S.Y. 2026–2027</p>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        <div>
          <h3 class="font-playfair text-[--gold-400] mb-3">Leadership</h3>
          <ol class="list-decimal pl-3 text-[--muted]">
            <li>Crissa Mae B. Umengan — Editor-in-Chief</li>
            <li>Chester Kyle B. Balingit — Associate Editor-in-Chief</li>
            <li>Prince Jasper M. De Guzman — Managing Editor</li>
          </ol>
        </div>
        <div>
          <h3 class="font-playfair text-[--gold-400] mb-3">Editors</h3>
          <ol class="list-decimal pl-3 text-[--muted]">
            <li>Hannah Sophia L. Foronda — Circulation Editor</li>
            <li>Keirsten Hayce P. Aberin — News Editor</li>
            <li>Sophia Isabelle A. Dumo — Feature Editor</li>
            <li>Princess Rhyel G. Solis — Sci-Tech Editor</li>
            <li>Ada Ellesse A. Castillo — Sports Editor</li>
            <li>Danielle Mae E. Caccam — Editorial Writing Editor</li>
            <li>Alkean J. Dela Peña — Editorial Cartooning Editor</li>
            <li>Jhillyane Rayne M. Lorenzo — Column Editor</li>
            <li>Frances Elaine M. Olsim — Copyediting Editor</li>
            <li>Aurora Consuelo J. Soriano — Photojournalism Editor</li>
            <li>Jurimae Nica P. Balaoag — Broadcasting Editor</li>
            <li>Justine Faye J. Burgos — Layout Editor</li>
            <li>Christof Julian J. De Leon — Video or Technical Editor</li>
          </ol>
        </div>
        <div>
          <h3 class="font-playfair text-[--gold-400] mb-3">Adviser</h3>
          <p class="text-[--muted]">Ma. Niza Rodillas</p>
        </div>
      </div>
    </article>
`;

  boardHtml = createPageHtml({
    title: 'Editorial Board',
    metaDesc: 'The official student publication of Saint Louis University BEdS – Senior High Department',
    canonical: 'https://thelouisian.netlify.app/board/',
    bodyHtml: boardBody,
    styles: `.prose { max-width: 68ch; margin-left: auto; margin-right: auto; }`,
    isHomepage: false,
  });

  fs.writeFileSync(path.join(DIST_DIR, 'board.html'), boardHtml);
  console.log('✅ Generated board.html');

  // ─── Generate Contact page ──────────────────────────────────────────
  const contactBody = `
    <article class="prose lg:prose-lg">
      <h1 id="main">Contact The Louisian</h1>

      <p class="text-[--muted] text-lg mb-8">
        Send a tip, a letter to the editor, a correction/privacy request, or join
        the staff.
      </p>

      <form
        action="https://netlify.com/forms/contact"
        method="POST"
        class="space-y-4 max-w-md"
        style="display: flex; flex-direction: column; gap: 12px;"
      >
        <input type="hidden" name="formName" value="contact" />
        <input
          type="text"
          name="name"
          placeholder="Your name (optional)"
          style="padding: 8px; border: 1px var(--ink); border-radius: var(--radius);"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email (optional)"
          style="padding: 8px; border: 1px var(--ink); border-radius: var(--radius);"
        />
        <select
          name="purpose"
          style="padding: 8px; border: 1px var(--ink); border-radius: var(--radius);"
        >
          <option value="tip">Tip</option>
          <option value="letter">Letter to the Editor</option>
          <option value="correction">Correction/Privacy Request</option>
          <option value="join">Join the Staff</option>
          <option value="other">Other</option>
        </select>
        <textarea
          name="message"
          rows="4"
          placeholder="Your message (20–5,000 characters)"
          style="padding: 8px; border: 1px var(--ink); border-radius: var(--radius);"
        ></textarea>
        <div class="flex items-start">
          <input
            type="checkbox"
            name="consent"
            required
            style="margin-top: 4px; width: 18px; height: 18px; cursor: pointer;"
          />
          <span
            style="
              margin-left: 8px;
              cursor: pointer;
              text-[--muted];
              font-size: 0.875rem;
            "
          >
            I have read the <a href="#privacy" style="color: var(--gold-400);">privacy note</a>
            below.
          </span>
        </div>
        <button
          type="submit"
          style="
            padding: 10px;
            background: var(--gold-400);
            color: var(--navy-800);
            border: none;
            border-radius: var(--radius);
            font-weight: 700;
          "
        >
          Send to The Louisian
        </button>
      </form>

      <hr class="my-8 border-t --line" />

      <h2 id="privacy" class="font-playfair text-[--gold-400] mb-3">Privacy note</h2>
      <div class="prose lg:prose-lg text-[--muted]">
        <p>
          What we collect: If you use the contact form, we receive the name and
          email you choose to provide, plus your message. If you subscribe to the
          newsletter, Buttondown stores your email. We use Cloudflare Web
          Analytics for aggregate page counts; it does not use cookies or collect
          personal data.
        </p>
        <p>
          Who sees it: The editorial board and adviser. We do not publish your
          contact details or sell them.
        </p>
        <p>
          How long: Form submissions are kept for up to 12 months, then deleted.
          Newsletter emails stay until you unsubscribe.
        </p>
        <p>
          Removal: Email <a href="mailto:13007796@slu.edu.ph">13007796@slu.edu.ph</a>
          or use the contact form with "Correction/Privacy Request" to ask for
          deletion. We respond within 5 school days.
        </p>
        <p>
          Third parties: Netlify (forms and hosting), Buttondown (newsletter),
          Cloudflare (analytics). HeyZine, YouTube, and Facebook embeds load only
          after you click them, and their privacy policies apply once loaded.
        </p>
      </div>
    </article>
`;

  const contactHtml = createPageHtml({
    title: 'Contact The Louisian',
    metaDesc: 'The official student publication of Saint Louis University BEdS – Senior High Department',
    canonical: 'https://thelouisian.netlify.app/contact/',
    bodyHtml: contactBody,
    styles: `.prose { max-width: 68ch; margin-left: auto; margin-right: auto; }`,
    isHomepage: false,
  });

  fs.writeFileSync(path.join(DIST_DIR, 'contact.html'), contactHtml);
  console.log('✅ Generated contact.html');

  console.log('\n📦 Site generation complete!');
  console.log('Dist folder:', DIST_DIR);
  console.log('\nGenerated files:');
  fs.readdirSync(DIST_DIR).forEach((f) => console.log(`  - ${f}`));
}

generateSite().catch((err) => {
  console.error('❌ Site generation failed:', err);
  process.exit(1);
});