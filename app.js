/**
 * INTERACTIVE CINEMATIC BIRTHDAY CELEBRATION APP
 * Dedicated to: Hari Priya .A (Buddu mah / Hari mah)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all subsystems
  initAudioEngine();
  initCustomCursor();
  initAmbientCanvas();
  initFireworksEngine();
  initHeartSpawner();
  initGiftBox();
  initGalleryAndLightbox();
  initNavigation();
  initScrollAnimations();
});

/* ==========================================================================
   1. ROMANTIC MUSIC BOX AUDIO SYNTHESIZER (Zero-Dependency Web Audio API)
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let melodyInterval = null;
let currentNoteIndex = 0;

// Musical frequencies for romantic music-box melody (Happy Birthday + Romantic Lullaby motif)
const melodyNotes = [
  // Happy Birthday motif in C major / A minor sweet celesta
  { note: 261.63, dur: 0.35, pause: 0.1 },  // C4
  { note: 261.63, dur: 0.35, pause: 0.1 },  // C4
  { note: 293.66, dur: 0.7, pause: 0.15 },  // D4
  { note: 261.63, dur: 0.7, pause: 0.15 },  // C4
  { note: 349.23, dur: 0.7, pause: 0.15 },  // F4
  { note: 329.63, dur: 1.2, pause: 0.3 },   // E4

  { note: 261.63, dur: 0.35, pause: 0.1 },  // C4
  { note: 261.63, dur: 0.35, pause: 0.1 },  // C4
  { note: 293.66, dur: 0.7, pause: 0.15 },  // D4
  { note: 261.63, dur: 0.7, pause: 0.15 },  // C4
  { note: 392.00, dur: 0.7, pause: 0.15 },  // G4
  { note: 349.23, dur: 1.2, pause: 0.3 },   // F4

  { note: 261.63, dur: 0.35, pause: 0.1 },  // C4
  { note: 261.63, dur: 0.35, pause: 0.1 },  // C4
  { note: 523.25, dur: 0.7, pause: 0.15 },  // C5
  { note: 440.00, dur: 0.7, pause: 0.15 },  // A4
  { note: 349.23, dur: 0.7, pause: 0.15 },  // F4
  { note: 329.63, dur: 0.7, pause: 0.15 },  // E4
  { note: 293.66, dur: 1.2, pause: 0.3 },   // D4

  { note: 466.16, dur: 0.4, pause: 0.1 },   // Bb4
  { note: 466.16, dur: 0.4, pause: 0.1 },   // Bb4
  { note: 440.00, dur: 0.7, pause: 0.15 },  // A4
  { note: 349.23, dur: 0.7, pause: 0.15 },  // F4
  { note: 392.00, dur: 0.7, pause: 0.15 },  // G4
  { note: 349.23, dur: 1.6, pause: 0.6 }    // F4
];

function initAudioEngine() {
  const topBtn = document.getElementById('musicToggleBtn');
  const bottomBtn = document.getElementById('bottomSoundBtn');
  const heroSurpriseBtn = document.getElementById('heroSurpriseBtn');

  const toggleMusic = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  topBtn?.addEventListener('click', toggleMusic);
  bottomBtn?.addEventListener('click', toggleMusic);

  // Auto-init audio context on first user click of surprise button
  heroSurpriseBtn?.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!isMusicPlaying) {
      startMusic();
    }
  });
}

function startMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  isMusicPlaying = true;
  updateMusicUI(true);
  currentNoteIndex = 0;
  playNextNote();
}

function stopMusic() {
  isMusicPlaying = false;
  updateMusicUI(false);
  if (melodyInterval) {
    clearTimeout(melodyInterval);
    melodyInterval = null;
  }
}

function updateMusicUI(isPlaying) {
  const topBtn = document.getElementById('musicToggleBtn');
  const stateText = document.getElementById('musicStateText');
  const icon = document.getElementById('musicIcon');
  const bottomBtn = document.getElementById('bottomSoundBtn');
  const bottomState = document.getElementById('bottomSoundState');
  const bottomIcon = document.getElementById('bottomSoundIcon');

  if (isPlaying) {
    topBtn?.classList.add('playing');
    bottomBtn?.classList.add('playing');
    if (stateText) stateText.textContent = 'ON';
    if (icon) icon.textContent = '🎶';
    if (bottomState) bottomState.textContent = 'ON';
    if (bottomIcon) bottomIcon.textContent = '🎶';
  } else {
    topBtn?.classList.remove('playing');
    bottomBtn?.classList.remove('playing');
    if (stateText) stateText.textContent = 'OFF';
    if (icon) icon.textContent = '🔊';
    if (bottomState) bottomState.textContent = 'OFF';
    if (bottomIcon) bottomIcon.textContent = '🔇';
  }
}

function playNextNote() {
  if (!isMusicPlaying || !audioCtx) return;

  const current = melodyNotes[currentNoteIndex];
  playChime(current.note, current.dur);

  currentNoteIndex = (currentNoteIndex + 1) % melodyNotes.length;
  melodyInterval = setTimeout(playNextNote, (current.dur + current.pause) * 1000);
}

function playChime(freq, duration = 0.8) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // Warm music box celesta bell tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, audioCtx.currentTime);

    // Envelope
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  } catch (e) {
    console.warn('Audio note play error:', e);
  }
}

// Sparkle sound chime for interactions
function playSparkleSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const pitches = [523.25, 659.25, 783.99, 1046.50];
  pitches.forEach((p, idx) => {
    setTimeout(() => playChime(p, 0.4), idx * 80);
  });
}

/* ==========================================================================
   2. CUSTOM GLOW CURSOR (Desktop)
   ========================================================================== */
function initCustomCursor() {
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  if (!glow || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    dotX += (mouseX - dotX) * 0.4;
    dotY += (mouseY - dotY) * 0.4;
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Subtle interactive scale on clickable elements
  const clickables = document.querySelectorAll('button, a, .polaroid-card, .gift-box-container, .interactive-center-heart');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = `translate(${dotX}px, ${dotY}px) scale(2.2)`;
      glow.style.transform = `translate(${glowX}px, ${glowY}px) scale(1.3)`;
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = `translate(${dotX}px, ${dotY}px) scale(1)`;
      glow.style.transform = `translate(${glowX}px, ${glowY}px) scale(1)`;
    });
  });
}

/* ==========================================================================
   3. AMBIENT BACKGROUND CANVAS (Stars, Twinkles & Drifting Bokeh)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const starCount = Math.min(130, Math.floor((width * height) / 9000));

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      speedY: Math.random() * 0.25 + 0.05,
      speedX: (Math.random() - 0.5) * 0.15,
      color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#ffd166' : '#ff758f')
    });
  }

  function drawAmbient() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.y -= star.speedY;
      star.x += star.speedX;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;

      star.opacity += star.twinkleSpeed;
      if (star.opacity > 1 || star.opacity < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(1, star.opacity));
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.shadowBlur = star.size * 4;
      ctx.shadowColor = star.color;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(drawAmbient);
  }
  drawAmbient();
}

/* ==========================================================================
   4. PHYSICS FIREWORKS CANVAS ENGINE
   ========================================================================== */
function initFireworksEngine() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
  let height = (canvas.height = canvas.offsetHeight || 600);

  const resize = () => {
    width = canvas.width = canvas.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.offsetHeight || 600;
  };
  window.addEventListener('resize', resize);

  const particles = [];
  const rockets = [];

  const colorPalettes = [
    ['#ff3377', '#ff758f', '#ffffff'],
    ['#ffd166', '#ffb703', '#ffffff'],
    ['#4cc9f0', '#4895ef', '#ffffff'],
    ['#9d4edd', '#c77dff', '#ffffff'],
    ['#06d6a0', '#2ec4b6', '#ffffff']
  ];

  class Rocket {
    constructor(startX, startY, targetX, targetY) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.distance = Math.hypot(targetX - startX, targetY - startY);
      this.angle = Math.atan2(targetY - startY, targetX - startX);
      this.speed = 12;
      this.travelled = 0;
      this.palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      this.trail = [];
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 0.6 });
      if (this.trail.length > 5) this.trail.shift();

      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      this.x += vx;
      this.y += vy;
      this.travelled += this.speed;

      if (this.travelled >= this.distance || this.y <= this.targetY) {
        explode(this.x, this.y, this.palette);
        return false;
      }
      return true;
    }

    draw() {
      ctx.save();
      this.trail.forEach(t => {
        ctx.fillStyle = `rgba(255, 209, 102, ${t.alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fill();
        t.alpha -= 0.1;
      });

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffd166';
      ctx.fill();
      ctx.restore();
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 8 + 2;
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.friction = 0.95;
      this.gravity = 0.15;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.012;
      this.size = Math.random() * 2.8 + 1.2;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function explode(x, y, palette) {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      particles.push(new Particle(x, y, color));
    }
  }

  // Interactive Click on Canvas launches a firework
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    const startX = width / 2 + (Math.random() - 0.5) * 300;
    rockets.push(new Rocket(startX, height, targetX, targetY));
    playSparkleSound();
  });

  // Random automatic firework launch
  let autoTimer = 0;
  function loopFireworks() {
    ctx.fillStyle = 'rgba(7, 3, 15, 0.22)';
    ctx.fillRect(0, 0, width, height);

    autoTimer++;
    if (autoTimer % 65 === 0) {
      const targetX = Math.random() * (width * 0.8) + width * 0.1;
      const targetY = Math.random() * (height * 0.5) + height * 0.1;
      const startX = Math.random() * (width * 0.6) + width * 0.2;
      rockets.push(new Rocket(startX, height, targetX, targetY));
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      rockets[i].draw();
      if (!rockets[i].update()) {
        rockets.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].draw();
      if (!particles[i].update()) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(loopFireworks);
  }
  loopFireworks();
}

/* ==========================================================================
   5. INTERACTIVE HEART SPAWNER (Click Anywhere / Pulsing Center Heart)
   ========================================================================== */
function initHeartSpawner() {
  const centerHeart = document.getElementById('pulsingCenterHeart');
  const arena = document.getElementById('heartArena');
  const heartSymbols = ['💖', '❤️', '🤍', '🌸', '✨', '💕', '🥰', '🌹'];

  function spawnHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'spawned-heart';
    const symbol = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.textContent = symbol;

    const size = Math.random() * 22 + 18;
    const dx = (Math.random() - 0.5) * 140;
    const rot = (Math.random() - 0.5) * 60;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${size}px`;
    heart.style.setProperty('--dx', `${dx}px`);
    heart.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 2500);
  }

  // Click on Center Heart
  centerHeart?.addEventListener('click', (e) => {
    const rect = centerHeart.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        spawnHeart(centerX + (Math.random() - 0.5) * 50, centerY + (Math.random() - 0.5) * 50);
      }, i * 40);
    }
    playSparkleSound();
  });

  // Click anywhere inside heart arena
  arena?.addEventListener('click', (e) => {
    if (e.target.closest('#pulsingCenterHeart')) return;
    spawnHeart(e.clientX, e.clientY);
  });

  // Subtle global click spawning (1 in every click anywhere on the page)
  window.addEventListener('click', (e) => {
    if (e.target.closest('button, a, input')) return;
    spawnHeart(e.clientX, e.clientY);
  });
}

/* ==========================================================================
   6. 3D SURPRISE GIFT BOX INTERACTION
   ========================================================================== */
function initGiftBox() {
  const boxContainer = document.getElementById('interactiveGiftBox');
  const surpriseCard = document.getElementById('revealedSurpriseCard');
  const repackBtn = document.getElementById('repackGiftBtn');
  const heroSurpriseBtn = document.getElementById('heroSurpriseBtn');

  if (!boxContainer || !surpriseCard) return;

  function openGift() {
    if (boxContainer.classList.contains('opened')) return;

    boxContainer.classList.add('opened');
    surpriseCard.classList.add('visible');
    surpriseCard.setAttribute('aria-hidden', 'false');

    playSparkleSound();

    // Confetti Cannon Explosion
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff3377', '#ffd166', '#b5179e', '#4cc9f0', '#ffffff']
      });

      setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);
    }
  }

  function closeGift() {
    boxContainer.classList.remove('opened');
    surpriseCard.classList.remove('visible');
    surpriseCard.setAttribute('aria-hidden', 'true');
  }

  boxContainer.addEventListener('click', openGift);
  boxContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGift();
    }
  });

  repackBtn?.addEventListener('click', closeGift);

  // Hero button triggers smooth scroll to Surprise section & opens box
  heroSurpriseBtn?.addEventListener('click', () => {
    const surpriseSection = document.getElementById('surprise');
    if (surpriseSection) {
      surpriseSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(openGift, 900);
    }
    // Confetti from hero as well
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  });
}

/* ==========================================================================
   7. PHOTO GALLERY & LIGHTBOX MODAL
   ========================================================================== */
function initGalleryAndLightbox() {
  const track = document.getElementById('polaroidTrack');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const openGalleryModalBtn = document.getElementById('openGalleryModalBtn');

  const cards = document.querySelectorAll('.polaroid-card');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalCounter = document.getElementById('modalCounter');
  const modalClose = document.getElementById('lightboxCloseBtn');
  const modalBackdrop = document.getElementById('lightboxBackdrop');
  const modalPrev = document.getElementById('modalPrevBtn');
  const modalNext = document.getElementById('modalNextBtn');

  let activeIndex = 0;

  const galleryData = Array.from(cards).map(card => {
    const img = card.querySelector('img');
    return {
      src: img?.getAttribute('src') || '',
      caption: card.getAttribute('data-caption') || img?.getAttribute('alt') || 'Birthday Memory'
    };
  });

  // Track Carousel Navigation
  prevBtn?.addEventListener('click', () => {
    track?.scrollBy({ left: -300, behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    track?.scrollBy({ left: 300, behavior: 'smooth' });
  });

  function openLightbox(index) {
    if (!modal || index < 0 || index >= galleryData.length) return;
    activeIndex = index;
    updateModalContent();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateModalContent() {
    const item = galleryData[activeIndex];
    if (modalImg) modalImg.src = item.src;
    if (modalCaption) modalCaption.textContent = item.caption;
    if (modalCounter) modalCounter.textContent = `${activeIndex + 1} / ${galleryData.length}`;
  }

  function nextPhoto() {
    activeIndex = (activeIndex + 1) % galleryData.length;
    updateModalContent();
  }

  function prevPhoto() {
    activeIndex = (activeIndex - 1 + galleryData.length) % galleryData.length;
    updateModalContent();
  }

  // Bind Polaroid Cards
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
  });

  openGalleryModalBtn?.addEventListener('click', () => openLightbox(0));
  modalClose?.addEventListener('click', closeLightbox);
  modalBackdrop?.addEventListener('click', closeLightbox);
  modalNext?.addEventListener('click', nextPhoto);
  modalPrev?.addEventListener('click', prevPhoto);

  // Keyboard navigation for modal
  window.addEventListener('keydown', (e) => {
    if (!modal?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });
}

/* ==========================================================================
   8. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navItems = document.querySelectorAll('.nav-item');
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const replayBtn = document.getElementById('replayExperienceBtn');

  // Mobile Drawer
  mobileBtn?.addEventListener('click', () => {
    drawer?.classList.add('open');
  });

  drawerClose?.addEventListener('click', () => {
    drawer?.classList.remove('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer?.classList.remove('open');
    });
  });

  // Scroll To Top
  scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Replay Birthday Experience Button
  replayBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Grand Finale Confetti
    if (typeof confetti === 'function') {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }

    playSparkleSound();
  });

  // Active Section Spy for Bottom Navigation
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const height = sec.offsetHeight;
      const top = sec.offsetTop - 180;
      const id = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(item => {
          if (item.getAttribute('data-section') === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   9. GSAP SCROLL ANIMATIONS & REVEALS
   ========================================================================== */
function initScrollAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Reveal Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  heroTL
    .from('.crown-badge', { y: -40, opacity: 0, duration: 0.9 })
    .from('.birthday-tagline', { scale: 0.8, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.main-celebrant-name', { y: 30, opacity: 0, duration: 1.1 }, '-=0.6')
    .from('.nickname-pill', { scale: 0.8, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-tamil-subtitle', { y: 20, opacity: 0, duration: 0.9 }, '-=0.5')
    .from('.hero-cta-wrapper', { scale: 0.9, opacity: 0, duration: 0.8 }, '-=0.4')
    .from('.scroll-down-indicator', { opacity: 0, y: 15, duration: 0.7 }, '-=0.3');

  // Wishes Cards Staggered Reveal
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.from('.wish-card', {
      scrollTrigger: {
        trigger: '.wishes-section',
        start: 'top 75%'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.25,
      ease: 'power2.out'
    });

    // Polaroid Gallery Reveal
    gsap.from('.polaroid-card', {
      scrollTrigger: {
        trigger: '.memories-section',
        start: 'top 70%'
      },
      scale: 0.85,
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'back.out(1.4)'
    });

    // Timeline Nodes Stagger
    gsap.from('.timeline-node', {
      scrollTrigger: {
        trigger: '.timeline-section',
        start: 'top 75%'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Final Quote Reveal
    gsap.from('.final-quote-box', {
      scrollTrigger: {
        trigger: '.final-section',
        start: 'top 75%'
      },
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  }
}
