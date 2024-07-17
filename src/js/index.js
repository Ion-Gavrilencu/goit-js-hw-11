import { fetchImages } from '../pixabay-api';
import { notifySuccess, notifyFailure, notifyInfo } from '../notifications';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let query = '';
let page = 1;
let simpleLightbox;

const renderImages = images => {
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!simpleLightbox) {
    simpleLightbox = new SimpleLightbox('.gallery a');
  } else {
    simpleLightbox.refresh();
  }
};

const clearGallery = () => {
  gallery.innerHTML = '';
  page = 1;
};

const handleSearch = async event => {
  event.preventDefault();
  query = event.target.searchQuery.value.trim();

  if (!query) {
    notifyFailure('Please enter a search query.');
    return;
  }

  clearGallery();
  loadMoreBtn.classList.add('hidden');

  try {
    const data = await fetchImages(query, page);
    if (data.hits.length === 0) {
      notifyFailure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    notifySuccess(`Hooray! We found ${data.totalHits} images.`);
    renderImages(data.hits);
    loadMoreBtn.classList.remove('hidden');
  } catch (error) {
    notifyFailure('Something went wrong. Please try again later.');
  }
};

const handleLoadMore = async () => {
  page += 1;

  try {
    const data = await fetchImages(query, page);
    renderImages(data.hits);

    if (page * 40 >= data.totalHits) {
      loadMoreBtn.classList.add('hidden');
      notifyInfo("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    notifyFailure('Something went wrong. Please try again later.');
  }
};

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);
