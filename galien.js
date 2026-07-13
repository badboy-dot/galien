/* Institut Galien — comportements partagés */
function setLang(lang){
  var base='https://badboy-dot-github-io.translate.goog/galien/';
  // Get current page path relative to /galien/
  var path=window.location.pathname.replace(/^\/galien\/?/,'');
  if(lang==='fr'){
    window.location='https://badboy-dot.github.io/galien/'+(path||'');
  } else {
    window.location=base+(path||'')+'?_x_tr_sl=fr&_x_tr_tl='+lang+'&_x_tr_hl=fr&_x_tr_pto=wapp';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  // Header shadow on scroll
  const header = document.getElementById('site-header');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 300);
  };
  window.addEventListener('scroll', onScroll); onScroll();

  // Hamburger
  const burger = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');
  if (burger && menu) burger.addEventListener('click', () => menu.classList.toggle('open'));

  // Scroll-to-top
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Reveal on scroll
  const obs = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));

  // Counters
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const cObs = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = +el.dataset.counter, dur = 1700;
        let cur = 0, step = target / (dur / 16);
        const t = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = Math.floor(cur).toLocaleString('fr-FR'); }, 16);
        cObs.unobserve(el);
      });
    }, { threshold: .5 });
    counters.forEach(c => cObs.observe(c));
  }

  // Hero slider (Accueil) + dots
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let i = 0, timer;
    const dotsWrap = document.getElementById('heroDots');
    const dots = [];
    if (dotsWrap) slides.forEach((_, k) => {
      const d = document.createElement('b');
      if (k === 0) d.classList.add('on');
      d.addEventListener('click', () => go(k));
      dotsWrap.appendChild(d); dots.push(d);
    });
    const hero = document.querySelector('.home-hero');
    const panel0 = document.querySelector('.hcp-0');
    const panelRest = document.querySelector('.hcp-rest');
    function go(n) {
      slides[i].classList.remove('on'); if (dots[i]) dots[i].classList.remove('on');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('on'); if (dots[i]) dots[i].classList.add('on');
      // Switch content panels
      if(i === 0){
        if(hero) hero.classList.add('slide-0');
        if(panel0) panel0.classList.add('on');
        if(panelRest) panelRest.classList.remove('on');
      } else {
        if(hero) hero.classList.remove('slide-0');
        if(panel0) panel0.classList.remove('on');
        if(panelRest) panelRest.classList.add('on');
      }
      restart();
    }
    // Init first state
    if(hero) hero.classList.add('slide-0');
    function restart() { clearInterval(timer); timer = setInterval(() => go(i + 1), 5500); }
    restart();
  }

  // Formations filter (Formations page)
  window.filterF = (cat, btn) => {
    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('[data-cat]').forEach(c => {
      c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
    });
  };

  // ===== POPUP MODALS (inscription + vidéo) =====
  const YT_ID = 'wj4PTZdAb40';
  // build inscription modal
  const insc = document.createElement('div');
  insc.className = 'gmodal';
  insc.id = 'inscModal';
  insc.innerHTML = `
    <div class="gmodal-box">
      <button class="gmodal-x" data-close>&times;</button>
      <div class="gmodal-head"><h3>Inscription en ligne ✨</h3><p>Remplissez ce formulaire, nous vous recontactons rapidement.</p></div>
      <div class="gmodal-body">
        <form id="inscQuick">
          <div class="gm-row">
            <div class="gm-field"><label>Prénom</label><input type="text" placeholder="Votre prénom" required></div>
            <div class="gm-field"><label>Nom</label><input type="text" placeholder="Votre nom" required></div>
          </div>
          <div class="gm-row">
            <div class="gm-field"><label>Email</label><input type="email" placeholder="votre@email.com" required></div>
            <div class="gm-field"><label>Téléphone</label><input type="tel" placeholder="+212 6XX XXX XXX"></div>
          </div>
          <div class="gm-field"><label>Formation souhaitée</label>
            <select required>
              <option value="" disabled selected>Choisissez une formation</option>
              <option>Kinésithérapie</option><option>Sage-femme</option>
              <option>Infirmier polyvalent</option><option>Infirmier anesthésiste</option>
              <option>Infirmier auxiliaire</option><option>Aide-soignant</option>
              <option>Vente en pharmacie</option><option>Formation continue</option>
            </select>
          </div>
          <button type="submit" class="gm-submit">Envoyer ma demande</button>
        </form>
      </div>
    </div>`;
  document.body.appendChild(insc);

  // build video modal
  const vid = document.createElement('div');
  vid.className = 'gmodal gmodal-video';
  vid.id = 'vidModal';
  vid.innerHTML = `<div class="gmodal-box"><button class="gmodal-x" data-close>&times;</button><div class="frame"></div></div>`;
  document.body.appendChild(vid);

  const openM = m => { m.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeM = m => {
    m.classList.remove('open'); document.body.style.overflow = '';
    if (m === vid) m.querySelector('.frame').innerHTML = '';
  };

  // triggers: S'inscrire (nav + anything with data-inscrire)
  document.querySelectorAll('.nav-cta, [data-inscrire]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openM(insc); });
  });
  // triggers: video
  document.querySelectorAll('[data-video]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      vid.querySelector('.frame').innerHTML =
        `<iframe src="https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      openM(vid);
    });
  });
  // close handlers
  [insc, vid].forEach(m => {
    m.addEventListener('click', e => { if (e.target === m || e.target.hasAttribute('data-close')) closeM(m); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeM(insc); closeM(vid); } });
  // quick form submit
  const iq = document.getElementById('inscQuick');
  if (iq) iq.addEventListener('submit', ev => {
    ev.preventDefault();
    const b = iq.querySelector('.gm-submit'); b.textContent = '✅ Demande envoyée !'; b.style.background = '#2ecc71';
    setTimeout(() => { closeM(insc); b.textContent = 'Envoyer ma demande'; b.style.background = ''; iq.reset(); }, 1800);
  });

  // Language switcher — highlight active button based on cookie
  const langMap = {'fr':'ls-fr','en':'ls-en','ar':'ls-ar'};
  const cookieLang = (document.cookie.match(/googtrans=\/fr\/([a-z]+)/)||[])[1]||'fr';
  Object.values(langMap).forEach(id=>{const b=document.getElementById(id);if(b)b.classList.remove('active')});
  const activeId = langMap[cookieLang]||'ls-fr';
  const activeBtn = document.getElementById(activeId);
  if(activeBtn) activeBtn.classList.add('active');

  // Contact form (demo)
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const b = cf.querySelector('[type=submit]');
    const old = b.textContent; b.textContent = '✅ Message envoyé !'; b.style.background = '#2ecc71';
    setTimeout(() => { b.textContent = old; b.style.background = ''; cf.reset(); }, 3000);
  });
});
