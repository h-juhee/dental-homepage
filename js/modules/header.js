export function initHeader() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const menuButton = header.querySelector('.site-header__menu-button');
  const navigation = header.querySelector('.site-nav');
  if (!menuButton || !navigation) return;

  // Mobile menu behavior will be added in a later phase.
}
