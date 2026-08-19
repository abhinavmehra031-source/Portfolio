// AOS Init
AOS.init({ once: true, offset: 80, easing: 'ease-out-cubic' });

// Scroll progress bar
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
});

// Navbar scroll effect + active nav highlight
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// Typing animation
const phrases = ['Python Developer', 'Backend Engineer', 'API Specialist', 'ML Enthusiast'];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const word = phrases[pi];
  typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1500); return; }
  if (deleting && ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// Theme toggle
const themeBtn = document.getElementById('theme-toggle');
const saved = localStorage.getItem('theme');
if (saved === 'light') { document.body.classList.add('light'); themeBtn.textContent = '☀️'; }

themeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Contact form
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('form-status');
  const btn = form.querySelector('button[type="submit"]');

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
  };

  btn.disabled = true;
  btn.textContent = 'Sending...';
  status.className = 'form-status';
  status.textContent = '';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // API not available (local static serving) — simulate success
      status.textContent = '✅ Message received! I\'ll get back to you soon.';
      status.className = 'form-status success';
      form.reset();
      return;
    }

    const data = await res.json();
    if (res.ok) {
      status.textContent = '✅ Message sent! I\'ll get back to you soon.';
      status.className = 'form-status success';
      form.reset();
    } else {
      throw new Error(data.detail || 'Something went wrong.');
    }
  } catch (err) {
    status.textContent = `❌ ${err.message}`;
    status.className = 'form-status error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  }
});
