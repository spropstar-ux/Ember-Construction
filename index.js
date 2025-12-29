// Scroll to Top Button Functionality
(function initScrollToTop() {
	const scrollTopBtn = document.getElementById('scrollTopBtn');
	if (!scrollTopBtn) return;

	// Show button when scrolled down
	window.addEventListener('scroll', () => {
		if (window.pageYOffset > 300) {
			scrollTopBtn.classList.add('show');
		} else {
			scrollTopBtn.classList.remove('show');
		}
	});

	// Scroll to top on button click
	scrollTopBtn.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});
})();

// Mobile menu toggle (lightweight, Tailwind-based)
(function initMobileMenu() {
	const btn = document.getElementById('mobileMenuBtn');
	const panel = document.getElementById('mobileMenu');
	if (!btn || !panel) return;

	function open() {
		panel.classList.remove('hidden');
		// allow next frame then set maxHeight for smooth transition
		requestAnimationFrame(() => {
			panel.style.maxHeight = panel.scrollHeight + 'px';
		});
		btn.setAttribute('aria-expanded', 'true');
	}

	function close() {
		panel.style.maxHeight = panel.scrollHeight + 'px';
		// next frame set to 0 to animate
		requestAnimationFrame(() => {
			panel.style.maxHeight = '0px';
		});
		btn.setAttribute('aria-expanded', 'false');
		// after transition hide
		setTimeout(() => panel.classList.add('hidden'), 300);
	}

	btn.addEventListener('click', () => {
		if (panel.classList.contains('hidden')) open();
		else close();
	});

	// Close on internal link click
	panel.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', close));

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !panel.classList.contains('hidden')) close();
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

// form
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

document.querySelectorAll("form#loanForm").forEach(form => {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const fullNameEl = form.querySelector('#fullName') || document.getElementById('fullName');
    const emailEl = form.querySelector('#email') || document.getElementById('email');
    const phoneEl = form.querySelector('#phone') || document.getElementById('phone');

    const formData = {
      fullName: (fullNameEl && fullNameEl.value) ? fullNameEl.value.trim() : '',
      email: (emailEl && emailEl.value) ? emailEl.value.trim() : '',
      phone: (phoneEl && phoneEl.value) ? phoneEl.value.trim() : ''
    };

    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));

    // Validate fields
    let isValid = true;

    // Validate Full Name
    if (!formData.fullName) {
      const errorEl = fullNameEl.parentElement.querySelector('.error-message');
      if (errorEl) errorEl.classList.remove('hidden');
      isValid = false;
    }

    // Validate Email
    if (!formData.email || !isValidEmail(formData.email)) {
      const errorEl = emailEl.parentElement.querySelector('.error-message');
      if (errorEl) errorEl.classList.remove('hidden');
      isValid = false;
    }

    // Validate Phone - MUST be exactly 10 digits
    if (!formData.phone) {
      const errorEl = phoneEl.parentElement.querySelector('.error-message');
      if (errorEl) {
        errorEl.textContent = 'Phone number is required';
        errorEl.classList.remove('hidden');
      }
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      const errorEl = phoneEl.parentElement.querySelector('.error-message');
      if (errorEl) {
        errorEl.textContent = 'Phone number must be exactly 10 digits';
        errorEl.classList.remove('hidden');
      }
      isValid = false;
    }

    if (!isValid) {
      return;
    }

  const submitBtn = form.querySelector("button[type='submit']") || document.querySelector("button[type='submit']");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span class=\"spinner-border spinner-border-sm\"></span> Sending...";
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycby_VgBYAOZuSyjuPKhz9NLXpvRSGu9UD465HKiq49ZgqP0CiBijQzcU-zu6Vw365c89QA/exec", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (result.status === "success") {
      Swal.fire({
        html: `
          <div style="padding: 30px; text-align:center;">
            <h2 style="font-size: 1.6rem; font-weight:600; color:#000; margin-bottom:12px;">
              Thank you, ${formData.fullName}
            </h2>
            <p style="font-size: 1rem; color:#444; margin-bottom:0; line-height:1.6;">
              We’ve received your message.<br>
              Our team will connect with you shortly.
            </p>
            <p style="margin-top:18px; font-weight:bold; font-size:1.1rem; color:#000;">
              – The Ember Construction Team
            </p>
          </div>
        `,
        background: "#ffffff",
        color: "#222",
        width: 500,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Close",
        confirmButtonColor: "#000000ff",
        customClass: {
          popup: "rounded-2xl shadow-2xl border-0",
          confirmButton: "px-5 py-2 rounded-md font-medium"
        }
      }).then(() => form.reset());
    } else {
      throw new Error(result.message || "Something went wrong, please try again.");
    }
  } catch (error) {
    Swal.fire({
      title: "Oops!",
      text: error.message,
      icon: "error",
      confirmButtonColor: "#b59b6e"
    });
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit";
    }
  }
  });
});




