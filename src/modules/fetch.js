import axios from 'axios';
import COMMONS from './commons.js';
import { createMarkup } from './markup.js';
import HELPERS from './helpers.js';
import { observer } from './observer.js';

async function getImages(page) {
  const input = COMMONS.form.elements['searchQuery'];
  const inputValue = input.value;
  const params = new URLSearchParams({
    key: `${COMMONS.API_KEY_PIXABAY}`,
    q: `${inputValue}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
  });
  try {
    HELPERS.showLoader();
    const response = await fetchData(page, params);
    handleResponse(response);
    return response.data;
  } catch (error) {
    HELPERS.onError(error);
  }
}

function handleResponse(response) {
  if (!response.data.hits.length) {
    HELPERS.emptyResponse();
    return;
  }

  if (response.status === 200) {
    HELPERS.successResponse(response);
  }

  if (response.data.totalHits <= COMMONS.currentPage * 40) {
    observer.unobserve(COMMONS.guard);
    HELPERS.lastPhotos();
  }

  createMarkup(response.data);
  HELPERS.hideLoader();
}

function fetchData(page, params) {
  const response = axios.get(`${COMMONS.BASE_URL}/?${params}&page=${page}`);
  return response;
}
export default { getImages };
