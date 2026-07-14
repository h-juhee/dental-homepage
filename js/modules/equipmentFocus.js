export function initEquipmentFocus() {
  const equipment = document.querySelector('[data-equipment]');
  if (!equipment) return;

  const stage = equipment.querySelector('.equipment__stage');
  const sticky = equipment.querySelector('.equipment__sticky');
  const content = equipment.querySelector('.equipment__content');
  const items = [...equipment.querySelectorAll('[data-equipment-index]')];
  const panels = [...equipment.querySelectorAll('[data-equipment-panel]')];
  const steps = [...equipment.querySelectorAll('.equipment__steps span')];
  const triggers = [...equipment.querySelectorAll('[data-equipment-step-trigger]')];
  if (items.length === 0 || triggers.length === 0) return;

  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const ratios = new Map();
  let activeIndex = 0;
  let observer = null;

  const updateContentPosition = (index) => {
    if (!stage || !content || mobileQuery.matches) return;
    const item = items[index];
    if (!item) return;

    const equipmentRect = equipment.getBoundingClientRect();
    const stickyRect = sticky?.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const targetWidth = itemRect.width;
    content.style.width = `${targetWidth}px`;
    const offset = itemRect.left - equipmentRect.left;
    const verticalOffset = itemRect.bottom - stageRect.bottom;
    content.style.transform = `translate(${offset}px, ${verticalOffset}px)`;

    if (sticky && stickyRect) {
      sticky.style.setProperty('--equipment-focus-x', `${itemRect.left + (itemRect.width / 2) - stickyRect.left}px`);
      sticky.style.setProperty('--equipment-focus-screen-x', `${itemRect.left + (itemRect.width / 2)}px`);
      sticky.style.setProperty('--equipment-focus-y', `${itemRect.top + (itemRect.height / 2) - stickyRect.top}px`);
    }
  };

  const activateStep = (index) => {
    if (index < 0 || index >= items.length) return;
    activeIndex = index;

    items.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
    panels.forEach((panel, panelIndex) => panel.classList.toggle('is-active', panelIndex === index));
    steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
    updateContentPosition(index);
  };

  const showAll = () => {
    items.forEach((item) => item.classList.add('is-active'));
    panels.forEach((panel) => panel.classList.add('is-active'));
    if (content) content.style.transform = '';
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

  window.addEventListener('resize', () => updateContentPosition(activeIndex));

  mobileQuery.addEventListener('change', updateMode);
  updateMode();
}
