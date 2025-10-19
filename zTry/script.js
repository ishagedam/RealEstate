document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Tab Switching Logic ---
    const ongoingBtn = document.getElementById('ongoingBtn');
    const completedBtn = document.getElementById('completedBtn');
    // Targets the separate <section> elements (your sfDelivered1 and sfDelivered2)
    const ongoingSection = document.getElementById('ongoingSection');
    const completedSection = document.getElementById('completedSection');

    function switchTab(activeBtn, activeContent, inactiveBtn, inactiveContent) {
        activeBtn.classList.add('active-tab');
        inactiveBtn.classList.remove('active-tab');
        
        // Start the fade-out/hide on the inactive container
        inactiveContent.classList.remove('active-content');

        // Delay the fade-in of the active container (allows the display:none to switch to display:block)
        setTimeout(() => {
            activeContent.classList.add('active-content');
        }, 10); 
    }

    // Event Listeners for tab buttons
    ongoingBtn.addEventListener('click', function() {
        switchTab(ongoingBtn, ongoingSection, completedBtn, completedSection);
    });

    completedBtn.addEventListener('click', function() {
        switchTab(completedBtn, completedSection, ongoingBtn, ongoingSection);
    });

    // --- 2. Modal/Popup Logic ---
    
    const body = document.body;
    const viewDetailsButtons = document.querySelectorAll('.viewDetails');
    const modalContainers = document.querySelectorAll('.modal-container');
    const closeButtons = document.querySelectorAll('.closeBtn');
    
    // Function to HIDE MODAL and ALLOW BODY SCROLLING
    function hideModal(modalElement) {
        modalElement.style.display = 'none';
        modalElement.classList.remove('is-open'); // Remove temporary state class
        body.classList.remove('modal-open'); 
    }

    // Function to SHOW MODAL and PREVENT BODY SCROLLING
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Gets the ID from the 'data-modal' attribute in the HTML button
            const modalId = this.getAttribute('data-modal');
            const modalToShow = document.getElementById(modalId);

            if (modalToShow) {
                modalToShow.style.display = 'flex'; // Show modal
                modalToShow.classList.add('is-open'); // Mark as open for ESC key/overlay listener
                body.classList.add('modal-open'); // Stops background scrolling
            }
        });
    });

    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalToHide = button.closest('.modal-container');
            if (modalToHide) {
                hideModal(modalToHide);
            }
        });
    });
    
    // Hide modal if user clicks outside the modal content (on the dark overlay)
    modalContainers.forEach(container => {
        container.addEventListener('click', function(event) {
            // Check if the click target is the container itself, not a child element
            if (event.target === container) {
                hideModal(container);
            }
        });
    });

    // Optional: Hide modal on ESC key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal-container.is-open'); 
            if (openModal) {
                hideModal(openModal);
            }
        }
    });
});