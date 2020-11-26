'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map, mapEvent;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Get coords
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      map = L.map('map').setView([latitude, longitude], 15);

      // Handling clicks on map
      map.on('click', function (mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
      });

      L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(map);
    },
    function () {
      console.log('Could not get your location!');
    }
  );
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  // Clear input fields
  const fields = form.getElementsByTagName('input');
  Array.from(fields).forEach(field => {
    field.value = '';
    field.blur();
  });

  // Display marker
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        className: `${inputType.value}-popup`,
      })
    )
    .setPopupContent('Workout')
    .openPopup();
});

// Input field toggler
inputType.addEventListener('change', function (event) {
  inputCadence.closest('div').classList.toggle('form__row--hidden');
  inputElevation.closest('div').classList.toggle('form__row--hidden');
});
