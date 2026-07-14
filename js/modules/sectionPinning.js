export function initSectionPinning() {
  const sections = [...document.querySelectorAll('[data-section-pin]')];
  if (sections.length === 0) return;

  const gsap = typeof window.gsap === 'object' ? window.gsap : null;
  const ScrollTrigger = window.ScrollTrigger;
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
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
      end: () => `+=${Math.round(Math.min(window.innerHeight * 0.35, 320))}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }));

    ScrollTrigger.refresh();
  };

  const updateMode = () => {
    clearPins();
    if (mobileQuery.matches || reducedMotionQuery.matches || !gsap || !ScrollTrigger) return;
    createPins();
  };

  mobileQuery.addEventListener('change', updateMode);
  reducedMotionQuery.addEventListener('change', updateMode);
  updateMode();
}
