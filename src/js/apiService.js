const API_KEY = '21802653-5c558d298eb91101dd530c9b2';
const BASE_URL = 'https://pixabay.com/api/';

import queryString from 'query-string'

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {

    const searchParams = queryString.stringify({
      image_type: 'photo',
      orientation: 'horizontal',
      q: this.searchQuery,
      page: this.page,
      per_page: 12,
      key: API_KEY
    })

    const url = `${BASE_URL}?${searchParams}`;

    const { hits } = await fetch(url).then(response => response.json())

    return hits

  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}