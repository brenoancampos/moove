/* =========================================================
   Plataforma 360° — lead page (HTML/CSS/JS puro)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NAV: fundo ao rolar ---------- */
  const nav = document.querySelector('.lp-nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-x').forEach(el => io.observe(el));

  /* ---------- CONTADORES (números crescentes) ---------- */
  function animateCount(el, end) {
    const start = performance.now();
    const dur = 1400;
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target, +e.target.dataset.count); countIO.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- CONTADOR REGRESSIVO (reinicia à meia-noite) ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  const els = {
    h: [document.getElementById('cdH'), document.getElementById('cdH2')],
    m: [document.getElementById('cdM'), document.getElementById('cdM2')],
    s: [document.getElementById('cdS'), document.getElementById('cdS2')],
  };
  function tick() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    let diff = Math.max(0, Math.floor((end - now) / 1000));
    const h = Math.floor(diff / 3600); diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    els.h.forEach(el => { if (el) el.textContent = pad(h); });
    els.m.forEach(el => { if (el) el.textContent = pad(m); });
    els.s.forEach(el => { if (el) el.textContent = pad(s); });
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- GALERIA DESLIZANTE (setas prev/next) ---------- */
  const rail = document.getElementById('photoRail');
  const railPrev = document.getElementById('railPrev');
  const railNext = document.getElementById('railNext');
  if (rail && railPrev && railNext) {
    const step = () => {
      const card = rail.querySelector('.photo-slot');
      return (card ? card.getBoundingClientRect().width + 16 : 280) * 2;
    };
    railPrev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    railNext.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* ---------- PARALLAX 3D na plataforma (inclina ao mover o mouse) ---------- */
  const ph = document.getElementById('platformHero');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ph && !reduce) {
    const area = ph.parentElement;
    area.addEventListener('mousemove', (e) => {
      const r = area.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      ph.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg)`;
    });
    area.addEventListener('mouseleave', () => { ph.style.transform = ''; });
  }

});
