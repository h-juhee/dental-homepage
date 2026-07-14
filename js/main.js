import { initHeader } from './modules/header.js';
import { initScrollReveal } from './modules/scrollReveal.js';
import { initEquipmentFocus } from './modules/equipmentFocus.js';
import { initSignatureTreatmentAccordion } from './modules/signatureTreatmentAccordion.js';
import { initDoctorStory } from './modules/doctorStory.js';
import { initHeroSlider } from './modules/heroSlider.js';
import { initTopButton } from './modules/topButton.js';
import { initPhilosophyStory } from './modules/philosophyStory.js';
import { initInteriorSlider } from './modules/interiorSlider.js';
import { initSectionPinning } from './modules/sectionPinning.js';
import { initTreatmentExplorer } from './modules/treatmentExplorer.js?v=4';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initScrollReveal();
  initEquipmentFocus();
  initSignatureTreatmentAccordion();
  initHeroSlider();
  initTopButton();
  initPhilosophyStory();
  initDoctorStory();
  initInteriorSlider();
  initSectionPinning();
  initTreatmentExplorer();
});
