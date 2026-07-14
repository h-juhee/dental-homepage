export function initSignatureTreatmentAccordion() {
  const accordion = document.querySelector('[data-signature-treatment-accordion]');
  if (!accordion) return;

  const cards = [...accordion.querySelectorAll('[data-signature-treatment-card]')];
  if (cards.length === 0) return;

  const activateCard = (targetCard) => {
    cards.forEach((card) => {
      const isActive = card === targetCard;
      const trigger = card.querySelector('.signature-treatment-card__trigger');

      card.classList.toggle('is-active', isActive);
      trigger?.setAttribute('aria-expanded', String(isActive));
    });
  };

  const initialCard = cards.find((card) => card.classList.contains('is-active')) ?? cards[0];
  activateCard(initialCard);

  cards.forEach((card) => {
    const trigger = card.querySelector('.signature-treatment-card__trigger');

    card.addEventListener('pointerenter', () => activateCard(card));
    card.addEventListener('focusin', () => activateCard(card));
    trigger?.addEventListener('click', () => activateCard(card));
  });
}
