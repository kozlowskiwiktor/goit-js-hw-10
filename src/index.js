import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const countryInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const fetchCountry = (name) => {
  let countryName = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(countryName)
    .then(response => {
      if (response.url === 'https://restcountries.com/v3.1/name/?fields=name,capital,population,flags,languages') {
        Notiflix.Notify.info("Please enter a country name")
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
      } else if (!response.ok) {
        throw new Error(response.status);
      } 
      return response.json();
    })
}
  
countryInput.addEventListener('input',
  debounce(() => {
    fetchCountry(countryInput.value.trim())
      .then(countries => {
        selectedCountry(countries);
      })
      .catch(error => {
        if (error) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
        console.log(error)
      });
    }, DEBOUNCE_DELAY)
);
    
const selectedCountry = (countries) => {
  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length <= 10 && countries.length >= 2) {
    const markupList = countries
      .map(country => {
        return ` 
      <li>
      <div><img src="${country.flags.svg}" width="50" height="40">
      <p>${country.name.official}</p>
      </div>
      </li>`;
      })
      .join('');
    countryList.innerHTML = markupList;
    countryInfo.innerHTML = '';
  } else if (countries.length === 1) {
    const markupInfo = countries
    .map(country => {
      return `
      <div>
      <img src="${country.flags.svg}" width="50" height="40">
      <p>${country.name.common}</p>
      </div>
      <p>Capital: ${country.capital[0]}</p>
      <p>Population: ${country.population}</p>
      <p>Languages: ${Object.values(country.languages)}</p>
      </div>`
    })
      .join('');
countryList.innerHTML = '';
countryInfo.innerHTML = markupInfo;
  }
}