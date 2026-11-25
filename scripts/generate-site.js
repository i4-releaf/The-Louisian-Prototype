/**
 * Static site generator for The Louisian
 * Magazine-style layout with real content
 */

const fs = require('fs');
const path = require('path');
const { boardData, articles, issues, tags } = require('./content-data');

const SITE_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(SITE_DIR, 'dist');

function htmlEscape(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const createPageHtml = (opts) => {
  const { title, metaDesc, canonical, bodyHtml, styles } = opts;
  const styleBlock = styles ? `<style>\n${styles}\n</style>` : '';

  return `<!DOCTYPE html>
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

    <header class="border-b line bg-navy-900">
      <div class="container header-inner">
        <div class="masthead">
          <img src="/brand/crest.svg" alt="The Louisian crest" width="40" height="40" class="crest" />
          <h1>The Louisian</h1>
        </div>
        <nav class="nav-section">
          <a href="/news/">News</a>
          <a href="/feature/">Feature</a>
          <a href="/sports/">Sports</a>
          <a href="/sci-tech/">Sci-Tech</a>
          <a href="/opinion/">Opinion</a>
          <a href="/cartoon/">Cartoon</a>
          <a href="/multimedia/">Multimedia</a>
          <a href="/issues/">Issues</a>
        </nav>
        <div class="meta-section">
          <a href="/about/">About</a>
          <a href="/board/">Board</a>
          <a href="/contact/">Contact</a>
        </div>
      </div>
    </header>

    <main id="main">
      ${bodyHtml}
    </main>

    <footer class="border-t line bg-navy-900 py-8">
      <div class="container footer-inner">
        <p>&copy; 2026 The Louisian. All rights reserved.</p>
      </div>
    </footer>

    <style>
      .skip-link { position: absolute; left: -1000px; top: auto; width: 1px; height: 1px; overflow: hidden; transition: top 0.2s; }
      .skip-link:focus { left: 0; top: 0; width: auto; height: auto; color: var(--navy-800); background: var(--paper); padding: 8px; z-index: 100; }
      .prose { max-width: 68ch; margin-left: auto; margin-right: auto; }
    </style>
  </body>
</html>`;
};

async function generateSite() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const PUBLIC_DIR = path.join(SITE_DIR, 'public');
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });
    console.log('📁 Copied static assets from public/ to dist/');
  }

  // ─── Generate Homepage ──────────────────────────────────────────────
  const hero = articles[0];
  const leads = articles.slice(1, 3);
  const rail = articles.slice(3);

  const heroHtml = `
    <div class="hero">
      <img src="${hero.image}" alt="${htmlEscape(hero.title)}" class="hero-image" />
      <div class="hero-body">
        <span class="hero-category">${hero.section}</span>
        <h2 class="hero-title"><a href="/${hero.section.toLowerCase()}/${hero.slug}/">${hero.title}</a></h2>
        <span class="hero-date">${formatDate(hero.date)}</span>
      </div>
    </div>
  `;

  const leadsHtml = leads.map(a => `
    <div class="card">
      <img src="${a.image}" alt="${htmlEscape(a.title)}" class="card-image" />
      <div class="card-body">
        <span class="card-category">${a.section}</span>
        <h3 class="card-title"><a href="/${a.section.toLowerCase()}/${a.slug}/">${a.title}</a></h3>
        <span class="card-date">${formatDate(a.date)}</span>
      </div>
    </div>
  `).join('');

  const railHtml = rail.map(a => `
    <div class="card">
      <div class="card-body" style="padding: 0.75rem 1rem;">
        <span class="card-category">${a.section}</span>
        <h3 class="card-title" style="font-size: 1rem;"><a href="/${a.section.toLowerCase()}/${a.slug}/">${a.title}</a></h3>
        <span class="card-date">${formatDate(a.date)}</span>
      </div>
    </div>
  `).join('');

  const currentIssue = issues[0];
  const issueCardHtml = `
    <div class="issue-card">
      <img src="/brand/issue-placeholder.svg" alt="${currentIssue.title}" class="issue-image" />
      <div class="issue-body">
        <span class="hero-category">Current Issue</span>
        <h2 class="issue-title"><a href="/issues/${currentIssue.slug}/">${currentIssue.volume} ${currentIssue.number}, ${currentIssue.sy}</a></h2>
        <p class="issue-subtitle">${currentIssue.description}</p>
        <a href="/issues/${currentIssue.slug}/" class="btn btn--gold" style="margin-right: 0.5rem;">Read the issue</a>
        <a href="${currentIssue.pdf}" class="btn btn--navy">Download PDF</a>
      </div>
    </div>
  `;

  const newsletterHtml = `
    <div class="newsletter-band">
      <h3>Get The Louisian in your inbox.</h3>
      <p>New issues and top stories. No spam.</p>
      <form action="https://buttondown.com/api/emails/embed-subscribe/thelouisianprototype" method="post" style="display: flex; gap: 8px; max-width: 400px; margin: 1.5rem auto 0;">
        <input type="email" name="email" placeholder="Enter email" required style="flex: 1; padding: 0.5rem; border: 1px solid var(--ink); border-radius: var(--radius);" />
        <button type="submit" style="padding: 0.5rem 1rem; background: var(--gold-400); color: var(--navy-800); border: none; border-radius: var(--radius); font-weight: 700; cursor: pointer;">Subscribe</button>
      </form>
      <p style="font-size: 0.75rem; color: var(--blue-200); margin-top: 1rem;">
        We respect your privacy. <a href="/contact/#privacy" style="color: var(--gold-400);">View our privacy policy.</a>
      </p>
    </div>
  `;

  const homepageBody = `
    <div class="container">
      ${heroHtml}
      <div class="section-grid">${leadsHtml}</div>
      <div class="section-header">
        <h2 class="section-title">Latest Stories</h2>
        <a href="/news/" class="section-link">View all →</a>
      </div>
      <div class="section-grid" style="grid-template-columns: repeat(3, 1fr);">${railHtml}</div>
      ${issueCardHtml}
      ${newsletterHtml}
    </div>
  `;

  const homepageHtml = createPageHtml({
    title: 'The Louisian',
    metaDesc: 'The official student publication of Saint Louis University BEdS – Senior High Department',
    canonical: 'https://thelouisianprototype.netlify.app/',
    bodyHtml: homepageBody,
  });
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homepageHtml);
  console.log('✅ Generated index.html');

  // ─── Generate Section Pages ─────────────────────────────────────────
  const sections = ['news', 'feature', 'sports', 'sci-tech', 'opinion', 'cartoon', 'multimedia'];
  sections.forEach(section => {
    const sectionArticles = articles.filter(a => a.section.toLowerCase() === section);
    const articlesHtml = sectionArticles.map(a => `
      <article class="card">
        <img src="${a.image}" alt="${htmlEscape(a.title)}" class="card-image" />
        <div class="card-body">
          <span class="card-category">${a.section}</span>
          <h2 class="card-title" style="font-size: 1.25rem;"><a href="/${section}/${a.slug}/">${a.title}</a></h2>
          <p class="card-date">${formatDate(a.date)} — by ${a.author}</p>
        </div>
      </article>
    `).join('');

    const sectionBody = `
      <div class="container">
        <div class="section-header">
          <h1 id="main">${section.charAt(0).toUpperCase() + section.slice(1)}</h1>
        </div>
        <div class="two-col">${articlesHtml}</div>
      </div>
    `;

    const sectionHtml = createPageHtml({
      title: `${section.charAt(0).toUpperCase() + section.slice(1)} — The Louisian`,
      metaDesc: `${section} stories from The Louisian student publication`,
      canonical: `https://thelouisianprototype.netlify.app/${section}/`,
      bodyHtml: sectionBody,
    });
    const sectionDir = path.join(DIST_DIR, section);
    fs.mkdirSync(sectionDir, { recursive: true });
    fs.writeFileSync(path.join(sectionDir, 'index.html'), sectionHtml);
    console.log(`✅ Generated ${section}/index.html`);

    // Generate individual article pages
    sectionArticles.forEach(a => {
      const articleBody = `
        <div class="container">
          <div class="article-hero">
            <img src="${a.image}" alt="${htmlEscape(a.title)}" class="article-image" />
          </div>
          <div class="article-meta">
            <span class="article-category">${a.section}</span>
            <h1 class="article-title">${a.title}</h1>
            <div class="article-byline">By ${a.author} · ${formatDate(a.date)}</div>
          </div>
          <div class="article-content prose">
            <p>${a.body}</p>
          </div>
          <p style="margin-top: 2rem;">
            <a href="/${section}/" style="color: var(--gold-400);">← Back to ${section}</a>
          </p>
        </div>
      `;

      const articleHtml = createPageHtml({
        title: `${a.title} — The Louisian`,
        metaDesc: a.excerpt,
        canonical: `https://thelouisianprototype.netlify.app/${section}/${a.slug}/`,
        bodyHtml: articleBody,
      });
      fs.writeFileSync(path.join(sectionDir, `${a.slug}.html`), articleHtml);
      console.log(`✅ Generated ${section}/${a.slug}.html`);
    });
  });

  // ─── Generate Issues Page ───────────────────────────────────────────
  const issuesHtml = issues.map(issue => `
    <div class="card issue-card" style="text-align: left;">
      <img src="/brand/issue-placeholder.svg" alt="${issue.title}" class="issue-image" />
      <div class="card-body" style="padding: 1.25rem;">
        <span class="hero-category">Issue</span>
        <h2 class="card-title" style="font-size: 1.5rem;"><a href="/issues/${issue.slug}/">${issue.volume} ${issue.number}, ${issue.sy}</a></h2>
        <p class="card-date">${issue.date}</p>
        <p style="color: var(--muted); margin-bottom: 1rem;">${issue.description}</p>
        <a href="${issue.heyzine}" class="btn btn--gold" style="margin-right: 0.5rem;">Read on HeyZine</a>
        <a href="${issue.pdf}" class="btn btn--navy">Download PDF</a>
      </div>
    </div>
  `).join('');

  const issuesBody = `
    <div class="container">
      <h1 id="main" style="font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 1rem;">Issues Archive</h1>
      <div class="issues-grid">${issuesHtml}</div>
    </div>
  `;

  const issuesHtmlPage = createPageHtml({
    title: 'Issues — The Louisian',
    metaDesc: 'Read past issues of The Louisian student publication',
    canonical: 'https://thelouisianprototype.netlify.app/issues/',
    bodyHtml: issuesBody,
  });
  const issuesDir = path.join(DIST_DIR, 'issues');
  fs.mkdirSync(issuesDir, { recursive: true });
  fs.writeFileSync(path.join(issuesDir, 'index.html'), issuesHtmlPage);
  console.log('✅ Generated issues/index.html');

  // Issue detail page
  const issue = issues[0];
  const issueDetailBody = `
    <div class="container">
      <div class="article-hero">
        <img src="/brand/issue-placeholder.svg" alt="${issue.title}" class="article-image" />
      </div>
      <div class="article-meta">
        <span class="article-category">Issue</span>
        <h1 class="article-title">${issue.volume} ${issue.number}, ${issue.sy}</h1>
        <div class="article-byline">${issue.date} · ${issue.title}</div>
      </div>
      <div class="article-content prose">
        <p>${issue.description}</p>
        <p style="margin-top: 2rem;">
          <a href="${issue.heyzine}" class="btn btn--gold" style="margin-right: 0.5rem;">Read on HeyZine</a>
          <a href="${issue.pdf}" class="btn btn--navy">Download PDF</a>
        </p>
      </div>
      <p style="margin-top: 2rem;">
        <a href="/issues/" style="color: var(--gold-400);">← Back to Issues</a>
      </p>
    </div>
  `;

  const issueDetailHtml = createPageHtml({
    title: `${issue.volume} ${issue.number} — The Louisian`,
    metaDesc: issue.description,
    canonical: `https://thelouisianprototype.netlify.app/issues/${issue.slug}/`,
    bodyHtml: issueDetailBody,
  });
  fs.writeFileSync(path.join(issuesDir, `${issue.slug}.html`), issueDetailHtml);
  console.log(`✅ Generated issues/${issue.slug}.html`);

  // PDF redirect page
  const pdfBody = `
    <div class="container prose" style="max-width: 68ch; margin: 3rem auto;">
      <h1>Download PDF</h1>
      <p>Redirecting to the HeyZine PDF viewer...</p>
      <p>If you are not redirected, <a href="${issue.heyzine}" style="color: var(--gold-400);">click here</a>.</p>
    </div>
    <script>window.location.href = '${issue.heyzine}';</script>
  `;

  const pdfHtml = createPageHtml({
    title: 'Download PDF — The Louisian',
    metaDesc: 'Download the current issue PDF',
    canonical: `https://thelouisianprototype.netlify.app/issues/${issue.slug}/pdf/`,
    bodyHtml: pdfBody,
  });
  fs.writeFileSync(path.join(issuesDir, `${issue.slug}-pdf.html`), pdfHtml);
  console.log(`✅ Generated issues/${issue.slug}-pdf.html`);

  // ─── Generate About Page ──────────────────────────────────────────────
  const aboutBody = `
    <div class="container prose">
      <h1 id="main">About The Louisian</h1>

      <h2 style="font-family: var(--font-display); color: var(--gold-400);">Mission</h2>
      <p>The Louisian is the official student publication of Saint Louis University BEdS – Senior High Department. We are students writing for students, covering campus life, administration, arts, sports, and everything in between.</p>

      <h2 style="font-family: var(--font-display); color: var(--gold-400);">How we work</h2>
      <ul style="list-style: disc inside; color: var(--muted); line-height: 1.8;">
        <li>Human-written articles only. No AI-generated text or AI-altered news images.</li>
        <li>Our photos are taken by Louisian photojournalists. Every image is credited.</li>
        <li>We correct major factual errors publicly, with a dated note.</li>
        <li>Identifiable photos of students require consent (see Photo Consent policy on Contact).</li>
        <li>Editorial decisions are made by the student board. The adviser reviews sensitive material for safety and legal risk, not to dictate position.</li>
      </ul>

      <h2 style="font-family: var(--font-display); color: var(--gold-400);">Contact</h2>
      <p>Official email: <a href="mailto:13007796@slu.edu.ph">13007796@slu.edu.ph</a></p>
      <p>Send a tip, a letter to the editor, a correction/privacy request, or join the staff via the <a href="/contact/">Contact</a> page.</p>

      <h2 style="font-family: var(--font-display); color: var(--gold-400);">Board (S.Y. 2026–2027)</h2>
      <ol style="list-style: decimal inside; color: var(--muted); line-height: 1.8;">
        ${boardData.map(m => `<li><strong>${m.name}</strong> — ${m.role}</li>`).join('')}
      </ol>
    </div>
  `;

  const aboutHtml = createPageHtml({
    title: 'About The Louisian',
    metaDesc: 'About The Louisian student publication — mission, standards, and editorial board',
    canonical: 'https://thelouisianprototype.netlify.app/about/',
    bodyHtml: aboutBody,
  });
  fs.writeFileSync(path.join(DIST_DIR, 'about.html'), aboutHtml);
  console.log('✅ Generated about.html');

  // ─── Generate Board Page ────────────────────────────────────────────
  const leadership = boardData.filter(m => m.group === 'leadership');
  const editors = boardData.filter(m => m.group === 'editors');
  const adviser = boardData.find(m => m.group === 'adviser');

  const boardBody = `
    <div class="container prose">
      <h1 id="main">Editorial Board</h1>
      <p style="color: var(--muted); font-size: 1.125rem;">S.Y. 2026–2027</p>

      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
        <div>
          <h2 style="font-family: var(--font-display); color: var(--gold-400);">Leadership</h2>
          <ol style="list-style: decimal inside; color: var(--muted); line-height: 1.8;">
            ${leadership.map(m => `<li><strong>${m.name}</strong> — ${m.role}</li>`).join('')}
          </ol>
        </div>
        <div>
          <h2 style="font-family: var(--font-display); color: var(--gold-400);">Editors</h2>
          <ol style="list-style: decimal inside; color: var(--muted); line-height: 1.8;">
            ${editors.map(m => `<li><strong>${m.name}</strong> — ${m.role}</li>`).join('')}
          </ol>
        </div>
        <div>
          <h2 style="font-family: var(--font-display); color: var(--gold-400);">Adviser</h2>
          <p style="color: var(--muted);"><strong>${adviser.name}</strong> — ${adviser.role}</p>
        </div>
      </div>
    </div>
  `;

  const boardHtml = createPageHtml({
    title: 'Editorial Board — The Louisian',
    metaDesc: 'The Louisian editorial board S.Y. 2026–2027',
    canonical: 'https://thelouisianprototype.netlify.app/board/',
    bodyHtml: boardBody,
  });
  fs.writeFileSync(path.join(DIST_DIR, 'board.html'), boardHtml);
  console.log('✅ Generated board.html');

  // ─── Generate Contact Page ──────────────────────────────────────────
  const contactBody = `
    <div class="container prose">
      <h1 id="main">Contact The Louisian</h1>

      <p style="color: var(--muted); font-size: 1.125rem;">
        Send a tip, a letter to the editor, a correction/privacy request, or join the staff.
      </p>

      <form action="https://netlify.com/forms/contact" method="POST" style="display: flex; flex-direction: column; gap: 1rem; max-width: 500px;">
        <input type="hidden" name="formName" value="contact" />
        <input type="text" name="name" placeholder="Your name (optional)" style="padding: 0.5rem; border: 1px solid var(--ink); border-radius: var(--radius); font-family: inherit;" />
        <input type="email" name="email" placeholder="Your email (optional)" style="padding: 0.5rem; border: 1px solid var(--ink); border-radius: var(--radius); font-family: inherit;" />
        <select name="purpose" style="padding: 0.5rem; border: 1px solid var(--ink); border-radius: var(--radius); font-family: inherit;">
          <option value="tip">Tip</option>
          <option value="letter">Letter to the Editor</option>
          <option value="correction">Correction/Privacy Request</option>
          <option value="join">Join the Staff</option>
          <option value="other">Other</option>
        </select>
        <textarea name="message" rows="4" placeholder="Your message" style="padding: 0.5rem; border: 1px solid var(--ink); border-radius: var(--radius); font-family: inherit;"></textarea>
        <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
          <input type="checkbox" name="consent" required style="width: 18px; height: 18px; margin-top: 0.1rem;" />
          <label style="font-size: 0.875rem; color: var(--muted); cursor: pointer;">
            I have read the <a href="#privacy" style="color: var(--gold-400);">privacy note</a> below.
          </label>
        </div>
        <button type="submit" style="padding: 0.75rem 1.5rem; background: var(--gold-400); color: var(--navy-800); border: none; border-radius: var(--radius); font-weight: 700; cursor: pointer; font-family: inherit;">
          Send to The Louisian
        </button>
      </form>

      <hr style="border: 0; border-top: 1px solid var(--line); margin: 2rem 0;" />

      <h2 id="privacy" style="font-family: var(--font-display); color: var(--gold-400);">Privacy note</h2>
      <div style="color: var(--muted); line-height: 1.8;">
        <p><strong>What we collect:</strong> If you use the contact form, we receive the name and email you choose to provide, plus your message. If you subscribe to the newsletter, Buttondown stores your email. We use Cloudflare Web Analytics for aggregate page counts; it does not use cookies or collect personal data.</p>
        <p><strong>Who sees it:</strong> The editorial board and adviser. We do not publish your contact details or sell them.</p>
        <p><strong>How long:</strong> Form submissions are kept for up to 12 months, then deleted. Newsletter emails stay until you unsubscribe.</p>
        <p><strong>Removal:</strong> Email <a href="mailto:13007796@slu.edu.ph">13007796@slu.edu.ph</a> or use the contact form with "Correction/Privacy Request" to ask for deletion. We respond within 5 school days.</p>
        <p><strong>Third parties:</strong> Netlify (forms and hosting), Buttondown (newsletter), Cloudflare (analytics). HeyZine, YouTube, and Facebook embeds load only after you click them, and their privacy policies apply once loaded.</p>
      </div>
    </div>
  `;

  const contactHtml = createPageHtml({
    title: 'Contact The Louisian',
    metaDesc: 'Contact The Louisian — tips, letters, corrections, privacy',
    canonical: 'https://thelouisianprototype.netlify.app/contact/',
    bodyHtml: contactBody,
  });
  fs.writeFileSync(path.join(DIST_DIR, 'contact.html'), contactHtml);
  console.log('✅ Generated contact.html');

  console.log('\n📦 Site generation complete!');
  console.log('Dist folder:', DIST_DIR);
}

generateSite().catch((err) => {
  console.error('❌ Site generation failed:', err);
  process.exit(1);
});
