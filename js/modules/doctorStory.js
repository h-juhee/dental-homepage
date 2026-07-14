export function initDoctorStory() {
  const section = document.querySelector('[data-doctor-overview]');
  if (!section) return;

  const overview = section.querySelector('.doctor-overview');
  const intro = section.querySelector('.doctor-overview__intro');
  const profile = section.querySelector('.doctor-overview__profile');
  const introItems = [...intro.children];
  const profileItems = [...profile.children];
  const gsap = typeof window.gsap === 'object' ? window.gsap : null;
  const ScrollTrigger = window.ScrollTrigger;
  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timeline = null;

  if (!overview || !intro || !profile) return;

  const clearAnimation = () => {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;

    if (gsap) gsap.set([...introItems, ...profileItems], { clearProps: 'opacity,transform' });
  };

  const createAnimation = () => {
    clearAnimation();
    gsap.registerPlugin(ScrollTrigger);

    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 1.8, 1200)}`,
        pin: overview,
        pinSpacing: true,
        refreshPriority: 1,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    timeline
      .fromTo(introItems,
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.035, ease: 'none' },
        0.05)
      .fromTo(profileItems,
        { autoAlpha: 0, y: 56 },
        { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.045, ease: 'none' },
        0.16)
      .to({}, { duration: 0.55 });

    ScrollTrigger.refresh();
  };

  const updateMode = () => {
    clearAnimation();

    if (!desktopQuery.matches || reducedMotionQuery.matches || !gsap || !ScrollTrigger) return;
    createAnimation();
  };

  desktopQuery.addEventListener('change', updateMode);
  reducedMotionQuery.addEventListener('change', updateMode);
  updateMode();
}
