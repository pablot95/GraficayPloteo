document.addEventListener('DOMContentLoaded', function () {

    var preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.classList.add('loaded');
            document.body.classList.remove('no-scroll');
            initAnimations();
        }, 1200);
    });
    document.body.classList.add('no-scroll');

    var navbar = document.querySelector('.navbar');
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
        var current = window.pageYOffset;
        if (current > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = current;
    }, { passive: true });

    var toggle = document.querySelector('.nav-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    var mobileLinks = document.querySelectorAll('.mobile-links a');

    toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = navbar.offsetHeight;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    function initAnimations() {
        var reveals = document.querySelectorAll('.reveal-up');
        var heroSection = document.querySelector('.hero');

        if (heroSection) {
            heroSection.classList.add('in-view');
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = el.dataset.delay || 0;
                    setTimeout(function () {
                        el.classList.add('visible');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(function (el, index) {
            var parent = el.parentElement;
            var siblings = parent ? Array.from(parent.children).filter(function (c) {
                return c.classList.contains('reveal-up');
            }) : [];
            var siblingIndex = siblings.indexOf(el);
            if (siblingIndex > 0) {
                el.dataset.delay = siblingIndex * 100;
            }
            observer.observe(el);
        });
    }

    var filterBtns = document.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.dataset.filter;

            galleryItems.forEach(function (item) {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                    item.style.animation = '';
                }
            });
        });
    });

    var statNumbers = document.querySelectorAll('.stat-number');
    var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.dataset.target);
                var duration = 2000;
                var start = 0;
                var startTime = null;

                function animate(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(animate);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (num) {
        statsObserver.observe(num);
    });

    var style = document.createElement('style');
    style.textContent = '@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);

});
