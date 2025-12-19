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

