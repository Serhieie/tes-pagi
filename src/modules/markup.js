import COMMONS from './commons.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function createMarkup(data) {
  const markup = data.hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    <a href="${largeImageURL}" class="simplelightbox-link"> 
    <img src="${webformatURL}" alt="${tags}" style="object-fit: cover;" loading="lazy" width="320" height ="250"/>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>  ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${downloads}
    </p>
  </div>
</div></a>
 `
    )
    .join('');
  // COMMONS.container.insertAdjacentHTML('beforeend', markup);
  COMMONS.container.innerHTML = markup;

  let gallery = new SimpleLightbox('.simplelightbox-link', {
    overlayOpacity: 1,
    closeText: '',
    maxZoom: 2,
    showCounter: false,
  });
  gallery.on('show.simplelightbox');

  return markup;
}
