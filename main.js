// ── MWL main interactions ──
(function() {
  // Nav scroll
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add('solid');
    else nav.classList.remove('solid');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  // Custom cursor
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const label = document.getElementById('cursorLabel');
  let mx = -100, my = -100, rx = -100, ry = -100;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${mx + 28}px, ${my + 28}px)`;
  });
  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();
  document.querySelectorAll('a, button, .card, .ig-tile, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
      const c = el.dataset && el.dataset.cursor;
      if (c === 'view') { ring.classList.add('view'); label.textContent = 'Vedi'; label.classList.add('show'); }
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover'); ring.classList.remove('view');
      label.classList.remove('show');
    });
  });

  // Portfolio filter
  const filters = document.getElementById('filters');
  const grid = document.getElementById('grid');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      grid.querySelectorAll('.card').forEach(card => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        const show = f === 'all' || tags.includes(f);
        card.style.transition = 'opacity .5s, transform .5s';
        card.style.opacity = show ? '1' : '0.18';
        card.style.transform = show ? 'scale(1)' : 'scale(0.97)';
        card.style.pointerEvents = show ? 'auto' : 'none';
      });
    });
  }

  // Testimonials slider
  const track = document.getElementById('testiTrack');
  const dots = document.getElementById('testiDots');
  const prev = document.getElementById('testiPrev');
  const next = document.getElementById('testiNext');
  if (track) {
    const slides = track.querySelectorAll('.testi');
    const scrollToIdx = (i) => {
      const t = slides[i];
      if (!t) return;
      track.scrollTo({ left: t.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    };
    let idx = 0;
    prev.addEventListener('click', () => { idx = Math.max(0, idx - 1); scrollToIdx(idx); });
    next.addEventListener('click', () => { idx = Math.min(slides.length - 1, idx + 1); scrollToIdx(idx); });
    track.addEventListener('scroll', () => {
      const w = slides[0].offsetWidth + 24;
      const i = Math.round(track.scrollLeft / w);
      idx = i;
      dots.querySelectorAll('span').forEach((d, j) => d.classList.toggle('active', j === i));
    });
  }

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const cards = document.querySelectorAll('#grid .card');
  let lbIdx = 0;
  const openLb = (i) => {
    lbIdx = i;
    const card = cards[i];
    if (!card) return;
    const bg = card.querySelector('.ph').style.backgroundImage;
    const url = bg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
    lbImg.src = url;
    lbCap.textContent = `${card.dataset.couple || ''} · ${card.dataset.loc || ''} · ${card.dataset.year || ''}`;
    lb.classList.add('open');
  };
  cards.forEach((c, i) => c.addEventListener('click', () => openLb(i)));
  document.getElementById('lbClose').addEventListener('click', () => lb.classList.remove('open'));
  document.getElementById('lbPrev').addEventListener('click', () => openLb((lbIdx - 1 + cards.length) % cards.length));
  document.getElementById('lbNext').addEventListener('click', () => openLb((lbIdx + 1) % cards.length));
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowLeft') openLb((lbIdx - 1 + cards.length) % cards.length);
    if (e.key === 'ArrowRight') openLb((lbIdx + 1) % cards.length);
  });

  // Subtle parallax on hero image
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = `translateY(${y * 0.25}px) scale(${1.06 + y * 0.0003})`;
      }
    }, { passive: true });
  }
})();
