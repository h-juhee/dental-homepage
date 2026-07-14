export function initHeroSlider() {
  const hero = document.querySelector('[data-main-visual]');
  if (!hero || typeof window.Swiper !== 'function') return;

  const swiperElement = hero.querySelector('.main-visual__swiper');
  const previousButton = hero.querySelector('.main-visual__button--prev');
  const nextButton = hero.querySelector('.main-visual__button--next');
  const toggleButton = hero.querySelector('[data-hero-toggle]');
  const currentElement = hero.querySelector('[data-hero-current]');
  const totalElement = hero.querySelector('[data-hero-total]');
  const progressElement = hero.querySelector('[data-hero-progress]');
  if (!swiperElement || !previousButton || !nextButton) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = typeof window.gsap === 'object' ? window.gsap : null;
  const originalSlides = [...swiperElement.querySelectorAll('.main-visual__slide')];
  const totalSlides = originalSlides.length;
  let contentTimeline = null;
  let mediaTween = null;
  let manuallyPaused = false;
  let pausedForVisibility = false;

  if (totalElement) totalElement.textContent = String(totalSlides).padStart(2, '0');

  const updateAccessibility = (swiper) => {
    swiper.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', String(index !== swiper.activeIndex));
    });
  };

  const resetAnimations = (swiper) => {
    if (!gsap) return;
    const animatedElements = [...swiper.el.querySelectorAll('[data-hero-animate]')];
    const mediaElements = [...swiper.el.querySelectorAll('.main-visual__media-inner')];
    contentTimeline?.kill();
    mediaTween?.kill();
    gsap.killTweensOf([...animatedElements, ...mediaElements]);

    if (reducedMotion) {
      gsap.set(animatedElements, { clearProps: 'opacity,transform' });
      gsap.set(mediaElements, { clearProps: 'transform' });
      return;
    }

    gsap.set(animatedElements, { opacity: 0, y: 24 });
    gsap.set(mediaElements, { scale: 1.06 });
  };

  const animateActiveSlide = (swiper) => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    if (!activeSlide || !gsap) return;
    const animatedElements = [...activeSlide.querySelectorAll('[data-hero-animate]')];
    const mediaInner = activeSlide.querySelector('.main-visual__media-inner');

    if (reducedMotion) {
      gsap.set(animatedElements, { opacity: 1, y: 0 });
      if (mediaInner) gsap.set(mediaInner, { scale: 1 });
      return;
    }

    contentTimeline = gsap.timeline();
    contentTimeline.to(animatedElements, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    if (mediaInner) mediaTween = gsap.to(mediaInner, { scale: 1, duration: 6, ease: 'none' });
  };

  const updateCounter = (swiper) => {
    if (currentElement) currentElement.textContent = String(swiper.realIndex + 1).padStart(2, '0');
  };

  const setToggleState = (isPaused) => {
    if (!toggleButton) return;
    toggleButton.setAttribute('aria-pressed', String(isPaused));
    toggleButton.setAttribute('aria-label', isPaused ? '자동 재생 시작' : '자동 재생 일시정지');
  };

  const swiper = new window.Swiper(swiperElement, {
    slidesPerView: 1,
    speed: reducedMotion ? 1 : 1000,
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    allowTouchMove: true,
    simulateTouch: true,
    watchSlidesProgress: true,
    autoplay: reducedMotion ? false : { delay: 6000, disableOnInteraction: false },
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: { prevEl: previousButton, nextEl: nextButton },
    a11y: {
      enabled: true,
      prevSlideMessage: '이전 슬라이드',
      nextSlideMessage: '다음 슬라이드',
      firstSlideMessage: '첫 번째 슬라이드입니다',
      lastSlideMessage: '마지막 슬라이드입니다'
    },
    on: {
      init(instance) {
        resetAnimations(instance);
        updateCounter(instance);
        updateAccessibility(instance);
        animateActiveSlide(instance);
      },
      slideChangeTransitionStart(instance) {
        resetAnimations(instance);
        updateCounter(instance);
        updateAccessibility(instance);
        if (progressElement) progressElement.style.transform = 'scaleX(0)';
      },
      slideChangeTransitionEnd(instance) {
        animateActiveSlide(instance);
      },
      autoplayTimeLeft(instance, timeLeft, percentage) {
        if (progressElement) progressElement.style.transform = `scaleX(${Math.max(0, 1 - percentage)})`;
      }
    }
  });

  if (reducedMotion && toggleButton) {
    toggleButton.disabled = true;
    toggleButton.setAttribute('aria-pressed', 'true');
    toggleButton.setAttribute('aria-label', '동작 줄이기 설정으로 자동 재생이 꺼져 있습니다');
  }

  toggleButton?.addEventListener('click', () => {
    if (reducedMotion || !swiper.autoplay) return;
    manuallyPaused = !manuallyPaused;
    if (manuallyPaused) swiper.autoplay.pause();
    else swiper.autoplay.resume();
    setToggleState(manuallyPaused);
  });

  document.addEventListener('visibilitychange', () => {
    if (reducedMotion || !swiper.autoplay) return;

    if (document.hidden) {
      pausedForVisibility = !manuallyPaused && swiper.autoplay.running && !swiper.autoplay.paused;
      if (pausedForVisibility) swiper.autoplay.pause();
      return;
    }

    if (pausedForVisibility && !manuallyPaused) swiper.autoplay.resume();
    pausedForVisibility = false;
  });
}
