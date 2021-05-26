import * as basicLightbox from 'basiclightbox'
import './../sass/main.scss';
import ImageApiService from './apiService'
import imageCardTpl from '../partials/photo-card.hbs'

const refs = {
  galleryContainer: document.querySelector('.js-gallery-container'),
  spinnerContainer: document.querySelector('.js-spinner-container'),
  loadMoreBtn: document.querySelector('.js-load-more'),
  searchForm: document.querySelector('#search-form'),
}



const imageApiService = new ImageApiService()

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.galleryContainer.addEventListener('click', onGalleryContainer);

function onGalleryContainer(e) {
  const target = e.target;

  if (target.nodeName !== 'IMG') return;

  const largeImg = target.dataset.srcFullsize;
  const modal = basicLightbox.create(`
    <img src="${largeImg}"/>
  `)
  modal.show()
}

async function onSearchFormSubmit(e) {
  e.preventDefault();
  const formInputRef = e.currentTarget.elements.query
  formInputRef.classList.remove('is-invalid');
  imageApiService.query = formInputRef.value;

  if (imageApiService.query === '') {
    formInputRef.classList.add('is-invalid');
    return
  }

  imageApiService.resetPage();
  clearGalleryContainer();

  e.currentTarget.reset();

  const images = await imageApiService.fetchImages();
  await imageCardMarkup(images);

  refs.loadMoreBtn.classList.toggle('d-none')
  refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick)

  imageApiService.incrementPage();
}

async function onLoadMoreBtnClick(e) {
  const images = await imageApiService.fetchImages();
  await imageCardMarkup(images);

  if (!images.length) {
    refs.loadMoreBtn.classList.toggle('d-none')
  }

  refs.loadMoreBtn.scrollIntoView({
    behavior: "smooth",
    block: 'end'
  });
}

function imageCardMarkup(images) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', imageCardTpl(images));
}


function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}