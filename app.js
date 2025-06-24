import { renderUI } from './estimator-ui.js';

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById('app');
  if (app) {
    renderUI(app);
  }
});