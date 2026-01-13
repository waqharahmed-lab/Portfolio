// ========================================
// Theme Toggle
// ========================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    html.classList.add('light');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    const isLight = html.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    themeIcon.classList.toggle('fa-sun', isLight);
    themeIcon.classList.toggle('fa-moon', !isLight);
});

// ========================================
// Mobile Menu
// ========================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const menuIcon = document.getElementById('menuIcon');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');

function closeMobileMenu() {
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
}

function openMobileMenu() {
    sidebar.classList.add('active');
    mobileOverlay.classList.add('active');
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
}

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
});

mobileOverlay.addEventListener('click', closeMobileMenu);

// ========================================
// Smooth Scroll & Active Navigation
// ========================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            closeMobileMenu();
        }
    });
});

function updateActiveNav() {
    let current = 'home';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 160) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('data-section') === current
        );
    });
}

window.addEventListener('scroll', updateActiveNav);

// ========================================
// Scroll Progress Bar
// ========================================
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ========================================
// Fade-in Animation
// ========================================
const fadeObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll('.fade-section').forEach(sec => {
    fadeObserver.observe(sec);
});

// ========================================
// Hero Buttons Smooth Scroll
// ========================================
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', e => {
        const href = btn.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========================================
// Particle Background (FIXED ALIGNMENT)
// ========================================
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;
let mouseX = -9999;
let mouseY = -9999;

function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1
    }));
}

function getParticleColors() {
    return html.classList.contains('light')
        ? { p: 'rgba(124,58,237,0.6)', l: 'rgba(124,58,237,' }
        : { p: 'rgba(56,189,248,0.6)', l: 'rgba(56,189,248,' };
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    const c = getParticleColors();

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const d = Math.hypot(dx, dy);

        if (d < 180) {
            p.x += dx * 0.002;
            p.y += dy * 0.002;
        }

        if (p.x < 0) p.x = particleCanvas.width;
        if (p.x > particleCanvas.width) p.x = 0;
        if (p.y < 0) p.y = particleCanvas.height;
        if (p.y > particleCanvas.height) p.y = 0;

        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        particleCtx.fillStyle = c.p;
        particleCtx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);

            if (dist < 100) {
                particleCtx.strokeStyle = c.l + (0.15 * (1 - dist / 100)) + ')';
                particleCtx.lineWidth = 0.5;
                particleCtx.beginPath();
                particleCtx.moveTo(particles[i].x, particles[i].y);
                particleCtx.lineTo(particles[j].x, particles[j].y);
                particleCtx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

resizeParticleCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeParticleCanvas();
    initParticles();
});

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ========================================
// Node Cursor Effect (Desktop Only)
// ========================================
const nodeCursorCanvas = document.getElementById('nodeCursor');
const nodeCursorCtx = nodeCursorCanvas.getContext('2d');

let nodes = [];
const NODE_COUNT = 10;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function resizeNodeCanvas() {
    nodeCursorCanvas.width = window.innerWidth;
    nodeCursorCanvas.height = window.innerHeight;
}

function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: cursorX,
        y: cursorY
    }));
}

function getCursorColors() {
    return html.classList.contains('light')
        ? { s: 'rgba(124,58,237,0.6)', f: '#7c3aed' }
        : { s: 'rgba(56,189,248,0.6)', f: '#38bdf8' };
}

function animateNodeCursor() {
    if (isTouchDevice()) return;

    nodeCursorCtx.clearRect(0, 0, nodeCursorCanvas.width, nodeCursorCanvas.height);
    const c = getCursorColors();

    nodes[0].x += (cursorX - nodes[0].x) * 0.35;
    nodes[0].y += (cursorY - nodes[0].y) * 0.35;

    for (let i = 1; i < nodes.length; i++) {
        nodes[i].x += (nodes[i - 1].x - nodes[i].x) * 0.25;
        nodes[i].y += (nodes[i - 1].y - nodes[i].y) * 0.25;
    }

    nodeCursorCtx.strokeStyle = c.s;
    nodeCursorCtx.lineWidth = 1.2;
    nodeCursorCtx.beginPath();
    nodes.forEach((n, i) => (i ? nodeCursorCtx.lineTo(n.x, n.y) : nodeCursorCtx.moveTo(n.x, n.y)));
    nodeCursorCtx.stroke();

    nodes.forEach((n, i) => {
        nodeCursorCtx.beginPath();
        nodeCursorCtx.arc(n.x, n.y, i === 0 ? 4 : 2.5, 0, Math.PI * 2);
        nodeCursorCtx.fillStyle = c.f;
        nodeCursorCtx.fill();
    });

    requestAnimationFrame(animateNodeCursor);
}

if (!isTouchDevice()) {
    resizeNodeCanvas();
    initNodes();
    animateNodeCursor();

    window.addEventListener('resize', resizeNodeCanvas);
    window.addEventListener('mousemove', e => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
}
