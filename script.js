
/* -------- THEME -------- */
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'light'));

  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* -------- NAV -------- */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, { passive: true });

  const menuBtn = document.getElementById('menuBtn');
  menuBtn?.addEventListener('click', () => nav.classList.toggle('nav-mobile-open'));
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('nav-mobile-open')));
})();

/* -------- REVEAL -------- */
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* -------- PROJECT CARD HOVER GLOW -------- */
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.project-card').forEach(card => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--x', (e.clientX - r.left) + 'px');
    card.style.setProperty('--y', (e.clientY - r.top) + 'px');
  });
});

/* -------- FOOTER YEAR -------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* -------- GITHUB PROJECTS -------- */
(function () {
  const USER = 'SaiDilli';
  const grid = document.getElementById('projectsGrid');
  const skillsWrap = document.getElementById('skillsWrap');
  const repoCountEl = document.getElementById('repoCount');

  // Fallback repos (in case GitHub API rate-limits)
  const FALLBACK = [
    { name: 'attendence', description: 'Student attendance tracking application built with JavaScript.', html_url: 'https://github.com/SaiDilli/attendence', language: 'JavaScript', stargazers_count: 0, topics: [] },
    { name: 'portfolio1', description: 'Personal portfolio site built with HTML, CSS and JavaScript.', html_url: 'https://github.com/SaiDilli/portfolio1', language: 'HTML', stargazers_count: 0, topics: [] },
    { name: 'Ai-Mentor', description: 'AI-powered mentor helping students learn and get guidance.', html_url: 'https://github.com/SaiDilli/Ai-Mentor', language: 'JavaScript', stargazers_count: 0, topics: [] },
    { name: 'Skillnova', description: 'Skill-learning platform experiment with modern web stack.', html_url: 'https://github.com/SaiDilli/Skillnova', language: 'JavaScript', stargazers_count: 0, topics: [] },
    { name: 'InternOps', description: 'Internship / operations management application.', html_url: 'https://github.com/SaiDilli/InternOps', language: 'JavaScript', stargazers_count: 0, topics: [] },
    { name: 'Sai-dilli', description: 'Profile & about me repository.', html_url: 'https://github.com/SaiDilli/Sai-dilli', language: null, stargazers_count: 0, topics: [] }
  ];

  const iconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
  const arrowSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>`;
  const starSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

  function prettifyName(n) {
    return n.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  function fallbackDesc(r) {
    const lang = r.language ? r.language : 'code';
    return `A ${lang} project — ${prettifyName(r.name)} on GitHub.`;
  }

  function render(repos) {
    repos = repos
      .filter(r => !r.fork || ['InternOps','Skillnova','Ai-Mentor'].includes(r.name)) // keep the meaningful ones
      .slice(0, 8);
    if (!repos.length) { repos = FALLBACK; }
    repoCountEl.textContent = repos.length + '+';
    grid.innerHTML = repos.map((r, i) => `
      <a class="project-card reveal" style="transition-delay:${i * 0.05}s" href="${r.html_url}" target="_blank" rel="noopener">
        <div class="project-top">
          <div class="project-icon">${iconSVG}</div>
          <div class="project-star">${starSVG}${r.stargazers_count || 0}</div>
        </div>
        <div class="project-title">${prettifyName(r.name)}</div>
        <div class="project-desc">${r.description || fallbackDesc(r)}</div>
        <div class="project-tags">
          ${r.language ? `<span class="project-tag">${r.language}</span>` : ''}
          ${(r.topics || []).slice(0,3).map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="project-link">View on GitHub ${arrowSVG}</div>
      </a>
    `).join('');

    // observe newly added reveals
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal').forEach(el => io2.observe(el));

    renderSkills(repos);
  }

  function renderSkills(repos) {
    const base = [
      'Full-Stack Development', 'AI Prompt Engineering', 'Problem Solving',
      'JavaScript', 'HTML5', 'CSS3', 'React', 'Node.js', 'Python',
      'Git & GitHub', 'REST APIs', 'SQL', 'Responsive Design'
    ];
    const fromRepos = new Set();
    repos.forEach(r => {
      if (r.language) fromRepos.add(r.language);
      (r.topics || []).forEach(t => fromRepos.add(prettifyName(t)));
    });
    const merged = Array.from(new Set([...base, ...fromRepos]));
    skillsWrap.innerHTML = merged.map((s, i) => `<span class="skill-chip reveal" style="transition-delay:${i*0.03}s">${s}</span>`).join('');
    const io3 = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io3.unobserve(e.target); } });
    }, { threshold: 0.05 });
    skillsWrap.querySelectorAll('.reveal').forEach(el => io3.observe(el));
  }

  fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(render)
    .catch(() => render(FALLBACK));
})();
