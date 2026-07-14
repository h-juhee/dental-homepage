export function initInteriorSlider() {
  const section = document.querySelector('[data-interior-slider]');
  if (!section || typeof window.Swiper !== 'function') return;

  const sliderElement = section.querySelector('.interior-slider');
  const previousButton = section.querySelector('.interior-button--prev');
  const nextButton = section.querySelector('.interior-button--next');
  const currentElement = section.querySelector('[data-interior-current]');
  const totalElement = section.querySelector('[data-interior-total]');
  const slides = [...section.querySelectorAll('.interior-card')];
  if (!sliderElement || !previousButton || !nextButton || slides.length === 0) return;

  if (totalElement) totalElement.textContent = String(slides.length).padStart(2, '0');

  const updateCounter = (swiper) => {
    if (currentElement) currentElement.textContent = String(swiper.realIndex + 1).padStart(2, '0');
  };

  new window.Swiper(sliderElement, {
    slidesPerView: 'auto',
    spaceBetween: 16,
    speed: 800,
    loop: true,
    grabCursor: true,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: { prevEl: previousButton, nextEl: nextButton },
    a11y: {
      enabled: true,
      prevSlideMessage: '이전 인테리어 사진',
      nextSlideMessage: '다음 인테리어 사진'
    },
    breakpoints: {
      768: { spaceBetween: 24 },
      1280: { spaceBetween: 32 }
    },
    on: {
      init: updateCounter,
      slideChange: updateCounter
    }
  });
}
