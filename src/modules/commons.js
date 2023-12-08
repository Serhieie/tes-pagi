const BASE_URL = 'https://pixabay.com/api';
const API_KEY_PIXABAY = '39707189-cf35fc273df01ca9fa36884c9';
const loader = document.querySelector('.loader');
const container = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
let currentPage = 1;

export default {
  BASE_URL,
  API_KEY_PIXABAY,
  loader,
  container,
  form,
  currentPage,
};
