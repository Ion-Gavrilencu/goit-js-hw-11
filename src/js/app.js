
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css"
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
const perPage = 40;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', fetchImages);

async function onSearch(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.hidden = true;

  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  fetchImages();
}

async function fetchImages() {
  const API_KEY = '44948135-f70b83598142b22294c8ec344'; // Replace with your Pixabay API key
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(URL);
    const data = response.data;

    if (data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    renderGallery(data.hits);
    page += 1;
    loadMoreBtn.hidden = data.hits.length < perPage;
    if (data.hits.length < perPage) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
  }
}

function renderGallery(images) {
  const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
      <a href="${largeImageURL}" class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes</b> ${likes}</p>
          <p class="info-item"><b>Views</b> ${views}</p>
          <p class="info-item"><b>Comments</b> ${comments}</p>
          <p class="info-item"><b>Downloads</b> ${downloads}</p>
        </div>
      </a>
    `;
  }).join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}


