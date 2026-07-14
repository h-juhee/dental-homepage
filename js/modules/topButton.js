export function initTopButton() {
  const topButton = document.querySelector('[data-top-button]');
  if (!topButton) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  topButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  });
}
