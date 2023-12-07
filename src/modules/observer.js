import COMMONS from './commons.js';
import API from './fetch.js';

let options = {
  root: null,
  rootMargin: '250px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      COMMONS.currentPage += 1;
      API.getImages(COMMONS.currentPage);
    }
  });
}

export { observer };
