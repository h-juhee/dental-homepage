export function initPhilosophyStory() {
  const section = document.querySelector('[data-philosophy-story]');
  if (!section) return;

  const story = section.querySelector('.philosophy-story');
  const sticky = section.querySelector('.philosophy-story__sticky');
  const messages = [...section.querySelectorAll('[data-philosophy-message]')];
  const media = section.querySelector('.philosophy-story__placeholder');
  if (!story || !sticky || messages.length === 0) return;

  const gsap = typeof window.gsap === 'object' ? window.gsap : null;
  const ScrollTrigger = window.ScrollTrigger;
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let storyTrigger = null;
  let mediaTween = null;

  const activateStep = (index) => {
    if (index === activeIndex && messages[index]?.classList.contains('is-active')) return;
    activeIndex = index;

    messages.forEach((message, messageIndex) => {
      const isActive = messageIndex === index;
      message.classList.toggle('is-active', isActive);
      message.setAttribute('aria-hidden', String(!isActive));
    });

  };

  const showAllMessages = () => {
    story.classList.add('is-fallback');
    messages.forEach((message) => message.removeAttribute('aria-hidden'));
  };

  const clearInteractions = () => {
    storyTrigger?.kill();
    mediaTween?.scrollTrigger?.kill();
    mediaTween?.kill();
    storyTrigger = null;
    mediaTween = null;
  };

  const createInteractions = () => {
    clearInteractions();
    story.classList.remove('is-fallback');
    activeIndex = -1;
    activateStep(0);

    storyTrigger = ScrollTrigger.create({
      trigger: story,
      start: 'top top',
      end: () => `+=${Math.max(window.innerHeight, 760) * messages.length}`,
      pin: sticky,
      pinSpacing: true,
      refreshPriority: 2,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate(self) {
        const nextIndex = Math.min(messages.length - 1, Math.floor(self.progress * messages.length));
        if (nextIndex !== activeIndex) activateStep(nextIndex);
      }
    });

    if (media) {
      mediaTween = gsap.fromTo(media, { scale: 1.04 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: story,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight, 760) * messages.length}`,
          scrub: true
        }
      });
    }
  };

  const updateMode = () => {
    clearInteractions();

    if (mobileQuery.matches || reducedMotionQuery.matches || !gsap || !ScrollTrigger) {
      showAllMessages();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    createInteractions();
    ScrollTrigger.refresh();
  };

  mobileQuery.addEventListener('change', updateMode);
  reducedMotionQuery.addEventListener('change', updateMode);
  updateMode();
}
