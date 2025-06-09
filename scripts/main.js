/* --- resume section --- */
const resume = document.getElementById('resume');

/* --- modal logic --- */
const modalButton = document.querySelectorAll('button');

// Get all buttons that trigger modals
document.querySelectorAll('button[data-target]').forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-target');
    const modal = document.getElementById(modalId);

    if (modal) {
      const modalContainer = modal.closest('.modal-container');
      modal.classList.add('show');
      modalContainer.classList.add('show');
    }
  });
});

// Close modal on background click
document.querySelectorAll('.modal-container').forEach(container => {
  container.addEventListener('click', (event) => {
    // Only close if click is directly on the background, not on the modal
    if (event.target === container) {
      container.classList.remove('show');
      const innerModal = container.querySelector('.modal');
      if (innerModal) innerModal.classList.remove('show');
    }
  });
});

// close modal on close button click
document.querySelectorAll('.modal-close-button').forEach(closeButton => {
  closeButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the container
    const modal = closeButton.closest('.modal');
    const modalContainer = modal.closest('.modal-container');
    modal.classList.remove('show');
    modalContainer.classList.remove('show');
  });
});

/* --- outer container background scroll logic --- */
const outer_container = document.querySelector('.outer-container');
const header_section = document.querySelector('.header-section');
const blur_overshoot = document.querySelectorAll('.blur-overshoot');
const buttons = document.querySelectorAll('.button');
const social_section = document.querySelector('.social-section');
const scroll_up_text = document.getElementById('scroll-up-text');
const about_me = document.querySelector('.about-me')

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    header_section.classList.add('scrolled');
    outer_container.classList.add('scrolled');
    social_section.classList.add('scrolled');
    scroll_up_text.classList.add('scrolled');
    about_me.classList.add('scrolled');

    buttons.forEach(e1 => {
      e1.classList.add('scrolled');
    });

    blur_overshoot.forEach(el => {
      el.classList.add('animate-in');
      el.classList.remove('animate-out');
    });

    document.documentElement.style.setProperty('--font-color', 'black');
    document.documentElement.style.setProperty('--font-color-alt', 'white');
    document.documentElement.style.setProperty('--button-background', 'rgba(0, 0, 0, 0.76)');
    document.documentElement.style.setProperty('--font-weight', 'bold');
  } else {
    header_section.classList.remove('scrolled');
    outer_container.classList.remove('scrolled');
    social_section.classList.remove('scrolled');
    scroll_up_text.classList.remove('scrolled');
    about_me.classList.remove('scrolled');

    buttons.forEach(e1 => {
      e1.classList.remove('scrolled');
    });

    blur_overshoot.forEach(el => {
      el.classList.remove('animate-in');
      el.classList.add('animate-out');
    });

    document.documentElement.style.setProperty('--font-color', 'white');
    document.documentElement.style.setProperty('--font-color-alt', 'black');
    document.documentElement.style.setProperty('--button-background', 'rgba(255, 255, 255, 0.6)');
    document.documentElement.style.setProperty('--font-weight', 'normal');
  }
});


