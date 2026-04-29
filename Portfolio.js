/* ── ANIMATED BG ── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.5 + 0.1
  });
}

function drawBg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,180,216,${p.alpha})`;
    ctx.fill();
  });
  // lines
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,180,216,${0.08 * (1 - d / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawBg);
}
drawBg();

/* ── TYPING ── */
const roles = ['HTML, CSS & JS Developer', 'React Developer', 'Bootstrap Expert', 'BSCS Student', 'Problem Solver'];
let ri = 0, ci = 0, deleting = false;
function type() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const cur = roles[ri];
  if (!deleting) {
    el.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = cur.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // animate skill bars
      const fill = e.target.querySelector('.skill-fill');
      if (fill) {
        const pct = e.target.dataset.skill;
        setTimeout(() => fill.style.width = pct + '%', 200);
      }
    }
  });
}, { threshold: 0.15 });
reveals.forEach(r => observer.observe(r));

/* ── NAV scroll ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 50);
});

/* ── HAMBURGER ── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

/* ── CONTACT FORM ── */
async function submitForm() {
  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!fname || !email || !message) {
    alert('Please fill in Name, Email and Message.');
    return;
  }

  const btn = document.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch('http://localhost:3000/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fname, lname, email, subject, message })
    });

    const result = await response.json();

    if (result.success) {
      document.getElementById('form-success').style.display = 'block';
      ['fname','lname','email','subject','message'].forEach(id => {
        document.getElementById(id).value = '';
      });
      setTimeout(() => {
        document.getElementById('form-success').style.display = 'none';
      }, 4000);
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    alert('Could not connect to server. Make sure server.js is running.');
  }

  btn.textContent = 'Send Message →';
  btn.disabled = false;
}