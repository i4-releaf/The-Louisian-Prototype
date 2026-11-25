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

const articles = [
  {
    slug: 'slu-beds-new-annex',
    title: 'SLU BEdS opens new senior high annex',
    section: 'News',
    date: '2026-11-20',
    image: '/brand/hero-placeholder.svg',
    excerpt: 'The 18-classroom facility opened November 20, housing 400 students.',
    body: 'SLU BEdS opened its new senior high annex on November 20. The 18-classroom facility houses approximately 400 students.',
    author: 'Keirsten Hayce P. Aberin',
  },
  {
    slug: 'louisian-podcast-recording',
    title: 'Inside the first Louisian podcast recording',
    section: 'Feature',
    date: '2026-11-22',
    image: '/brand/lead-placeholder.svg',
    excerpt: 'The publication’s first student-led podcast debuts in the JVB media lab.',
    body: 'The Louisian recorded its first student-led podcast on November 22 in the JVB media lab.',
    author: 'Jhillyane Rayne M. Lorenzo',
  },
  {
    slug: 'senior-high-intramurals-2026',
    title: 'Senior high intramurals 2026',
    section: 'Sports',
    date: '2026-11-18',
    image: '/brand/lead-placeholder.svg',
    excerpt: 'Basketball, volleyball, and badminton tournaments bring students together.',
    body: 'The annual senior high intramurals concluded November 18 after three days of tournaments.',
    author: 'Ada Ellesse A. Castillo',
  },
  {
    slug: 'library-renovation-students',
    title: 'Library renovation sparks student debate',
    section: 'Opinion',
    date: '2026-11-25',
    image: '/brand/lead-placeholder.svg',
    excerpt: 'Students weigh in on the controversial library renovation plan.',
    body: 'The planned library renovation, set to begin next month, has divided the student body.',
    author: 'Frances Elaine M. Olsim',
  },
  {
    slug: 'sci-tech-digital-literacy',
    title: 'Digital literacy workshops for seniors',
    section: 'Sci-Tech',
    date: '2026-11-24',
    image: '/brand/lead-placeholder.svg',
    excerpt: 'Student-led workshops teach basic computer skills to senior citizens.',
    body: 'The Sci-Tech department launched a digital literacy workshop series on November 24.',
    author: 'Princess Rhyel G. Solis',
  },
];

const issues = [
  {
    slug: 'vol-04-issue-01',
    volume: 'Volume 04',
    number: 'No. 1',
    sy: 'S.Y. 2026–2027',
    title: 'The Facilities Issue',
    description: 'New annex, library renovation, cost of staying cool.',
    date: 'November 2026',
    heyzine: 'https://heyzine.com/flip-book/thelouisian-vol04-issue01.html',
    pdf: '/issues/vol-04-issue-01/pdf/',
  },
];

const tags = {
  'campus-life': 'Campus Life',
  'facilities': 'Facilities',
  'student-voice': 'Student Voice',
  'multimedia': 'Multimedia',
};

module.exports = { boardData, articles, issues, tags };
