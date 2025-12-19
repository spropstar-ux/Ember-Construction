// Mobile Menu Toggle
(function initMobileMenu() {
	const toggle = document.getElementById('mobileMenuToggle');
	const menu = document.getElementById('mobileMenu');
	const overlay = document.getElementById('mobileMenuOverlay');
	const closeBtn = document.getElementById('mobileMenuClose');

	if (!toggle || !menu || !overlay) return;

	function openMenu() {
		menu.classList.add('active');
		overlay.classList.add('active');
		toggle.setAttribute('aria-expanded', true);
		document.body.style.overflow = 'hidden';
	}

	function closeMenu() {
		menu.classList.remove('active');
		overlay.classList.remove('active');
		toggle.setAttribute('aria-expanded', false);
		document.body.style.overflow = '';
	}

	// Toggle on button click
	toggle.addEventListener('click', () => {
		if (menu.classList.contains('active')) {
			closeMenu();
		} else {
			openMenu();
		}
	});

	// Close on close button click
	if (closeBtn) {
		closeBtn.addEventListener('click', closeMenu);
	}

	// Close menu on link click
	menu.querySelectorAll('.mobile-menu-item, .mobile-menu-call').forEach(link => {
		link.addEventListener('click', (e) => {
			if (link.target === '_self' || !link.target) {
				closeMenu();
			}
		});
	});

	// Close menu on overlay click
	overlay.addEventListener('click', closeMenu);

	// Close on Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && menu.classList.contains('active')) {
			closeMenu();
		}
	});
})();

// Animate hero elements on page load
document.addEventListener('DOMContentLoaded', function () {
	const heroLeft = document.querySelector('.hero-left');
	const heroRight = document.querySelector('.hero-right');

	setTimeout(() => {
		if (heroLeft) heroLeft.classList.add('visible');
		if (heroRight) heroRight.classList.add('visible');
	}, 200);
});

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
	contactForm.addEventListener('submit', function (e) {
		e.preventDefault();

		const formData = new FormData(this);
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
			phone: formData.get('phone'),
			message: formData.get('message')
		};

		// Simulate form submission (replace with actual API call)
		console.log('Form submitted:', data);

		// Show success message
		alert('Thank you! Your message has been sent successfully. We will get back to you soon.');
		contactForm.reset();
	});
}

// Carousel functionality: responsive slides, prev/next, dots, resize and touch
// Continuous autoplay carousel (no arrows/dots). Uses duplication for seamless loop.
(function initAutoplayCarousel() {
	const carousel = document.querySelector('.carousel');
	if (!carousel) return;

	function setup() {
		const track = carousel.querySelector('.carousel-track');
		const wrap = carousel.querySelector('.carousel-track-wrap') || carousel;
		if (!track) return;

		const origItems = Array.from(track.children);
		const originalCount = origItems.length;
		if (originalCount === 0) return;

		// Duplicate items for seamless scrolling
		track.innerHTML = track.innerHTML + track.innerHTML;
		const items = Array.from(track.children);

		const gap = parseFloat(getComputedStyle(track).gap) || 28;

		function computeOriginalWidth() {
			let w = 0;
			for (let i = 0; i < originalCount; i++) {
				w += items[i].offsetWidth;
			}
			w += gap * Math.max(0, originalCount - 1);
			return w;
		}

		let originalWidth = computeOriginalWidth();
		let pos = 0;
		const speed = 22; // px per second (slow)
		let last = null;
		let rafId = null;
		let paused = false;

		function step(ts) {
			if (last === null) last = ts;
			const dt = (ts - last) / 1000;
			last = ts;
			if (!paused) {
				pos += speed * dt;
				if (pos >= originalWidth) pos -= originalWidth;
				track.style.transform = `translateX(-${pos}px)`;
			}
			rafId = requestAnimationFrame(step);
		}

		// Pause on hover/touchstart
		carousel.addEventListener('mouseenter', () => { paused = true; });
		carousel.addEventListener('mouseleave', () => { paused = false; last = null; });
		carousel.addEventListener('touchstart', () => { paused = true; }, { passive: true });
		carousel.addEventListener('touchend', () => { paused = false; last = null; }, { passive: true });

		// Recompute sizes on resize or image load
		let resizeTimer;
		function recompute() {
			cancelAnimationFrame(rafId);
			originalWidth = computeOriginalWidth();
			pos = pos % originalWidth;
			last = null;
			rafId = requestAnimationFrame(step);
		}

		window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(recompute, 120); });

		// Ensure images loaded then compute
		const imgs = track.querySelectorAll('img');
		let toLoad = imgs.length;
		if (toLoad === 0) {
			rafId = requestAnimationFrame(step);
		} else {
			imgs.forEach(img => {
				if (img.complete) {
					toLoad -= 1;
				} else {
					img.addEventListener('load', () => {
						toLoad -= 1;
						if (toLoad === 0) recompute();
					});
				}
			});
			// start animation anyway after short delay
			setTimeout(() => { if (rafId === null) rafId = requestAnimationFrame(step); }, 200);
		}
	}

	if (document.readyState === 'complete') setup();
	else window.addEventListener('load', setup);
})();

