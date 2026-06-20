/* ==========================================================================
   Nritya Sadhana - Advanced Interactivity & Animation Engine
   ========================================================================== */

window.transitionState = { progress: 0 };

document.addEventListener('DOMContentLoaded', () => {
  
  // Register GSAP ScrollTrigger plugin safely
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {
      console.error("GSAP ScrollTrigger registration failed:", e);
    }
  } else {
    console.warn("GSAP or ScrollTrigger is missing.");
  }

  // Initialize Core Systems with error protection
  const initSafe = (fn, name) => {
    try {
      fn();
    } catch (e) {
      console.error(`Error initializing ${name}:`, e);
    }
  };

  initSafe(initLenis, 'Lenis Smooth Scroll');
  initSafe(initPreloader, 'Preloader');
  initSafe(initAmbientParticles, 'Ambient Particles');
  initSafe(initIntersectionObserver, 'Intersection Observer Reveals');
  initSafe(initAmbientAtmosphere, 'Ambient Fog & Volumetric Rays');
  initSafe(initTextSplittingAndReveals, 'Luxury Text Animations');
  initSafe(initPathSelfDrawing, 'Self-Drawing Paths');
  initSafe(initLightingMoods, 'Dynamic Lighting Moods');
  initSafe(initScrollAnimations, 'Scroll Animations');
  initSafe(initTestimonialCarousel, 'Testimonial Carousel');
  initSafe(initAdmittanceForm, 'Admittance Form');
  initSafe(initCanvasMap, 'Canvas Map');
  initSafe(initDiyyaCanvas, 'Floating Diyya Canvas');

  // Handle image loading failures gracefully (hides broken image icons to reveal fallback SVGs)
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      console.warn("Failed to load image, hiding to show fallback SVG:", img.src);
      img.style.opacity = '0';
    });
    // Trigger if image is already broken
    if (img.complete && img.naturalWidth === 0) {
      img.style.opacity = '0';
    }
  });
});

/* ==========================================================================
   Lenis Smooth Scrolling
   ========================================================================== */
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') {
    console.warn("Lenis is not defined. Skipping smooth scroll.");
    return;
  }
  
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync ScrollTrigger with Lenis
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }

  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

/* ==========================================================================
   Act 1: Preloader & Opening Sequence
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const barProgress = document.querySelector('.bar-progress');
  const bellTrigger = document.getElementById('bell-trigger');
  const soundWave = document.querySelector('.sound-wave');
  
  let progress = 0;
  
  // Simulate load sequence
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      triggerUnveil();
    }
    if (barProgress) {
      barProgress.style.width = `${progress}%`;
    }
  }, 80);

  function triggerUnveil() {
    // Play sound wave animation ping
    if (soundWave) {
      soundWave.classList.remove('ping');
      void soundWave.offsetWidth; // trigger reflow
      soundWave.classList.add('ping');
    }
    
    // Swing bell strongly if GSAP exists
    const bellSvg = document.querySelector('.temple-bell-svg');
    if (bellSvg && typeof gsap !== 'undefined') {
      bellSvg.style.animation = 'none'; // stop CSS swing
      
      // Spawn golden particles falling from the bell
      spawnBellParticles(bellTrigger);
      
      // Dampened swing timeline (Realistic settling)
      gsap.timeline()
        .to(bellSvg, { rotation: 22, duration: 0.35, ease: "power1.inOut" })
        .to(bellSvg, { rotation: -18, duration: 0.45, ease: "power1.inOut" })
        .to(bellSvg, { rotation: 14, duration: 0.55, ease: "power1.inOut" })
        .to(bellSvg, { rotation: -10, duration: 0.65, ease: "power2.inOut" })
        .to(bellSvg, { rotation: 6, duration: 0.75, ease: "power2.out" })
        .to(bellSvg, { rotation: -3, duration: 0.85, ease: "power2.out" })
        .to(bellSvg, { rotation: 1, duration: 0.95, ease: "power3.out" })
        .to(bellSvg, { rotation: 0, duration: 1.1, ease: "power3.out" });
    }

    // Open curtains
    setTimeout(() => {
      document.body.classList.add('loaded');
      playHeroReveal();
      // Recalculate all scroll trigger offsets now that the page height is unlocked
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 1000);
    }, 900); // Wait slightly longer for bell swing and particle launch
  }

  function spawnBellParticles(container) {
    if (!container) return;
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'bell-particle';
      container.appendChild(p);
      
      const startX = 40 + Math.random() * 20; // center clapper area
      const startY = 80 + Math.random() * 15;
      
      gsap.set(p, {
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        backgroundColor: Math.random() > 0.5 ? '#D4AF37' : '#ECCB76',
        borderRadius: '50%',
        opacity: Math.random() * 0.8 + 0.2,
        pointerEvents: 'none',
        boxShadow: '0 0 6px #ECCB76',
        zIndex: 15
      });
      
      gsap.to(p, {
        x: (Math.random() - 0.5) * 120, // drift sideways
        y: 120 + Math.random() * 160,   // fall down
        opacity: 0,
        scale: 0.1,
        duration: 1.5 + Math.random() * 1.5,
        ease: "power2.out",
        onComplete: () => p.remove()
      });
    }
  }
}

// Staggered reveal of hero section content
function playHeroReveal() {
  if (typeof gsap === 'undefined') {
    // Fallback: show elements instantly
    document.querySelectorAll('#hero-tag, .hero-description, .hero-cta, .hero-corner-motifs .motif').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('#hero-main-title span span').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const tl = gsap.timeline();

  tl.to('#hero-tag', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out"
  })
  .to('#hero-main-title span span', {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.08,
    duration: 1.4,
    ease: "back.out(1.5)"
  }, "-=0.8")
  .to('.hero-description', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out"
  }, "-=1.0")
  .to('.hero-cta', {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: "power3.out"
  }, "-=0.8")
  .to('.hero-corner-motifs .motif', {
    opacity: 0.4,
    stagger: 0.1,
    duration: 1.5,
    ease: "power2.out"
  }, "-=0.8");
}

/* ==========================================================================
   Canvas Ambient Gold Dust Particles
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const maxParticles = 75;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Random start height initially
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = -(Math.random() * 0.6 + 0.2); // Slow upward speed
      this.opacity = Math.random() * 0.5 + 0.15;
      this.baseOpacity = this.opacity;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.02 - 0.01;
    }
    
    update() {
      if (window.transitionState && window.transitionState.progress > 0.02) {
        const p = window.transitionState.progress;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Calculate vector to center
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Attract force: pull increases with progress
        const pull = 0.05 * p;
        this.x += dx * pull;
        this.y += dy * pull;
        
        // Orbit effect (adds a swirl during gather)
        const swirl = 0.04 * p;
        const rx = this.x - centerX;
        const ry = this.y - centerY;
        this.x = centerX + rx * Math.cos(swirl) - ry * Math.sin(swirl);
        this.y = centerY + rx * Math.sin(swirl) + ry * Math.cos(swirl);
        
        // Soft shimmer fade
        this.opacity = this.baseOpacity * (1 - p * 0.3);
      } else {
        // Normal drift
        this.y += this.speedY;
        this.angle += this.spin;
        this.x += this.speedX + Math.sin(this.angle) * 0.25;
        this.opacity = this.baseOpacity;
      }
      
      // Recycle logic
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        if (window.transitionState && window.transitionState.progress > 0.1) {
          this.y = canvas.height + 10;
        }
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      // Shimmer effect (slow opacity pulse)
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = '#ECCB76';
      
      // Radial golden gradient for soft dust look
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, '#FAF6F0');
      grad.addColorStop(0.3, '#D4AF37');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate particles
  for (let i = 0; i < maxParticles; i++) {
    particlesArray.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw volumetric dark background glow overlay
    const centerGlow = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0, 
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.8
    );
    centerGlow.addColorStop(0, 'rgba(44, 8, 14, 0.05)');
    centerGlow.addColorStop(0.5, 'rgba(12, 2, 3, 0)');
    centerGlow.addColorStop(1, 'rgba(12, 2, 3, 0.6)');
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ==========================================================================
   ScrollTrigger & Page Section Animations
   ========================================================================== */
let courseCardsArray = [];

function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn("GSAP or ScrollTrigger is not defined. Skipping scroll animations.");
    return;
  }
  
  // Navigation active links highlight sync
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        current = sec.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 1. Cinematic camera push-in during hero scroll
  gsap.to('.hero-dancer-img', {
    scale: 1.08,
    yPercent: 8,
    ease: "none",
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.hero-content', {
    scale: 0.96,
    yPercent: -12,
    ease: "none",
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // 2. Parallax on all bg-mandala elements
  document.querySelectorAll('.bg-mandala').forEach(mandala => {
    gsap.to(mandala, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: mandala.closest('section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // 3. Cinematic Scene transitions (fade-through-light and gather particles)
  const sectionList = ['#hero', '#legacy', '#sacred-learning', '#performance', '#voices', '#impact', '#join', '.final-bow-footer'];
  for (let i = 0; i < sectionList.length - 1; i++) {
    const triggerSec = document.querySelector(sectionList[i]);
    if (!triggerSec) continue;
    
    ScrollTrigger.create({
      trigger: triggerSec,
      start: "bottom 30%",
      end: "bottom -30%",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = Math.sin(self.progress * Math.PI);
        if (window.transitionState) {
          window.transitionState.progress = progress;
        }
        gsap.set('#transition-overlay', { opacity: progress * 0.82 });
      }
    });
  }

  // ACT 2: Timeline drawing path on scroll
  const path = document.getElementById('scroll-timeline-path');
  if (path) {
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".legacy-grid",
        start: "top 60%",
        end: "bottom 80%",
        scrub: 0.5
      }
    });
  }

  // ACT 2: Founder image scale/parallax
  gsap.to('.founder-image', {
    scale: 1.05,
    yPercent: -8,
    scrollTrigger: {
      trigger: ".founder-archway-container",
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });

  // ACT 3: Courses Cards Float animation ticker
  const cards = document.querySelectorAll('.course-card');
  courseCardsArray = Array.from(cards);
  let tickerTime = 0;
  function floatLoop() {
    tickerTime += 0.012;
    courseCardsArray.forEach((card, idx) => {
      if (card.classList.contains('reveal-active')) {
        const yOffset = Math.sin(tickerTime + idx * 1.5) * 8;
        const rotOffset = Math.cos(tickerTime + idx * 1.2) * 0.6;
        gsap.set(card, {
          yPercent: yOffset,
          rotationZ: rotOffset
        });
      }
    });
    requestAnimationFrame(floatLoop);
  }
  floatLoop();

  // ACT 4: Gallery spotlight sweep, stage flash, zoom and parallax
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    const img = item.querySelector('.gallery-img');
    const reveal = item.querySelector('.spotlight-reveal');
    
    if (!img || !reveal) return;

    gsap.set(reveal, {
      '--spotlight-x': '-20%',
      '--spotlight-y': '-20%',
      '--spotlight-r': '0%',
      '--spotlight-f': '30%'
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    });

    tl.to(item, {
      filter: "brightness(1.5) contrast(1.1) drop-shadow(0 0 10px #D4AF37)",
      duration: 0.2,
      ease: "power2.out"
    })
    .to(item, {
      filter: "brightness(1.0) contrast(1.0) drop-shadow(0 0 0px transparent)",
      duration: 0.35,
      ease: "power2.in"
    })
    .to(reveal, {
      '--spotlight-x': '60%',
      '--spotlight-y': '60%',
      '--spotlight-r': '30%',
      '--spotlight-f': '65%',
      duration: 1.0,
      ease: "power2.inOut"
    }, "-=0.25")
    .to(reveal, {
      '--spotlight-x': '50%',
      '--spotlight-y': '50%',
      '--spotlight-r': '70%',
      '--spotlight-f': '100%',
      duration: 0.8,
      ease: "power2.out"
    });

    gsap.fromTo(img, {
      scale: 1.25,
      yPercent: 10
    }, {
      scale: 1.05,
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // ACT 6: Counters and progress circles animation
  const statsSection = document.getElementById('impact');
  if (statsSection) {
    ScrollTrigger.create({
      trigger: ".stats-grid",
      start: "top 80%",
      once: true,
      onEnter: () => {
        animateProgressCircles();
        animateStatNumbers();
      }
    });
  }
  
  function animateProgressCircles() {
    const paths = document.querySelectorAll('.progress-bar-path');
    paths.forEach(path => {
      const progress = parseInt(path.getAttribute('data-progress'), 10);
      const dasharray = 283; // 2 * PI * r (r=45)
      const offset = dasharray * (1 - progress / 100);
      
      gsap.to(path, {
        strokeDashoffset: offset,
        duration: 2.0,
        ease: "power2.out"
      });
    });
  }

  function animateStatNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'), 10);
      let countObj = { val: 0 };
      
      gsap.to(countObj, {
        val: target,
        duration: 2.0,
        ease: "power2.out",
        onUpdate: () => {
          if (target > 100) {
            num.innerText = `${Math.floor(countObj.val)}+`;
          } else {
            num.innerText = `${Math.floor(countObj.val)}`;
          }
        }
      });
    });
  }

  // Footer visual blessing & temple silhouettes reveal
  gsap.to('.temple-silhouettes', {
    opacity: 1,
    duration: 2.0,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".final-bow-footer",
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.to('.footer-mandala', {
    opacity: 0.08,
    duration: 2.0,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".final-bow-footer",
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
}

/* ==========================================================================
   Act 5: Automatic Infinite Carousel & Quote Transitions
   ========================================================================== */
function initTestimonialCarousel() {
  const cards = document.querySelectorAll('.testimonial-card');
  const progressLine = document.getElementById('carousel-progress');
  
  if (cards.length === 0) return;
  
  let currentIndex = 0;
  const slideDuration = 6000; // 6 seconds per testimonial
  let startTime = Date.now();
  let rAF_Id;

  function updateCarousel() {
    cards.forEach((card, idx) => {
      card.classList.remove('active');
      if (idx === currentIndex) {
        card.classList.add('active');
      }
    });
    
    const activeQuote = cards[currentIndex].querySelector('.testimonial-quote');
    if (activeQuote && typeof gsap !== 'undefined') {
      const sentences = activeQuote.querySelectorAll('.reveal-sentence');
      gsap.fromTo(sentences, {
        opacity: 0,
        y: 12
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.0,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
    
    startTime = Date.now();
    animateProgressBar();
  }

  function animateProgressBar() {
    const elapsed = Date.now() - startTime;
    const progressPercent = Math.min(100, (elapsed / slideDuration) * 100);
    
    if (progressLine) {
      progressLine.style.width = `${progressPercent}%`;
    }

    if (elapsed < slideDuration) {
      rAF_Id = requestAnimationFrame(animateProgressBar);
    } else {
      cancelAnimationFrame(rAF_Id);
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    }
  }

  // Trigger first cycle
  updateCarousel();
}

/* ==========================================================================
   Act 7: Custom Hand-Drawn Map Canvas (Museum-grade replacement)
   ========================================================================== */
function initCanvasMap() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  function resizeMap() {
    const rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 250;
    drawMap();
  }
  
  window.addEventListener('resize', resizeMap);
  resizeMap();

  function drawMap() {
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Background style matching deep maroon dark layout
    ctx.fillStyle = '#1A0306';
    ctx.fillRect(0, 0, w, h);
    
    // Draw abstract grid lines (latitude/longitude in thin brown-gold)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    
    // Draw stylized vector roads/river contours in fine gold lines
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
    ctx.lineWidth = 2.5;
    
    // Path 1: Main Heritage Road (diagonal sweep)
    ctx.beginPath();
    ctx.moveTo(-10, h * 0.8);
    ctx.bezierCurveTo(w * 0.3, h * 0.9, w * 0.6, h * 0.2, w + 10, h * 0.1);
    ctx.stroke();
    
    // Path 2: Intersecting street
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, -10);
    ctx.lineTo(w * 0.45, h + 10);
    ctx.stroke();

    // Path 3: Curved avenue leading to Sanctuary
    ctx.beginPath();
    ctx.moveTo(w * 0.8, h + 10);
    ctx.quadraticCurveTo(w * 0.7, h * 0.5, w * 0.5, h * 0.5);
    ctx.lineTo(-10, h * 0.3);
    ctx.stroke();

    // Central Landmark Point (Nritya Sadhana Sanctuary)
    const px = w * 0.5;
    const py = h * 0.5;

    // Draw stylized sanctuary mandala locator icon
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    
    // Outermost decorative circle ring
    ctx.beginPath();
    ctx.arc(px, py, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner pulse circle
    ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();

    // Focal dot
    ctx.fillStyle = '#ECCB76';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Text labels styled elegantly
    ctx.fillStyle = '#FAF6F0';
    ctx.font = 'bold 9px "Cinzel", Georgia, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('NRITYA SADHANA SANCTUARY', px + 28, py + 4);
    
    ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
    ctx.font = '8px "Montserrat", sans-serif';
    ctx.fillText('AUROBINDO MARG HQ', px + 28, py + 16);
  }

  // Draw pulsating pin ring
  let pulseRadius = 15;
  let expanding = true;
  
  function pulsePin() {
    if (!canvas || !canvas.parentNode) return;
    
    drawMap();
    const w = canvas.width;
    const h = canvas.height;
    const px = w * 0.5;
    const py = h * 0.5;
    
    if (expanding) {
      pulseRadius += 0.25;
      if (pulseRadius > 35) expanding = false;
    } else {
      pulseRadius -= 0.25;
      if (pulseRadius < 18) expanding = true;
    }

    // Outer pulse ring
    ctx.strokeStyle = `rgba(236, 203, 118, ${1 - (pulseRadius - 15)/20})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    requestAnimationFrame(pulsePin);
  }
  
  pulsePin();
}

/* ==========================================================================
   Luxury Form Validation
   ========================================================================== */
function initAdmittanceForm() {
  const form = document.getElementById('admittance-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    inputs.forEach(input => {
      if (!validateInput(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Trigger elegant submit success state inside form
      const doubleBorder = form.querySelector('.form-border-double');
      form.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; z-index: 5; position: relative;">
          <i class="fa-solid fa-envelope-open-text" style="font-size: 3.5rem; color: #D4AF37; margin-bottom: 25px; display: block;"></i>
          <h4 class="font-cinzel" style="color: #ECCB76; font-size: 1.5rem; letter-spacing: 0.15em; margin-bottom: 15px;">Petition Received</h4>
          <p class="font-montserrat" style="color: #FAF6F0; font-size: 0.9rem; line-height: 1.8; max-width: 420px; margin: 0 auto;">
            Your artistic request has been logged inside our ledger. The council of gurus will evaluate your journey and issue an invitation details letter via email.
          </p>
        </div>
      `;
      // Re-insert double borders to maintain Awwwards visual layout
      if (doubleBorder) {
        form.appendChild(doubleBorder);
      }
    }
  });

  // Attach blur and keyup event validations
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      if (input.parentNode.classList.contains('invalid')) {
        validateInput(input);
      }
    });
  });

  function validateInput(input) {
    const parent = input.parentNode;
    let isValid = true;

    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value.trim());
    } else {
      isValid = input.value.trim() !== '';
    }

    if (isValid) {
      parent.classList.remove('invalid');
    } else {
      parent.classList.add('invalid');
    }

    return isValid;
  }
}

/* ==========================================================================
   High-End Cinematic Animation Systems
   ========================================================================== */

function initIntersectionObserver() {
  const elementsToReveal = document.querySelectorAll('.course-card, .timeline-content-card, .gallery-item, .stat-item, .contact-form-container, .location-container');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        if (entry.target.classList.contains('course-card')) {
          setTimeout(() => {
            entry.target.classList.add('glow-active');
          }, 300);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elementsToReveal.forEach(el => {
    revealObserver.observe(el);
  });
}

function initAmbientAtmosphere() {
  const sectionsToAtmosphere = document.querySelectorAll('#hero, #legacy, #performance, #join');
  sectionsToAtmosphere.forEach(sec => {
    const ray = document.createElement('div');
    ray.className = 'volumetric-light-ray';
    sec.appendChild(ray);
    
    const fog = document.createElement('div');
    fog.className = 'ambient-fog';
    sec.appendChild(fog);
  });
  
  document.querySelectorAll('.hero-corner-motifs .motif, .bg-mandala, .fallback-svg, .form-border-double, .arch-gold-trim, .footer-mandala').forEach(el => {
    el.classList.add('ornament-shimmer');
  });
}

function initTextSplittingAndReveals() {
  if (typeof gsap === 'undefined') return;

  // 1. Headings reveal word-by-word
  document.querySelectorAll('.section-title').forEach(title => {
    const text = title.textContent.trim();
    const words = text.split(/\s+/);
    title.innerHTML = words.map(w => `<span class="reveal-word">${w}</span>`).join(' ');
    
    gsap.fromTo(title.querySelectorAll('.reveal-word'), {
      opacity: 0,
      y: 25
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // 2. Shimmer class injection
  document.querySelectorAll('.header-logo, .shanti-mantra').forEach(el => {
    el.classList.add('shimmer-text');
  });

  // 3. Quotes reveal line-by-line / sentence-by-sentence
  document.querySelectorAll('.testimonial-quote').forEach(quote => {
    const text = quote.textContent.trim();
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    quote.innerHTML = sentences.map(s => `<span class="reveal-sentence" style="display: inline-block; opacity: 0; transform: translateY(12px); transition: opacity 0.8s ease, transform 0.8s ease;">${s.trim()} </span>`).join('');
  });

  const closingQuote = document.querySelector('.sacred-blockquote');
  if (closingQuote) {
    const lines = closingQuote.innerHTML.split('<br>');
    closingQuote.innerHTML = lines.map(line => {
      return `<span class="reveal-line"><span class="reveal-line-inner">${line.trim()}</span></span>`;
    }).join('');
    
    gsap.fromTo(closingQuote.querySelectorAll('.reveal-line-inner'), {
      opacity: 0,
      yPercent: 100
    }, {
      opacity: 1,
      yPercent: 0,
      stagger: 0.25,
      duration: 1.4,
      ease: "power3.out",
      scrollTrigger: {
        trigger: closingQuote,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // 4. Staggered character reveal for the Shanti Mantra in footer
  const shanti = document.querySelector('.shanti-mantra');
  if (shanti) {
    const text = shanti.textContent.trim();
    shanti.innerHTML = text.split('').map(char => {
      if (char === ' ') return '&nbsp;';
      return `<span class="reveal-char">${char}</span>`;
    }).join('');
    
    gsap.fromTo(shanti.querySelectorAll('.reveal-char'), {
      opacity: 0,
      y: 15,
      scale: 0.85
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.1,
      duration: 1.2,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: shanti,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }
}

function initPathSelfDrawing() {
  if (typeof gsap === 'undefined') return;
  
  document.querySelectorAll('.bg-mandala path, .fallback-svg path, .footer-mandala path').forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: path.closest('section') || path.closest('.course-card') || path.closest('.gallery-item') || path.closest('.footer-blessing-container'),
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });

  document.querySelectorAll('.form-border-double, .arch-gold-trim, .card-border-glow').forEach(frame => {
    gsap.fromTo(frame, {
      opacity: 0,
      scale: 0.98
    }, {
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: frame.closest('section') || frame.closest('.course-card'),
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });
}

function initLightingMoods() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const moodConfigs = [
    { sec: '#hero', type: 'lighting-hero' },
    { sec: '#legacy', type: 'lighting-legacy' },
    { sec: '#performance', type: 'lighting-performance' },
    { sec: '#join', type: 'lighting-contact' }
  ];
  
  moodConfigs.forEach(cfg => {
    const sec = document.querySelector(cfg.sec);
    if (sec) {
      const mood = document.createElement('div');
      mood.className = `lighting-mood ${cfg.type}`;
      sec.appendChild(mood);
      
      ScrollTrigger.create({
        trigger: sec,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => mood.classList.add('active'),
        onEnterBack: () => mood.classList.add('active'),
        onLeave: () => mood.classList.remove('active'),
        onLeaveBack: () => mood.classList.remove('active')
      });
    }
  });
}

function initDiyyaCanvas() {
  const canvas = document.getElementById('diyya-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let diyyasArray = [];
  const maxDiyyas = 12;
  
  function resizeDiyyaCanvas() {
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = canvas.parentNode.offsetHeight;
  }
  
  window.addEventListener('resize', resizeDiyyaCanvas);
  resizeDiyyaCanvas();
  
  class Diyya {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 80;
      this.size = Math.random() * 5 + 6;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = -(Math.random() * 0.4 + 0.3);
      this.opacity = Math.random() * 0.5 + 0.45;
      this.flicker = Math.random() * 0.2;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
    }
    
    update() {
      this.y += this.speedY;
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.25;
      this.flicker = Math.sin(Date.now() * 0.012 + this.size) * 0.12;
      
      if (this.y < -30 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      const flameSize = this.size * (1.0 + this.flicker);
      
      ctx.shadowBlur = flameSize * 3.5;
      ctx.shadowColor = 'rgba(236, 120, 30, 0.75)';
      
      const grad = ctx.createRadialGradient(this.x, this.y - flameSize * 0.5, 0, this.x, this.y - flameSize * 0.5, flameSize);
      grad.addColorStop(0, '#FAF6F0');
      grad.addColorStop(0.2, '#FFA726');
      grad.addColorStop(0.7, '#E65100');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - flameSize * 1.6);
      ctx.quadraticCurveTo(this.x + flameSize * 0.8, this.y - flameSize * 0.2, this.x, this.y + flameSize * 0.2);
      ctx.quadraticCurveTo(this.x - flameSize * 0.8, this.y - flameSize * 0.2, this.x, this.y - flameSize * 1.6);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#5C2C16';
      ctx.beginPath();
      ctx.arc(this.x, this.y + flameSize * 0.4, flameSize * 1.0, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = '#8D4925';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(this.x - flameSize * 1.0, this.y + flameSize * 0.4);
      ctx.lineTo(this.x + flameSize * 1.0, this.y + flameSize * 0.4);
      ctx.stroke();
      
      ctx.restore();
    }
  }
  
  for (let i = 0; i < maxDiyyas; i++) {
    diyyasArray.push(new Diyya());
  }
  
  function animateDiyyas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    diyyasArray.forEach(d => {
      d.update();
      d.draw();
    });
    requestAnimationFrame(animateDiyyas);
  }
  
  animateDiyyas();
}
