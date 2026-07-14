export function initPhilosophyStory() {
  const section = document.querySelector('[data-philosophy-story]');
  if (!section) return;

  const story = section.querySelector('.philosophy-story');
  const sticky = section.querySelector('.philosophy-story__sticky');
  const messages = [...section.querySelectorAll('[data-philosophy-message]')];
  if (!story || !sticky || messages.length === 0) return;

  const gsap = typeof window.gsap === 'object' ? window.gsap : null;
  const ScrollTrigger = window.ScrollTrigger;
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let storyTrigger = null;

  const activateStep = (index) => {
    if (index === activeIndex && messages[index]?.classList.contains('is-active')) return;
    activeIndex = index;

    messages.forEach((message, messageIndex) => {
      const isActive = messageIndex === index;
      message.classList.toggle('is-active', isActive);
      message.classList.toggle('is-before', messageIndex < index);
      message.setAttribute('aria-hidden', String(!isActive));
    });

  };

  const showAllMessages = () => {
    story.classList.add('is-fallback');
    story.classList.remove('is-closing');
    messages.forEach((message) => message.removeAttribute('aria-hidden'));
  };

  const clearInteractions = () => {
    storyTrigger?.kill();
    storyTrigger = null;
  };

  const createInteractions = () => {
    clearInteractions();
    story.classList.remove('is-fallback');
    story.classList.remove('is-closing');
    activeIndex = -1;
    activateStep(0);

    const scrollDistance = () => {
      const viewportHeight = Math.max(window.innerHeight, mobileQuery.matches ? 640 : 760);
      return viewportHeight * (mobileQuery.matches ? 1.55 : 1.85);
    };

    storyTrigger = ScrollTrigger.create({
      trigger: story,
      start: 'top top',
      end: () => `+=${scrollDistance()}`,
      pin: sticky,
      pinSpacing: true,
      refreshPriority: 2,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate(self) {
        const nextIndex = Math.min(messages.length - 1, Math.floor(self.progress * messages.length));
        if (nextIndex !== activeIndex) activateStep(nextIndex);
        story.classList.toggle('is-closing', self.progress >= 0.88);
      }
    });
  };

  const updateMode = () => {
    clearInteractions();

    if (reducedMotionQuery.matches || !gsap || !ScrollTrigger) {
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
