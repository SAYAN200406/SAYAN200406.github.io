/* ===================================================
   Sayan Pan — Portfolio Script
   =================================================== */

/* ---------- NAVBAR: scroll shadow + active links ---------- */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Sticky shadow
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link highlight
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

/* ---------- HAMBURGER MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  // Animate hamburger → ✕
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
  if (hamburger.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close nav when a link is clicked
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

/* ---------- TYPED TEXT ANIMATION ---------- */
const phrases = [
  'Full Stack Developer',
  'Accessibility Advocate',
  'AI & CV Enthusiast',
  'Problem Solver',
  'Open Source Builder'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 1800; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

// Start after a short delay
setTimeout(type, 800);

/* ---------- SCROLL FADE-IN ANIMATIONS ---------- */
const fadeEls = document.querySelectorAll(
  '.project-card, .skill-category, .contact-card, .stat-item, .about-grid, .section-header'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ---------- SMOOTH SCROLL for all anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- GITHUB STATS: Live fetch (optional enhancement) ---------- */
async function fetchGitHubStats() {
  try {
    const res = await fetch('https://api.github.com/users/SAYAN200406');
    if (!res.ok) return;
    const data = await res.json();

    // Update stat numbers dynamically if needed
    const statsMap = {
      repos: data.public_repos,
      followers: data.followers
    };

    // Animate stat counters
    document.querySelectorAll('.stat-number').forEach(el => {
      const text = el.textContent;
      const num = parseInt(text.replace(/\D/g, ''), 10);
      if (!isNaN(num)) animateCounter(el, 0, num, 1200);
    });
  } catch (_) {
    // Silently fail — static values already displayed
  }
}

function animateCounter(el, from, to, duration) {
  const start = performance.now();
  const suffix = el.textContent.replace(/[0-9]/g, '').trim(); // e.g. "+"

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(from + (to - from) * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      fetchGitHubStats();
      statsObserver.disconnect();
    }
  }, { threshold: 0.4 });
  statsObserver.observe(statsSection);
}

/* ---------- TOOLTIP: Skill tags ---------- */
document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
  tag.title = tag.textContent.trim();
});

/* ---------- PREFERS REDUCED MOTION ---------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('visible');
  });
}

/* ---------- FOOTER: current year ---------- */
const yearEl = document.querySelector('.footer-text');
if (yearEl) {
  yearEl.innerHTML = yearEl.innerHTML.replace('2026', new Date().getFullYear());
}

console.log('%c👋 Hey there, fellow dev!', 'font-size:18px; font-weight:bold; color:#2563eb;');
console.log('%cPortfolio of Sayan Pan — github.com/SAYAN200406', 'font-size:13px; color:#64748b;');

