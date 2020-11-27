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

class Workout {
  date = new Date();
  id = new Date().toISOString().slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // in km/h
    this.duration = duration; // io min.
    console.log(this.id);
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // in min per km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // in km/h
    this.speed = (this.distance * 60) / this.duration;
    return this.speed;
  }
}

// const running = new Running(-1, 10, 37, -1);
// console.log(running.calcPace() + ' min. for km');
// console.log(running);
// const cycling = new Cycling(-1, 45, 127, -1);
// console.log(cycling.calcSpeed() + ' km/h');

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          console.log('Could not get your location!');
        }
      );
    }
  }

  _loadMap(position) {
    // Get coords
    const { latitude, longitude } = position.coords;
    this.#map = L.map('map').setView([latitude, longitude], 15);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.#map);
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    // Input field toggler
    inputCadence.closest('div').classList.toggle('form__row--hidden');
    inputElevation.closest('div').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    event.preventDefault();

    // Get data from input fields
    // Check if data is correct
    // If actiivty is running => create running object
    // If actiivty is cycling => create cycling object

    // Clear input fields
    const fields = form.getElementsByTagName('input');
    Array.from(fields).forEach(field => {
      field.value = '';
      field.blur();
    });

    // Display marker
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}

const app = new App();
