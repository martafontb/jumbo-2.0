/*
 * Collection filter pills (snippets/collection-filters.liquid).
 * The form works without JS. This adds: submit on checkbox change, only one
 * panel open at a time, and close on Escape or a click outside.
 */
const forms = document.querySelectorAll('form[data-collection-filters]');

function closeAll(except) {
  document.querySelectorAll('[data-filter-item][open]').forEach((item) => {
    if (item !== except) item.removeAttribute('open');
  });
}

forms.forEach((form) => {
  form.addEventListener('change', (event) => {
    if (event.target.matches('input[type="checkbox"]')) form.requestSubmit();
  });

  form.addEventListener('toggle', (event) => {
    if (event.target.open) closeAll(event.target);
  }, true);
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-filter-item]')) closeAll();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const open = document.querySelector('[data-filter-item][open]');
  if (!open) return;
  open.removeAttribute('open');
  open.querySelector('summary')?.focus();
});
