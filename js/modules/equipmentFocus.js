export function initEquipmentFocus() {
  const equipment = document.querySelector('[data-equipment]');
  if (!equipment) return;

  const items = [...equipment.querySelectorAll('[data-equipment-index]')];
  const panels = [...equipment.querySelectorAll('[data-equipment-panel]')];
  const steps = [...equipment.querySelectorAll('.equipment__steps span')];
  const triggers = [...equipment.querySelectorAll('[data-equipment-step-trigger]')];
  if (items.length === 0 || triggers.length === 0) return;

  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const ratios = new Map();
  let activeIndex = 0;
  let observer = null;

  const activateStep = (index) => {
    if (index < 0 || index >= items.length) return;
    activeIndex = index;

    items.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
    panels.forEach((panel, panelIndex) => panel.classList.toggle('is-active', panelIndex === index));
    steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  };

  const showAll = () => {
    items.forEach((item) => item.classList.add('is-active'));
    panels.forEach((panel) => panel.classList.add('is-active'));
  };

  const disconnectObserver = () => {
    observer?.disconnect();
    observer = null;
    ratios.clear();
  };

  const createObserver = () => {
    disconnectObserver();
    activateStep(activeIndex);

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio));

      const visibleTrigger = triggers.reduce((best, trigger) => {
        if ((ratios.get(trigger) ?? 0) > (ratios.get(best) ?? 0)) return trigger;
        return best;
      }, triggers[activeIndex] ?? triggers[0]);

      const nextIndex = Number(visibleTrigger.dataset.equipmentStepTrigger);
      if (Number.isInteger(nextIndex)) activateStep(nextIndex);
    }, { rootMargin: '-15% 0px -15%', threshold: [0, 0.25, 0.5, 0.75, 1] });

    triggers.forEach((trigger) => observer.observe(trigger));
  };

  const updateMode = () => {
    if (mobileQuery.matches) {
      disconnectObserver();
      showAll();
      return;
    }

    createObserver();
  };

  mobileQuery.addEventListener('change', updateMode);
  updateMode();
}
