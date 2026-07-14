export function initHeader() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const menuButton = header.querySelector('.site-header__menu-button');
  const navigation = header.querySelector('.site-nav');
  if (!menuButton || !navigation) return;

  const mobileQuery = window.matchMedia('(max-width: 767px)');

  const closeMenu = () => {
    if (!navigation.classList.contains('is-open')) return;
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '메뉴 열기');
  };

  const openMenu = () => {
    navigation.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', '메뉴 닫기');
  };

  menuButton.addEventListener('click', () => {
    if (navigation.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !navigation.classList.contains('is-open')) return;
    closeMenu();
    menuButton.focus();
  });

  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) closeMenu();
  });
}
