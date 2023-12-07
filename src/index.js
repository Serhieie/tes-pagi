import '../node_modules/simplelightbox/dist/simple-lightbox.min.css';
import COMMONS from './modules/commons.js';
import { btnToUp } from './modules/onScrollUp.js';
import HELPERS from './modules/helpers.js';
import { observer } from './modules/observer';

COMMONS.form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  COMMONS.currentPage = 1;
  evt.preventDefault();
  if (!HELPERS.isSearchQueryValid()) {
    return;
  }
  HELPERS.resetPageAndContainer();
  observer.observe(COMMONS.guard);
}
