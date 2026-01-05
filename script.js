// ======================
// THEME TOGGLE
// ======================
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.className = savedTheme;
  toggleBtn.textContent = savedTheme === "dark" ? "🌙" : "☀️";
}

toggleBtn.addEventListener("click", () => {
  if (body.classList.contains("dark")) {
    body.className = "light";
    toggleBtn.textContent = "☀️";
    localStorage.setItem("theme", "light");
  } else {
    body.className = "dark";
    toggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
});

// ======================
// SMOOTH SCROLL
// ======================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// ======================
// ACTIVE MENU
// ======================
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".sidebar-nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 150) {
      current = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`
    );
  });
});

// ======================
// SCROLL PROGRESS
// ======================
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  document.getElementById("scrollProgress").style.width =
    (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
});

// ======================
// FADE REVEAL
// ======================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".fade").forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});

// ======================
// MOBILE MENU
// ======================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// ===============================
// NODE CURSOR EFFECT
// ===============================
const cursorCanvas = document.getElementById("nodeCursor");
const cursorCtx = cursorCanvas.getContext("2d");

function resizeCursor() {
  cursorCanvas.width = innerWidth;
  cursorCanvas.height = innerHeight;
}
resizeCursor();
addEventListener("resize", resizeCursor);

const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const cursorNodes = Array.from({ length: 10 }, () => ({
  x: mouse.x,
  y: mouse.y
}));

function animateCursor() {
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

  cursorNodes[0].x += (mouse.x - cursorNodes[0].x) * 0.35;
  cursorNodes[0].y += (mouse.y - cursorNodes[0].y) * 0.35;

  for (let i = 1; i < cursorNodes.length; i++) {
    cursorNodes[i].x += (cursorNodes[i - 1].x - cursorNodes[i].x) * 0.25;
    cursorNodes[i].y += (cursorNodes[i - 1].y - cursorNodes[i].y) * 0.25;
  }

  cursorCtx.strokeStyle = "rgba(56,189,248,0.6)";
  cursorCtx.lineWidth = 1.2;
  cursorCtx.beginPath();
  cursorNodes.forEach((n, i) => {
    if (i === 0) cursorCtx.moveTo(n.x, n.y);
    else cursorCtx.lineTo(n.x, n.y);
  });
  cursorCtx.stroke();

  cursorNodes.forEach((n, i) => {
    cursorCtx.beginPath();
    cursorCtx.arc(n.x, n.y, i === 0 ? 4 : 2.5, 0, Math.PI * 2);
    cursorCtx.fillStyle = "#38bdf8";
    cursorCtx.fill();
  });

  requestAnimationFrame(animateCursor);
}
animateCursor();


const bgCanvas = document.getElementById("bgParticles");
const bgCtx = bgCanvas.getContext("2d");

function resizeBg() {
  bgCanvas.width = innerWidth;
  bgCanvas.height = innerHeight;
}
resizeBg();
addEventListener("resize", resizeBg);

const bgMouse = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener("mousemove", e => {
  bgMouse.x = e.clientX;
  bgMouse.y = e.clientY;
});

const particles = [];
const COUNT = 80;

for (let i = 0; i < COUNT; i++) {
  particles.push({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 1
  });
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  for (let p of particles) {
    // base movement
    p.x += p.vx;
    p.y += p.vy;

    // cursor attraction
    const dx = bgMouse.x - p.x;
    const dy = bgMouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 200) {
      p.x += dx * 0.002;
      p.y += dy * 0.002;
    }

    // wrap
    if (p.x < 0) p.x = bgCanvas.width;
    if (p.x > bgCanvas.width) p.x = 0;
    if (p.y < 0) p.y = bgCanvas.height;
    if (p.y > bgCanvas.height) p.y = 0;

    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    bgCtx.fillStyle = "rgba(56,189,248,0.6)";
    bgCtx.fill();
  }

  requestAnimationFrame(animateBg);
}
animateBg();
