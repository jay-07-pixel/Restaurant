import './style.css';

/* ── Cursor glow ── */
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
  glow.style.opacity = '1';
});
window.addEventListener('mouseleave', () => glow.style.opacity = '0');

/* ── Navbar scroll & Progress ── */
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  navbar.classList.toggle('scrolled', scrolled > 60);
  
  const winHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / winHeight) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });

/* ── Staggered Nav Links ── */
document.querySelectorAll('.nav-links li').forEach((li, i) => {
  li.style.animation = `sr-u 0.8s cubic-bezier(0.16,1,0.3,1) both ${0.1 + i * 0.1}s`;
});

/* ── Spice Particle Canvas ── */
const canvas = document.getElementById('spiceParticles');
const ctx = canvas.getContext('2d');
let particles = [];
const EMOJIS = ['✦', '⬡', '●', '◆'];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 4 + 1;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.opacity = Math.random() * 0.3 + 0.05;
    this.color = ['#D4A853','#E67E22','#C0392B','#8E44AD'][Math.floor(Math.random()*4)];
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + Math.floor(this.opacity * 255).toString(16).padStart(2,'0');
    ctx.fill();
  }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll('.sr, .sr-l, .sr-r, .sr-u');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── Parallax hero float on mouse ── */
const floats = document.querySelectorAll('.hero-float');
window.addEventListener('mousemove', e => {
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  floats.forEach(f => {
    const sp = parseFloat(f.dataset.speed || 0.03);
    const dx = (e.clientX - cx) * sp;
    const dy = (e.clientY - cy) * sp;
    f.style.transform = `translate(${dx}px, ${dy}px)`;
  });
});

/* ── Parallax quote strip on scroll ── */
const pqBg = document.querySelector('.pq-bg');
window.addEventListener('scroll', () => {
  if (!pqBg) return;
  const rect = pqBg.parentElement.getBoundingClientRect();
  const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  pqBg.style.transform = `translateY(${(progress - 0.5) * 80}px)`;
}, { passive: true });

/* ── Animated counter ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (el.dataset.suffix || '');
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats').forEach(s => counterObs.observe(s));

/* ── Reservation form ── */
/* ── FlatPickr UI ── */
if (window.flatpickr) {
  flatpickr("#resDate", {
    altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d",
    minDate: "today", theme: "dark",
    disableMobile: true,
    altInputClass: "fp-date"
  });
  flatpickr("#resTime", {
    enableTime: true, noCalendar: true,
    dateFormat: "h:i K", time_24hr: false,
    theme: "dark", disableMobile: true,
    altInputClass: "fp-time"
  });
}

const form = document.getElementById('resForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ Table Reserved!';
    btn.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Reserve Now';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}

/* ── Mobile nav toggle ── */
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    navLinks.style.flexDirection = open ? '' : 'column';
    navLinks.style.position = open ? '' : 'absolute';
    navLinks.style.top = open ? '' : '70px';
    navLinks.style.left = open ? '' : '0';
    navLinks.style.right = open ? '' : '0';
    navLinks.style.background = open ? '' : 'rgba(10,10,10,.97)';
    navLinks.style.padding = open ? '' : '20px 30px';
    navLinks.style.backdropFilter = open ? '' : 'blur(20px)';
  });
}
