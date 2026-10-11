/**
 * <contact-form>: fills the quote fields from the URL (the price
 * calculator links here with ?size=…&colours=…&run=…), and moves focus to
 * the success or error message after the form posts.
 */
class ContactForm extends HTMLElement {
  connectedCallback() {
    const params = new URLSearchParams(window.location.search);
    this.querySelectorAll('[data-prefill]').forEach((input) => {
      const value = params.get(input.dataset.prefill);
      if (value && !input.value) input.value = value.slice(0, 100);
    });

    const posted = this.querySelector('[data-posted]');
    if (posted) {
      posted.scrollIntoView({ block: 'center' });
      posted.focus({ preventScroll: true });
    }
  }
}

if (!customElements.get('contact-form')) customElements.define('contact-form', ContactForm);
