export function initTreatmentExplorer() {
  const explorer = document.querySelector('[data-treatment-explorer]');
  if (!explorer) return;

  const section = explorer.closest('.section--treatments');
  const list = explorer.querySelector('.treatment-explorer__list');
  const detail = explorer.querySelector('.treatment-explorer__detail');
  const items = [...explorer.querySelectorAll('.treatment-orb')];
  const name = explorer.querySelector('[data-treatment-detail-name]');
  const description = explorer.querySelector('[data-treatment-detail-description]');
  const link = explorer.querySelector('[data-treatment-detail-link]');

  const selectItem = (selected) => {
    items.forEach((item) => {
      const isSelected = item === selected;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-pressed', String(isSelected));
    });

    name.textContent = selected.dataset.treatmentName;
    description.textContent = selected.dataset.treatmentDescription;
    link.href = selected.dataset.treatmentTarget;
  };

  items.forEach((item) => item.addEventListener('click', () => selectItem(item)));

  const gsap = typeof window.gsap === 'object' ? window.gsap : null;
  const ScrollTrigger = window.ScrollTrigger;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1280px)');
  let revealTimeline = null;
  let resizeTimer = null;

  const clearReveal = () => {
    revealTimeline?.scrollTrigger?.kill();
    revealTimeline?.kill();
    revealTimeline = null;
    items.forEach((item) => {
      item.style.removeProperty('z-index');
    });
    gsap?.set([list, detail, ...items], { clearProps: 'transform,opacity,visibility' });
    gsap?.set(items.flatMap((item) => [...item.children]), { clearProps: 'transform,opacity,visibility' });
  };

  const createReveal = () => {
    clearReveal();
    if (!section || !gsap || !ScrollTrigger || !desktop.matches || reduceMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const firstLeft = items[0].offsetLeft;
    const firstCenter = firstLeft + items[0].offsetWidth / 2;
    const centeredStart = list.clientWidth / 2 - firstCenter;

    items.forEach((item, index) => {
      item.style.zIndex = String(items.length - index);
    });

    gsap.set(list, { x: centeredStart });
    gsap.set(items.slice(1), {
      x: (index, item) => firstLeft - item.offsetLeft,
      scale: 0.82,
      rotation: (index) => [-7, 5, -5, 6, -4][index]
    });
    gsap.set(items.slice(1).flatMap((item) => [...item.children]), { autoAlpha: 0, y: 14 });
    gsap.set(detail, { autoAlpha: 0, y: 18 });

    revealTimeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.9}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    revealTimeline.to(list, { x: 0, duration: 2.1, ease: 'power1.inOut' }, 0);

    items.slice(1).forEach((item, index) => {
      revealTimeline.to(item, {
        x: 0,
        scale: 1,
        rotation: 0,
        duration: 1.45,
        ease: 'power2.inOut'
      }, index * 0.13);

      revealTimeline.to([...item.children], {
        autoAlpha: 1,
        y: 0,
        duration: 0.34,
        stagger: 0.035,
        ease: 'power1.out'
      }, 0.76 + index * 0.13);
    });

    revealTimeline.to(detail, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power1.out'
    }, 1.45);
  };

  desktop.addEventListener('change', createReveal);
  reduceMotion.addEventListener('change', createReveal);
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(createReveal, 180);
  });
  window.addEventListener('load', createReveal, { once: true });
  createReveal();
}
