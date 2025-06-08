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
