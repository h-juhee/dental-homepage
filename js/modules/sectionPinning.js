export function initSectionPinning() {
  const sections = [...document.querySelectorAll(
    '#signature-treatment[data-section-pin], #interior[data-section-pin]'
  )];
  if (sections.length === 0) return;

  const gsap = typeof window.gsap === 'object' ? window.gsap : null;
  const ScrollTrigger = window.ScrollTrigger;
  const mobileQuery = window.matchMedia('(max-width: 1279px)');
  let pinTriggers = [];

  const clearPins = () => {
    pinTriggers.forEach((trigger) => trigger.kill(true));
    pinTriggers = [];
  };

  const createPins = () => {
    clearPins();
    gsap.registerPlugin(ScrollTrigger);

    pinTriggers = sections.map((section) => ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight}`,
      pin: true,
      pinType: 'fixed',
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }));

    ScrollTrigger.refresh();
  };

  const updateMode = () => {
    clearPins();
    if (mobileQuery.matches || !gsap || !ScrollTrigger) return;
    createPins();
  };

  mobileQuery.addEventListener('change', updateMode);
  updateMode();
}
