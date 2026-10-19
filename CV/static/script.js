/* =====================================================================
   CV de Camille Esnault — comportements de la page (JavaScript)
   =====================================================================

   Ce fichier rend la page « vivante ». Il est chargé tout en bas de
   index.html, une fois que tous les éléments de la page existent.

   Ce qu'il fait, dans l'ordre :
     1. Ouvre / ferme le menu sur téléphone (bouton ≡)
     2. Remplit la barre de progression en haut + ombre sous le menu
     3. Met en surbrillance, dans le menu, la section qu'on lit
     4. Fait apparaître les éléments en fondu quand on les atteint
     5. Écrit puis efface « Data Analyst / Data Scientist / Data Engineer »
     6. Parcours : remplit la frise et met à jour l'encart violet
     7. Projets : fait glisser les cartes sur le côté pendant le défilement
     8. Relie tout cela au défilement et au redimensionnement de la fenêtre

   Le principe général : le JavaScript ajoute ou retire des « classes »
   sur les éléments (par exemple is-active, is-visible, is-open), et c'est
   le CSS (styles.css) qui décide à quoi ressemble chaque classe.

   Petit lexique :
     document.getElementById('x')       → l'élément qui a id="x" dans le HTML
     document.querySelectorAll('.x')    → tous les éléments avec class="x"
     el.classList.add / remove / toggle → ajoute / retire / bascule une classe
     addEventListener('click', …)       → « quand on clique, fais … »
     getBoundingClientRect()            → position de l'élément à l'écran
     innerHeight                        → hauteur de la fenêtre du navigateur
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. MENU SUR TÉLÉPHONE
   Sur petit écran, les liens du menu sont cachés derrière le bouton ≡.
   --------------------------------------------------------------------- */
const toggle = document.getElementById('nav-toggle');   // le bouton ≡
const links = document.getElementById('nav-links');     // la liste de liens

// Clic sur ≡ : on ouvre ou on ferme le menu, et l'icône devient ✕ ou ≡
toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');      // true si le menu vient de s'ouvrir
    toggle.setAttribute('aria-expanded', open);          // information pour les lecteurs d'écran
    toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

// Clic sur un lien du menu : on referme le menu
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', false);
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));


/* ---------------------------------------------------------------------
   2. BARRE DE PROGRESSION + OMBRE DU MENU
   --------------------------------------------------------------------- */
const bar = document.getElementById('progress-bar');   // fine barre violette tout en haut
const nav = document.getElementById('nav');            // le menu

function onScroll() {
    const h = document.documentElement;
    // Part de la page déjà lue : 0 tout en haut, 1 tout en bas
    // (« || 1 » évite une division par zéro si la page est très courte)
    const ratio = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = (ratio * 100) + '%';
    // Dès qu'on a défilé de plus de 10 px, le menu prend une ombre
    nav.classList.toggle('is-scrolled', h.scrollTop > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });   // à chaque défilement
onScroll();                                                        // et une fois au chargement


/* ---------------------------------------------------------------------
   3. LIEN ACTIF DANS LE MENU
   Un « IntersectionObserver » surveille les sections et nous prévient
   quand l'une d'elles passe au milieu de l'écran.
   --------------------------------------------------------------------- */
const navLinks = [...document.querySelectorAll('.nav-links a')];
// Pour chaque lien (href="#parcours"…), on retrouve la section correspondante
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            // La section e.target est au milieu de l'écran : on allume son lien, on éteint les autres
            navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });   // on ne regarde qu'une fine bande au milieu de l'écran
sections.forEach(s => spy.observe(s));


/* ---------------------------------------------------------------------
   4. APPARITION EN FONDU
   Les éléments qui ont class="reveal" sont invisibles au départ (voir
   styles.css). Quand on les atteint, on leur ajoute « is-visible ».
   --------------------------------------------------------------------- */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);   // déjà apparu : plus besoin de le surveiller
            }
        });
    }, { threshold: 0.12 });   // l'élément apparaît dès que 12 % de sa surface est à l'écran
    reveals.forEach(el => io.observe(el));
} else {
    // Navigateur ancien, ou animations réduites par l'utilisateur : tout est visible directement
    reveals.forEach(el => el.classList.add('is-visible'));
}


/* ---------------------------------------------------------------------
   5. MÉTIERS QUI S'ÉCRIVENT PUIS S'EFFACENT
   La liste des métiers est écrite dans index.html :
   data-words="Data Analyst|Data Scientist|Data Engineer"
   → pour en changer, il suffit de modifier cet attribut.
   --------------------------------------------------------------------- */
const typed = document.getElementById('typed');
if (typed && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = typed.dataset.words.split('|');   // ["Data Analyst", "Data Scientist", "Data Engineer"]
    let w = 0;                     // numéro du métier affiché
    let i = words[0].length;       // nombre de lettres actuellement affichées
    let deleting = true;           // true = on efface, false = on écrit

    const tick = () => {
        const word = words[w];
        typed.textContent = word.slice(0, i);   // affiche les i premières lettres
        let delay = deleting ? 45 : 95;         // on efface plus vite qu'on écrit (en millisecondes)

        if (!deleting && i === word.length) {
            // Le mot est entièrement écrit : pause de 1,8 s, puis on efface
            deleting = true; delay = 1800;
        } else if (deleting && i === 0) {
            // Le mot est entièrement effacé : on passe au métier suivant
            deleting = false; w = (w + 1) % words.length; delay = 350;
        } else {
            // Sinon on ajoute ou on retire une lettre
            i += deleting ? -1 : 1;
        }
        setTimeout(tick, delay);   // on recommence après « delay » millisecondes
    };
    setTimeout(tick, 2200);   // premier départ 2,2 s après le chargement
}


/* ---------------------------------------------------------------------
   Deux petits outils utilisés plus bas
   --------------------------------------------------------------------- */
// Garde une valeur entre a et b (par défaut entre 0 et 1)
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// Écrit un nombre sur deux chiffres : 1 → "01"
const pad = n => String(n).padStart(2, '0');


/* ---------------------------------------------------------------------
   6. PARCOURS : FRISES QUI SE REMPLISSENT + ENCART VIOLET
   On imagine une ligne horizontale invisible à 55 % de la hauteur de
   l'écran. Tout ce qui est passé au-dessus de cette ligne est « atteint ».
   --------------------------------------------------------------------- */
const tlGroups = [...document.querySelectorAll('.tl-group')];             // les 2 frises (expériences, formations)
const groupTabs = [...document.querySelectorAll('.parcours-side .tab')];  // boutons « Expériences / Formations »
// Les morceaux de l'encart violet qu'on met à jour
const tk = {
    type: document.getElementById('ticker-type'),     // « EXPÉRIENCE » ou « FORMATION »
    date: document.getElementById('ticker-date'),     // « 2023 — 2026 »
    title: document.getElementById('ticker-title'),   // « Data Analyst · Crédit Agricole… »
    count: document.getElementById('ticker-count'),   // « 01 / 02 »
    bar: document.getElementById('ticker-bar'),       // petite barre de progression
};
let currentItem = null;   // l'étape affichée dans l'encart (pour ne le changer que si besoin)

function updateTimeline() {
    if (!tlGroups.length) return;
    const line = innerHeight * 0.55;   // la ligne invisible, à 55 % de l'écran
    let current = null;                // dernière étape atteinte

    tlGroups.forEach(g => {
        const list = g.querySelector('.timeline');
        const fill = g.querySelector('.tl-fill');      // le trait violet qui se remplit
        const r = list.getBoundingClientRect();
        // Le trait descend jusqu'à la ligne invisible, sans dépasser le bas de la frise
        fill.style.height = clamp(line - r.top - 8, 0, r.height - 16) + 'px';

        // Chaque étape dont le marqueur est au-dessus de la ligne est « atteinte »
        g.querySelectorAll('.tl-item').forEach(it => {
            const reached = it.querySelector('.tl-marker').getBoundingClientRect().top < line;
            it.classList.toggle('is-reached', reached);   // → marqueur violet (CSS)
            if (reached) current = it;
        });
    });

    // Si rien n'est encore atteint, on considère la toute première étape
    if (!current) current = tlGroups[0].querySelector('.tl-item');
    // Une seule étape « en cours » à la fois → carte mise en avant (CSS)
    document.querySelectorAll('.tl-item').forEach(it => it.classList.toggle('is-current', it === current));

    // On allume le bouton « Expériences » ou « Formations » selon la frise en cours
    const group = current.closest('.tl-group');
    groupTabs.forEach(t => t.classList.toggle('is-active', t.dataset.group === group.dataset.group));

    // Mise à jour de l'encart violet, seulement si l'étape a changé
    if (current !== currentItem && tk.date) {
        currentItem = current;
        const items = [...group.querySelectorAll('.tl-item')];
        const idx = items.indexOf(current) + 1;   // position de l'étape dans sa frise (1, 2, 3…)

        tk.type.textContent = group.dataset.group === 'pro' ? 'Expérience' : 'Formation';
        // On recopie les informations directement depuis la carte de l'étape
        tk.date.textContent = current.querySelector('.date').textContent.trim();
        const h3 = current.querySelector('h3').childNodes[0].textContent.trim();       // ex. « Data Analyst »
        const org = current.querySelector('.org').textContent.split('·')[0].trim();    // ex. « Crédit Agricole de Normandie »
        tk.title.textContent = h3 + ' · ' + org;
        tk.count.textContent = pad(idx) + ' / ' + pad(items.length);
        tk.bar.style.width = (idx / items.length * 100) + '%';

        // Relance la petite animation d'apparition (retirer puis remettre la classe)
        [tk.date, tk.title].forEach(el => {
            el.classList.remove('is-swap');
            void el.offsetWidth;   // astuce : force le navigateur à « oublier » l'ancienne animation
            el.classList.add('is-swap');
        });
    }
}


/* ---------------------------------------------------------------------
   7. PROJETS : DÉFILEMENT HORIZONTAL
   Sur ordinateur, la section « Projets » est rendue plus haute que
   l'écran. Pendant qu'on fait défiler cette hauteur supplémentaire, la
   section reste fixée (« épinglée ») et on décale les cartes vers la
   gauche. Sur téléphone, on laisse simplement glisser au doigt.
   --------------------------------------------------------------------- */
const hs = document.getElementById('projets');          // la section entière
const hsTrack = document.getElementById('hs-track');    // la rangée de cartes
const hsView = document.getElementById('hs-viewport');  // la « fenêtre » qui montre la rangée
const hsCards = hsTrack ? [...hsTrack.children] : [];   // les cartes
const hsCur = document.getElementById('hs-current');    // le « 01 » du compteur
const hsBar = document.getElementById('hs-bar');        // la barre sous le compteur

// Conditions pour activer le mode « épinglé » : écran large (> 880 px),
// assez haut (≥ 640 px), et animations non réduites par l'utilisateur
const pinMQ = matchMedia('(min-width: 881px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
let hsDist = 0;   // distance (en pixels) dont il faut décaler les cartes pour voir la dernière

document.getElementById('hs-total').textContent = pad(hsCards.length);   // le « 04 » du compteur

// Met à jour le compteur et la barre ; p va de 0 (début) à 1 (fin)
function setHsProgress(p) {
    const idx = clamp(Math.round(p * (hsCards.length - 1)) + 1, 1, hsCards.length);
    hsCur.textContent = pad(idx);
    hsBar.style.width = (Math.max(p, 0) * 75 + 25) + '%';   // la barre va de 25 % à 100 %
}

// Prépare la section selon la taille de l'écran (au chargement et au redimensionnement)
function layoutHs() {
    if (!hs) return;
    if (pinMQ.matches) {
        hs.classList.add('is-pinned');
        hsTrack.style.transform = '';
        hsDist = Math.max(0, hsTrack.scrollWidth - hsView.clientWidth);
        // La section fait 1 écran de haut + la distance à parcourir sur le côté
        hs.style.height = (innerHeight + hsDist) + 'px';
    } else {
        // Téléphone / petit écran : comportement normal
        hs.classList.remove('is-pinned');
        hs.style.height = '';
        hsTrack.style.transform = '';
    }
    updateHs();
}

// Décale les cartes selon l'avancée du défilement dans la section
function updateHs() {
    if (!hs || !hs.classList.contains('is-pinned')) return;
    const r = hs.getBoundingClientRect();
    // p = 0 quand le haut de la section touche le haut de l'écran, 1 quand on arrive à la fin
    const p = clamp(-r.top / (hs.offsetHeight - innerHeight || 1));
    hsTrack.style.transform = `translate3d(${-p * hsDist}px, 0, 0)`;   // décalage vers la gauche
    setHsProgress(p);
    // Les cartes qui entrent à l'écran apparaissent
    hsCards.forEach(c => { if (c.getBoundingClientRect().left < innerWidth - 60) c.classList.add('is-visible'); });
}

// Sur téléphone, quand on fait glisser les cartes au doigt, on met à jour le compteur
hsView && hsView.addEventListener('scroll', () => {
    if (hs.classList.contains('is-pinned')) return;
    const max = hsView.scrollWidth - hsView.clientWidth;
    setHsProgress(max ? hsView.scrollLeft / max : 0);
}, { passive: true });


/* ---------------------------------------------------------------------
   8. TOUT RELIER AU DÉFILEMENT ET AU REDIMENSIONNEMENT
   --------------------------------------------------------------------- */
// requestAnimationFrame : on fait les calculs au plus une fois par image
// affichée, même si l'événement « scroll » arrive très souvent → plus fluide
let ticking = false;
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateTimeline(); updateHs(); ticking = false; });
}, { passive: true });

// Si on change la taille de la fenêtre (ou qu'on tourne le téléphone), on recalcule
window.addEventListener('resize', () => { layoutHs(); updateTimeline(); });
pinMQ.addEventListener && pinMQ.addEventListener('change', layoutHs);

// Recalcul quand tout est chargé (les images changent les hauteurs), et tout de suite
window.addEventListener('load', () => { layoutHs(); updateTimeline(); });
layoutHs();
updateTimeline();
