import '../node_modules/simplelightbox/dist/simple-lightbox.min.css';
import COMMONS from './modules/commons.js';
import { btnToUp } from './modules/onScrollUp.js';
import HELPERS from './modules/helpers.js';
import { getImages } from './modules/fetch.js';

COMMONS.form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  COMMONS.currentPage += 1;
  evt.preventDefault();
  if (!HELPERS.isSearchQueryValid()) {
    return;
  }

  getImages(COMMONS.currentPage);
  resetPageAndContainer();
}

getImages(HELPERS.currentPage);
