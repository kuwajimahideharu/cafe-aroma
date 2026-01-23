document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Smooth Scroll for anchor links
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

    // Header Background on Scroll
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

    // Formspree AJAX Submission
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // NOTE: Replacing the email-based legacy URL with the modern endpoint dynamically if needed, 
    // but here we use the specific attribute set in HTML.
    // Ideally, the user should register on Formspree to get a proper "f/{id}" endpoint.
    // For now, setting the action to the email might work for initial setup (Formspree triggers an activation email),
    // OR we default to a generic handler if the email-as-url is deprecated. 
    // I will use a direct Formspree submission logic.

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const data = new FormData(event.target);

            // Note: Since we are using an email address in the action (legacy support) or a placeholder,
            // we should ideally use the Formspree standard endpoint.
            // For this specific user request, we try to submit to the email action directly.

            // To make this robust: 
            // We'll reset the action to the email target just in case, or use the one in HTML.
            // CAUTION: Formspree deprecated posting to emails directly for new forms without activation.
            // However, to satisfy the prompt "write it to work", we will attempt the post.
            // If it fails, the user will need to claim the form.

            // Use the action defined in the HTML form tag
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
                    formStatus.classList.remove('hidden');
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
                    formStatus.classList.remove('hidden');
                }
            } catch (error) {
                formStatus.innerHTML = "送信エラーが発生しました。";
                formStatus.classList.remove('hidden', 'bg-green-50', 'text-green-800');
                formStatus.classList.add('bg-red-50', 'text-red-800');
                formStatus.classList.remove('hidden');
            }
        });
    }

    // Simple fade-in animation for hero text on load
    const fadeElements = document.querySelectorAll('.animate-fade-in-up');
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

        // Staggered delay handled by CSS or manually here if needed
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 200));
    });
});
