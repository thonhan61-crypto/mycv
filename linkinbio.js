'use strict';

const root = document.documentElement;
const progressBar = document.querySelector('.reading-progress');
const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-items a[href^="#"]'));
const yearElement = document.getElementById('current-year');

// Keep the copyright year current.
if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}

// Only hide reveal elements when the browser can observe them, so content
// remains visible if JavaScript or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window) {
    root.classList.add('js-ready');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    // Highlight the table-of-contents link for the section currently in view.
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const activeHref = `#${entry.target.id}`;
            navLinks.forEach((link) => {
                const isActive = link.getAttribute('href') === activeHref;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        });
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
}

// Reading progress and back-to-top control.
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.setAttribute('title', 'Back to top');
backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
document.body.appendChild(backToTop);

let ticking = false;
function updateScrollUI() {
    const scrollableHeight = root.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;

    if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
    }

    backToTop.classList.toggle('visible', window.scrollY > 420);
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateScrollUI);
        ticking = true;
    }
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

updateScrollUI();
