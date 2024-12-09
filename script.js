'use strict';
const countriesContainer = document.querySelector('.countries');
const searchQueiry = document.querySelector('[type="search"]');
const getCountryBtn = document.getElementById('get-country-btn');
getCountryBtn.addEventListener('click', handleGetingCountry);
function handleGetingCountry() {
  countriesContainer.innerHTML = '';
  if (searchQueiry.value === '') {
    renderError('search for a country');
  } else getCurrentData(searchQueiry.value);
}
window.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    handleGetingCountry();
  }
});
function getCurrentData(country) {
  getJson(
    `https://restcountries.com/v3.1/name/${country}`,
    'country is not found '
  )
    .then(data => {
      getCountryInfo(data[0]);

      const [next] = data[0].borders || '';
      if (!next) throw new Error('country has no borders');

      return getJson(
        `https://restcountries.com/v3.1/alpha/${next}`,
        'border curntry is worng '
      );
    })

    .then(data => {
      getCountryInfo(data[0], 'neighbour');
    })
    .catch(er => {
      renderError(`${er.message}`);
    });
}

function getCountryInfo(data, neighbour = '') {
  const [language] = Object.values(data.languages);
  const { name } = Object.values(data.currencies)[0];
  const html = `
      <article class="country ${neighbour ? neighbour : ''}">
          <img class="country__img" src="${data.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${data.population} people</p>
            <p class="country__row"><span>🗣️</span>${language}</p>
            <p class="country__row"><span>💰</span>${name}</p>
          </div>
        </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}
function getJson(url, error = 'Something went wrong') {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${error} ${res.status}`);
    return res.json();
  });
}

function renderError(msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
}
