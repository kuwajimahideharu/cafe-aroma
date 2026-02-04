document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'メニューを閉じる');
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'メニューを開く');
    }

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close mobile menu when clicking on a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close mobile menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
                menuBtn.focus();
            }
        });
    }

    // ========================================
    // Smooth Scroll for anchor links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Header Background on Scroll
    // ========================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
                header.classList.add('bg-white/95');
                header.classList.remove('bg-white/90');
            } else {
                header.classList.remove('shadow-md');
                header.classList.remove('bg-white/95');
                header.classList.add('bg-white/90');
            }
        });
    }

    // ========================================
    // Formspree AJAX Submission with Loading State
    // ========================================
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (form && submitBtn) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Show loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.innerHTML = '<span class="spinner"></span>送信中...';
            submitBtn.classList.add('btn-loading');

            const data = new FormData(event.target);
            const action = form.action;

            try {
                const response = await fetch(action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.innerHTML = "送信完了しました！";
                    formStatus.classList.remove('hidden', 'bg-red-50', 'text-red-800');
                    formStatus.classList.add('bg-green-50', 'text-green-800');
                    form.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.innerHTML = "送信に失敗しました。時間をおいて再度お試しください。";
                    }
                    formStatus.classList.remove('hidden', 'bg-green-50', 'text-green-800');
                    formStatus.classList.add('bg-red-50', 'text-red-800');
                }
            } catch (error) {
                formStatus.innerHTML = "送信エラーが発生しました。";
                formStatus.classList.remove('hidden', 'bg-green-50', 'text-green-800');
                formStatus.classList.add('bg-red-50', 'text-red-800');
            } finally {
                // Restore button state
                btnText.textContent = originalText;
                submitBtn.classList.remove('btn-loading');
                formStatus.classList.remove('hidden');
            }
        });
    }

    // ========================================
    // Hero Text Fade-in Animation
    // ========================================
    const fadeElements = document.querySelectorAll('.animate-fade-in-up');
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 200));
    });

    // ========================================
    // Scroll Reveal Animation (Intersection Observer)
    // ========================================
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        scrollRevealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        scrollRevealElements.forEach(el => {
            el.classList.add('revealed');
        });
    }
});
