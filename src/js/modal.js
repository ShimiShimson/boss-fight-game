import { $ } from './helpers.js';

export default class Modal {
    showModal(message) {
        const modal = $('modal');
        const modalMessage = $('modal-message');
        const overlay = $('overlay');
    
        modalMessage.innerText = message; // Set the modal message
        modal.style.color = 'black';
        modal.style.display = 'block'; // Show modal
        overlay.style.display = 'block'; // Show overlay
    }
    
    hideModal() {
        const modal = $('modal');
        const overlay = $('overlay');
    
        modal.style.display = 'none'; // Hide modal
        overlay.style.display = 'none'; // Hide overlay
    }
}