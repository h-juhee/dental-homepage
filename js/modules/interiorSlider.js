export function initInteriorSlider() {
  const slider = document.querySelector('[data-interior-slider] .interior-slider');
  const track = slider?.querySelector('.swiper-wrapper');
  const originals = track ? [...track.querySelectorAll('.interior-card')] : [];
  if (!slider || !track || originals.length === 0) return;

  slider.classList.add('is-marquee');

  originals.forEach((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('interior-card--clone');
    track.append(clone);
  });

  let offset = 0;
  let loopDistance = 0;
  let previousTime = 0;
  const speed = 72;

  const measure = () => {
    const first = originals[0];
    const firstClone = track.querySelector('.interior-card--clone');
    if (!first || !firstClone) return;

    loopDistance = firstClone.offsetLeft - first.offsetLeft;
    if (loopDistance > 0) offset %= loopDistance;
  };

  const animate = (time) => {
    if (!previousTime) previousTime = time;
    const elapsed = Math.min((time - previousTime) / 1000, 0.1);
    previousTime = time;

    if (loopDistance > 0) {
      offset = (offset + (speed * elapsed)) % loopDistance;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }

    window.requestAnimationFrame(animate);
  };

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(slider);
  window.addEventListener('load', measure, { once: true });
  measure();
  window.requestAnimationFrame(animate);
}
