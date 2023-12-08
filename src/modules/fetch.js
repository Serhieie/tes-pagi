import axios from 'axios';
import COMMONS from './commons.js';
import { createMarkup } from './markup.js';
import HELPERS from './helpers.js';

const footerContainer = document.querySelector('.footer_container');
const forward = document.querySelector('.forward');
const back = document.querySelector('.back');

let isFetching = false;
let lastTotalHits = 0;
let perPage = 8;

if (!COMMONS.currentPage) {
  forward.setAttribute('disabled', true);
  back.setAttribute('disabled', true);
}

footerContainer.addEventListener('click', async function (event) {
  const selectedPage = parseInt(event.target.textContent);
  let lastPage = Math.ceil(lastTotalHits / perPage);
  if (event.target.classList.contains('pagination_button')) {
    if (event.target.classList.contains('back')) {
      if (COMMONS.currentPage === 1) {
        return;
      } else if (COMMONS.currentPage > 0) {
        COMMONS.currentPage -= 1;
      }
    } else if (event.target.classList.contains('forward')) {
      if (COMMONS.currentPage === lastPage) {
        forward.setAttribute('disabled', true);
        return;
      } else if (COMMONS.currentPage < lastPage) {
        forward.removeAttribute('disabled');
      }
      COMMONS.currentPage += 1;
    }

    COMMONS.container.innerHTML = '';
    await getImages(COMMONS.currentPage);
  }

  if (event.target.classList.contains('pagi_item_span')) {
    if (selectedPage === COMMONS.currentPage) {
      return;
    }

    COMMONS.currentPage = selectedPage;
    COMMONS.container.innerHTML = '';
    await getImages(COMMONS.currentPage);
    updatePagination();
  }
});

function createPaginationMarkup(data, pagination, page) {
  const { totalHits } = data;
  const lastPage = Math.ceil(totalHits / pagination);

  const paginationList = document.querySelector('.pagination');
  paginationList.innerHTML = '';

  if (lastPage > 1) {
    let paginationHTML = '';

    let startPage = 1;
    let endPage = lastPage;

    if (lastPage > 5) {
      startPage = Math.max(1, page - 2);
      endPage = Math.min(lastPage, page + 2);

      if (startPage === 1) {
        endPage = 5;
      } else if (endPage === lastPage) {
        startPage = lastPage - 4;
      }
    }

    if (startPage >= 2) {
      paginationHTML += createPaginationItem(1, page === 1);
      paginationHTML += createEllipsisItem();
    }

    for (let i = startPage; i <= endPage; i += 1) {
      paginationHTML += createPaginationItem(i, i === page);
    }

    if (endPage < lastPage) {
      paginationHTML += createEllipsisItem();
      paginationHTML += createPaginationItem(lastPage, lastPage === page);
    }

    paginationList.innerHTML = paginationHTML;
  }
}

function createPaginationItem(pageNumber, isActive) {
  const activeClass = isActive ? ' isActive' : '';
  const paddingChange = COMMONS.currentPage >= 10 ? 'py' : '';
  return `<li class="pagi_item${activeClass} "><span class="pagi_item_span ${paddingChange}">${pageNumber}</span></li>`;
}

function createEllipsisItem() {
  return `<li class="pagi_item"><span class="pagi_item_span">...</span></li>`;
}

async function getImages(page) {
  if (isFetching) {
    return;
  }
  const input = COMMONS.form.elements['searchQuery'];
  const inputValue = input.value;
  const params = new URLSearchParams({
    key: `${COMMONS.API_KEY_PIXABAY}`,
    q: `${inputValue}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: perPage,
  });
  try {
    showLoader();
    const response = await fetchData(page, params);
    handleResponse(response);
    return response.data;
  } catch (error) {
    HELPERS.onError(error);
  }
}

function handleResponse(response) {
  lastTotalHits = response.data.totalHits;
  if (!response.data.hits.length) {
    HELPERS.emptyResponse();
    return;
  }

  if (response.data.totalHits <= COMMONS.currentPage * perPage) {
    HELPERS.lastPhotos();
  }

  createPaginationMarkup(response.data, perPage, COMMONS.currentPage);
  createMarkup(response.data);
  hideLoader();
  updatePagination();
}

function fetchData(page, params) {
  const response = axios.get(`${COMMONS.BASE_URL}/?${params}&page=${page}`);
  return response;
}

function updatePagination() {
  const paginationItems = document.querySelectorAll('.pagi_item');

  paginationItems.forEach(item => {
    item.classList.remove('isActive');
    if (parseInt(item.textContent) === COMMONS.currentPage) {
      item.classList.add('isActive');
    }
  });

  // Дізейбл кнопки назад, якщо сторінка перша
  if (COMMONS.currentPage <= 1) {
    back.setAttribute('disabled', true);
  } else {
    back.removeAttribute('disabled');
  }

  // Використання збережених totalHits
  const lastPage = Math.ceil(lastTotalHits / perPage);

  if (COMMONS.currentPage === lastPage) {
    return forward.setAttribute('disabled', true);
  } else {
    return forward.removeAttribute('disabled');
  }
}

function resetPageAndContainer() {
  COMMONS.currentPage = 0;
  COMMONS.container.innerHTML = '';
}

function showLoader() {
  COMMONS.loader.classList.remove('visually-hidden');
  isFetching = true;
}
function hideLoader() {
  COMMONS.loader.classList.add('visually-hidden');
  isFetching = false;
}
export { getImages, resetPageAndContainer };
