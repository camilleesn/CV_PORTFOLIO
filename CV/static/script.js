// --- Menu mobile ---
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', false);
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

// --- Barre de progression + ombre du menu au défilement ---
const bar = document.getElementById('progress-bar');
const nav = document.getElementById('nav');
function onScroll() {
    const h = document.documentElement;
    const ratio = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = (ratio * 100) + '%';
    nav.classList.toggle('is-scrolled', h.scrollTop > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- Lien actif selon la section visible ---
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// --- Apparition douce des éléments ---
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
} else {
    reveals.forEach(el => el.classList.add('is-visible'));
}

// --- Métiers qui s'écrivent puis s'effacent ---
const typed = document.getElementById('typed');
if (typed && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = typed.dataset.words.split('|');
    let w = 0, i = words[0].length, deleting = true;
    const tick = () => {
        const word = words[w];
        typed.textContent = word.slice(0, i);
        let delay = deleting ? 45 : 95;
        if (!deleting && i === word.length) { deleting = true; delay = 1800; }
        else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
        else { i += deleting ? -1 : 1; }
        setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
}

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const pad = n => String(n).padStart(2, '0');

// --- Parcours : chaque frise se remplit, l'étape en cours s'allume ---
const tlGroups = [...document.querySelectorAll('.tl-group')];
const groupTabs = [...document.querySelectorAll('.parcours-side .tab')];
const tk = {
    type: document.getElementById('ticker-type'),
    date: document.getElementById('ticker-date'),
    title: document.getElementById('ticker-title'),
    count: document.getElementById('ticker-count'),
    bar: document.getElementById('ticker-bar'),
};
let currentItem = null;
function updateTimeline() {
    if (!tlGroups.length) return;
    const line = innerHeight * 0.55;
    let current = null;
    tlGroups.forEach(g => {
        const list = g.querySelector('.timeline');
        const fill = g.querySelector('.tl-fill');
        const r = list.getBoundingClientRect();
        fill.style.height = clamp(line - r.top - 8, 0, r.height - 16) + 'px';
        g.querySelectorAll('.tl-item').forEach(it => {
            const reached = it.querySelector('.tl-marker').getBoundingClientRect().top < line;
            it.classList.toggle('is-reached', reached);
            if (reached) current = it;
        });
    });
    if (!current) current = tlGroups[0].querySelector('.tl-item');
    document.querySelectorAll('.tl-item').forEach(it => it.classList.toggle('is-current', it === current));

    const group = current.closest('.tl-group');
    groupTabs.forEach(t => t.classList.toggle('is-active', t.dataset.group === group.dataset.group));

    if (current !== currentItem && tk.date) {
        currentItem = current;
        const items = [...group.querySelectorAll('.tl-item')];
        const idx = items.indexOf(current) + 1;
        tk.type.textContent = group.dataset.group === 'pro' ? 'Expérience' : 'Formation';
        tk.date.textContent = current.querySelector('.date').textContent.trim();
        const h3 = current.querySelector('h3').childNodes[0].textContent.trim();
        const org = current.querySelector('.org').textContent.split('·')[0].trim();
        tk.title.textContent = h3 + ' · ' + org;
        tk.count.textContent = pad(idx) + ' / ' + pad(items.length);
        tk.bar.style.width = (idx / items.length * 100) + '%';
        [tk.date, tk.title].forEach(el => { el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap'); });
    }
}

// --- Projets : défilement horizontal piloté par le défilement vertical ---
const hs = document.getElementById('projets');
const hsTrack = document.getElementById('hs-track');
const hsView = document.getElementById('hs-viewport');
const hsCards = hsTrack ? [...hsTrack.children] : [];
const hsCur = document.getElementById('hs-current');
const hsBar = document.getElementById('hs-bar');
const pinMQ = matchMedia('(min-width: 881px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
let hsDist = 0;
document.getElementById('hs-total').textContent = pad(hsCards.length);

function setHsProgress(p) {
    const idx = clamp(Math.round(p * (hsCards.length - 1)) + 1, 1, hsCards.length);
    hsCur.textContent = pad(idx);
    hsBar.style.width = (Math.max(p, 0) * 75 + 25) + '%';
}
function layoutHs() {
    if (!hs) return;
    if (pinMQ.matches) {
        hs.classList.add('is-pinned');
        hsTrack.style.transform = '';
        hsDist = Math.max(0, hsTrack.scrollWidth - hsView.clientWidth);
        hs.style.height = (innerHeight + hsDist) + 'px';
    } else {
        hs.classList.remove('is-pinned');
        hs.style.height = '';
        hsTrack.style.transform = '';
    }
    updateHs();
}
function updateHs() {
    if (!hs || !hs.classList.contains('is-pinned')) return;
    const r = hs.getBoundingClientRect();
    const p = clamp(-r.top / (hs.offsetHeight - innerHeight || 1));
    hsTrack.style.transform = `translate3d(${-p * hsDist}px, 0, 0)`;
    setHsProgress(p);
    // les cartes entrant à l'écran apparaissent
    hsCards.forEach(c => { if (c.getBoundingClientRect().left < innerWidth - 60) c.classList.add('is-visible'); });
}
hsView && hsView.addEventListener('scroll', () => {
    if (hs.classList.contains('is-pinned')) return;
    const max = hsView.scrollWidth - hsView.clientWidth;
    setHsProgress(max ? hsView.scrollLeft / max : 0);
}, { passive: true });

// --- Boucle de défilement commune ---
let ticking = false;
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateTimeline(); updateHs(); ticking = false; });
}, { passive: true });
window.addEventListener('resize', () => { layoutHs(); updateTimeline(); });
pinMQ.addEventListener && pinMQ.addEventListener('change', layoutHs);
window.addEventListener('load', () => { layoutHs(); updateTimeline(); });
layoutHs();
updateTimeline();
