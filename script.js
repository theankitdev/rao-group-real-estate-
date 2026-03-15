// ============================================
// RAO GROUP REAL ESTATE - ANIMATION ENGINE
// GSAP + ScrollTrigger + Three.js Particles
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ============================
    // PRELOADER
    // ============================
    const preloader = document.getElementById('preloader');
    const preloaderProgress = document.getElementById('preloader-progress');
    const preloaderText = document.getElementById('preloader-text');
    let prog = 0;

    // Prevent scroll during preload
    document.body.style.overflow = 'hidden';

    const tick = setInterval(() => {
        prog += Math.random() * 15 + 5;
        if (prog >= 100) {
            prog = 100;
            clearInterval(tick);
            preloaderProgress.style.width = '100%';
            preloaderText.textContent = '100%';
            gsap.to(preloader, {
                opacity: 0, duration: 0.6, delay: 0.4, ease: 'power2.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = '';
                    // Initialize everything AFTER preloader is gone
                    initSite();
                }
            });
        } else {
            preloaderProgress.style.width = prog + '%';
            preloaderText.textContent = Math.floor(prog) + '%';
        }
    }, 140);

    // ============================
    // MAIN INIT - Runs after preloader
    // ============================
    function initSite() {
        // Small delay to let layout settle
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                ScrollTrigger.refresh(true);
                runHeroAnimation();
                initScrollAnimations();
                initCounters();
                initPropertyFilters();
                initParallax();
            });
        });
    }

    // ============================
    // CUSTOM CURSOR
    // ============================
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;

    if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1024) {
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        (function loop() {
            cx += (mx - cx) * 0.18;
            cy += (my - cy) * 0.18;
            fx += (mx - fx) * 0.07;
            fy += (my - fy) * 0.07;
            cursor.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
            follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;
            requestAnimationFrame(loop);
        })();

        document.querySelectorAll('a, button, .tilt-card, .magnetic, select, .filter-btn').forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });
    } else {
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
    }

    // ============================
    // MAGNETIC HOVER
    // ============================
    document.querySelectorAll('.magnetic').forEach(el => {
        const str = parseInt(el.dataset.strength) || 20;
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            gsap.to(el, {
                x: (e.clientX - r.left - r.width / 2) * str / 100,
                y: (e.clientY - r.top - r.height / 2) * str / 100,
                duration: 0.35, ease: 'power2.out'
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
    });

    // ============================
    // 3D TILT CARDS
    // ============================
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, {
                rotateY: x * 8, rotateX: -y * 8,
                transformPerspective: 800,
                duration: 0.35, ease: 'power2.out'
            });
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.left = (e.clientX - r.left) + 'px';
                glow.style.top = (e.clientY - r.top) + 'px';
            }
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.8)' });
        });
    });

    // ============================
    // NAVBAR
    // ============================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ============================
    // HERO ENTRANCE
    // ============================
    function runHeroAnimation() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.hero-logo',
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, delay: 0.1 }
          )
          .fromTo('.hero h1',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 }, '-=0.5'
          )
          .fromTo('.hero p',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 }, '-=0.4'
          )
          .fromTo('.hero-buttons .btn',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, '-=0.3'
          )
          .fromTo('.hero-scroll-indicator',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 }, '-=0.2'
          )
          .fromTo('.navbar',
            { y: -60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 }, '-=0.6'
          );
    }

    // ============================
    // SCROLL ANIMATIONS (initialized after preloader)
    // ============================
    function initScrollAnimations() {

        // Section Headers
        gsap.utils.toArray('[data-animate="header"]').forEach(h => {
            const tag = h.querySelector('.section-tag');
            const title = h.querySelector('h2');
            const line = h.querySelector('.section-line');
            const desc = h.querySelector('.section-desc');
            const tl = gsap.timeline({
                scrollTrigger: { trigger: h, start: 'top 88%', toggleActions: 'play none none none' }
            });
            if (tag) tl.fromTo(tag, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
            if (title) tl.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.25');
            if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, '-=0.25');
            if (desc) tl.fromTo(desc, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');
        });

        // Slide right
        gsap.utils.toArray('[data-animate="slide-right"]').forEach(el => {
            gsap.fromTo(el,
                { x: -60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' }
                }
            );
        });

        // Slide left
        gsap.utils.toArray('[data-animate="slide-left"]').forEach(el => {
            gsap.fromTo(el,
                { x: 60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' }
                }
            );
        });

        // Scale
        gsap.utils.toArray('[data-animate="scale"]').forEach(el => {
            gsap.fromTo(el,
                { scale: 0.88, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' }
                }
            );
        });

        // Stagger items (about features, contact details)
        document.querySelectorAll('.about-features, .contact-details').forEach(c => {
            const items = c.querySelectorAll('[data-animate="stagger"]');
            if (items.length) {
                gsap.fromTo(items,
                    { x: -30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out',
                        scrollTrigger: { trigger: c, start: 'top 88%' }
                    }
                );
            }
        });

        // Stagger cards - all grids
        document.querySelectorAll('.services-grid, .testimonials-grid, .properties-grid, .why-us-grid, .awards-grid, .partners-grid, .process-timeline').forEach(g => {
            const cards = g.querySelectorAll('[data-animate="stagger-card"]');
            if (cards.length) {
                gsap.fromTo(cards,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                        scrollTrigger: { trigger: g, start: 'top 88%' }
                    }
                );
            }
        });

        // Process line animation
        const processLine = document.querySelector('.process-line');
        if (processLine) {
            gsap.fromTo(processLine,
                { scaleY: 0 },
                { scaleY: 1, transformOrigin: 'top center', duration: 1.5, ease: 'power2.out',
                    scrollTrigger: { trigger: '.process-timeline', start: 'top 85%' }
                }
            );
        }

        // Footer reveal
        const footerDivs = document.querySelectorAll('.footer-top > div');
        if (footerDivs.length) {
            gsap.fromTo(footerDivs,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
                    scrollTrigger: { trigger: '.footer', start: 'top 92%' }
                }
            );
        }
    }

    // ============================
    // COUNTERS
    // ============================
    function initCounters() {
        let countersRan = false;
        ScrollTrigger.create({
            trigger: '#stats', start: 'top 82%',
            onEnter: () => {
                if (countersRan) return;
                countersRan = true;
                document.querySelectorAll('.stat-number').forEach(el => {
                    const target = +el.dataset.target;
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2.5,
                        ease: 'power2.out',
                        onUpdate: () => {
                            el.textContent = Math.round(obj.val);
                        }
                    });
                });
                gsap.fromTo('.stat-item',
                    { y: 25, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
                );
            }
        });
    }

    // ============================
    // PROPERTY FILTER TABS
    // ============================
    function initPropertyFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const propertyCards = document.querySelectorAll('.property-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                propertyCards.forEach(card => {
                    const type = card.dataset.type;
                    const show = filter === 'all' || type === filter;

                    if (show) {
                        card.style.display = '';
                        gsap.fromTo(card,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                        );
                    } else {
                        gsap.to(card, {
                            opacity: 0, y: -10, duration: 0.3, ease: 'power2.in',
                            onComplete: () => { card.style.display = 'none'; }
                        });
                    }
                });
            });
        });
    }

    // ============================
    // PARALLAX
    // ============================
    function initParallax() {
        gsap.to('.cta-bg', {
            y: -50, ease: 'none',
            scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: true }
        });

        const badge = document.querySelector('.floating-badge');
        if (badge) {
            gsap.to(badge, {
                y: -25, ease: 'none',
                scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true }
            });
        }
    }

    // ============================
    // THREE.JS PARTICLES
    // ============================
    const canvas = document.getElementById('particles-canvas');
    if (canvas && window.innerWidth > 768) {
        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const ren = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        ren.setSize(window.innerWidth, window.innerHeight);
        ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const N = 120;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(N * 3);
        const vel = [];

        for (let i = 0; i < N * 3; i += 3) {
            pos[i] = (Math.random() - 0.5) * 20;
            pos[i + 1] = (Math.random() - 0.5) * 20;
            pos[i + 2] = (Math.random() - 0.5) * 10;
            vel.push({
                x: (Math.random() - 0.5) * 0.004,
                y: (Math.random() - 0.5) * 0.004,
                z: (Math.random() - 0.5) * 0.002
            });
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        const mat = new THREE.PointsMaterial({
            color: 0xc5a55a, size: 0.04,
            transparent: true, opacity: 0.55, sizeAttenuation: true
        });

        const pts = new THREE.Points(geo, mat);
        scene.add(pts);
        cam.position.z = 5;

        let pmx = 0, pmy = 0;
        document.addEventListener('mousemove', e => {
            pmx = (e.clientX / window.innerWidth - 0.5) * 2;
            pmy = -(e.clientY / window.innerHeight - 0.5) * 2;
        });

        (function animP() {
            requestAnimationFrame(animP);
            const p = geo.attributes.position.array;
            for (let i = 0; i < N; i++) {
                p[i * 3] += vel[i].x;
                p[i * 3 + 1] += vel[i].y;
                p[i * 3 + 2] += vel[i].z;
                if (Math.abs(p[i * 3]) > 10) vel[i].x *= -1;
                if (Math.abs(p[i * 3 + 1]) > 10) vel[i].y *= -1;
                if (Math.abs(p[i * 3 + 2]) > 5) vel[i].z *= -1;
            }
            geo.attributes.position.needsUpdate = true;
            pts.rotation.y += 0.0002;
            pts.rotation.x += 0.0001;
            cam.position.x += (pmx * 0.25 - cam.position.x) * 0.015;
            cam.position.y += (pmy * 0.25 - cam.position.y) * 0.015;
            ren.render(scene, cam);
        })();

        window.addEventListener('resize', () => {
            cam.aspect = window.innerWidth / window.innerHeight;
            cam.updateProjectionMatrix();
            ren.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ============================
    // SMOOTH SCROLL
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
        });
    });

    // ============================
    // ACTIVE NAV
    // ============================
    const secs = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const sy = window.scrollY + 120;
        secs.forEach(s => {
            const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
            if (link && !link.classList.contains('nav-cta')) {
                link.style.color = (sy >= s.offsetTop && sy < s.offsetTop + s.offsetHeight) ? '#c5a55a' : '';
            }
        });
    });

    // ============================
    // CONTACT FORM
    // ============================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target;
            const btn = form.querySelector('button[type="submit"]');
            const span = btn.querySelector('span');
            const arrow = btn.querySelector('.btn-arrow');
            const orig = span.textContent;

            gsap.to(btn, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1, onComplete: () => {
                span.textContent = 'Sent Successfully!';
                if (arrow) arrow.className = 'fas fa-check btn-arrow';
                btn.style.background = '#27ae60';
                btn.disabled = true;
                setTimeout(() => {
                    span.textContent = orig;
                    if (arrow) arrow.className = 'fas fa-arrow-right btn-arrow';
                    btn.style.background = '';
                    btn.disabled = false;
                    form.reset();
                }, 3000);
            }});
        });
    }

    // ============================
    // NEWSLETTER
    // ============================
    const nf = document.getElementById('newsletter-form');
    if (nf) {
        nf.addEventListener('submit', e => {
            e.preventDefault();
            const btn = nf.querySelector('button');
            btn.innerHTML = '<i class="fas fa-check"></i>';
            gsap.from(btn.querySelector('i'), { scale: 0, duration: 0.3, ease: 'back.out(2)' });
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i>'; nf.querySelector('input').value = ''; }, 2500);
        });
    }

});
