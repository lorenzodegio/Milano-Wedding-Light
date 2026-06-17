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
  const lbVideoContainer = document.getElementById('lbVideoContainer');
  const cards = document.querySelectorAll('#grid .card');
  let lbIdx = 0;

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    // Check if Vimeo
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(?:channels\/[^\/]+\/|groups\/[^\/]+\/album\/[^\/]+\/video\/|video\/|showcase\/[^\/]+\/video\/)?([0-9]+)/i);
      if (match) {
        return { type: 'vimeo', url: `https://player.vimeo.com/video/${match[1]}?autoplay=1` };
      }
    }
    // Check if YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (match) {
        return { type: 'youtube', url: `https://www.youtube.com/embed/${match[1]}?autoplay=1` };
      }
    }
    // Otherwise treat as direct MP4/video link
    return { type: 'direct', url: url };
  };

  const openLb = (i) => {
    lbIdx = i;
    const card = cards[i];
    if (!card) return;

    // Reset video player container
    if (lbVideoContainer) {
      lbVideoContainer.innerHTML = '';
      lbVideoContainer.style.display = 'none';
    }

    const isVideo = card.classList.contains('video');
    if (isVideo) {
      lbImg.style.display = 'none';
      if (lbVideoContainer) {
        lbVideoContainer.style.display = 'flex';
        const videoSrc = card.dataset.video;
        const embed = getVideoEmbedUrl(videoSrc);
        if (embed) {
          if (embed.type === 'youtube' || embed.type === 'vimeo') {
            const iframe = document.createElement('iframe');
            iframe.src = embed.url;
            iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');
            lbVideoContainer.appendChild(iframe);
          } else {
            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '100%';

            const source = document.createElement('source');
            source.src = embed.url;

            const lowerUrl = embed.url.toLowerCase();
            if (lowerUrl.endsWith('.mov')) {
              source.type = 'video/quicktime';
            } else if (lowerUrl.endsWith('.mp4')) {
              source.type = 'video/mp4';
            } else if (lowerUrl.endsWith('.webm')) {
              source.type = 'video/webm';
            }
            video.appendChild(source);
            lbVideoContainer.appendChild(video);
          }
        }
      }
    } else {
      lbImg.style.display = 'block';
      const bg = card.querySelector('.ph').style.backgroundImage;
      const url = bg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
      lbImg.src = url;
    }

    lbCap.textContent = '';
    lb.classList.add('open');
  };

  const closeLb = () => {
    lb.classList.remove('open');
    if (lbVideoContainer) {
      lbVideoContainer.innerHTML = '';
      lbVideoContainer.style.display = 'none';
    }
  };

  cards.forEach((c, i) => c.addEventListener('click', () => openLb(i)));
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', () => openLb((lbIdx - 1 + cards.length) % cards.length));
  document.getElementById('lbNext').addEventListener('click', () => openLb((lbIdx + 1) % cards.length));
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
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

  // Mobile navigation drawer toggle
  const burger = document.querySelector('.nav-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      document.body.classList.toggle('nav-active');
    });
  }

  // Close mobile navigation drawer when clicking a link
  const navLinksList = document.querySelectorAll('.nav-links a');
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.classList.remove('nav-active');
    });
  });

  // Pre-fill contact form on service selection
  const serviceCtas = document.querySelectorAll('.service-cta');
  const contactSelect = document.getElementById('contactSelect');
  if (serviceCtas && contactSelect) {
    serviceCtas.forEach(cta => {
      cta.addEventListener('click', () => {
        const val = cta.getAttribute('data-service');
        if (val) {
          contactSelect.value = val;
        }
      });
    });
  }

  // Pre-fill checkboxes on partner selection
  const partnerCtas = document.querySelectorAll('.partner-cta');
  const interestDJ = document.getElementById('interestDJ');
  const interestBomboniere = document.getElementById('interestBomboniere');
  if (partnerCtas) {
    partnerCtas.forEach(cta => {
      cta.addEventListener('click', () => {
        const partner = cta.getAttribute('data-partner');
        if (partner === 'dj' && interestDJ) {
          interestDJ.checked = true;
        } else if (partner === 'bomboniere' && interestBomboniere) {
          interestBomboniere.checked = true;
        }
      });
    });
  }
})();
