import axios from 'axios';

const API_KEY = '44948135-f70b83598142b22294c8ec344';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page = 1, perPage = 40) => {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const response = await axios.get('', { params });
  return response.data;
};
