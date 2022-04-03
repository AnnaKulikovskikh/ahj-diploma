import API from './api';

/* eslint-disable max-len */
export default class Geoposition {
  constructor(parent) {
    this.positionByUser = null;
    this.positionByGeo = null;
    this.parent = parent;
  }

  create() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.positionByGeo = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        this.createMessage(this.positionByGeo);
      }, () => {
      });
    }
  }

  createMessage(geoposition) {
    this.geoposition = geoposition;
    const spanEl = document.createElement('span');
    spanEl.className = 'message';
    /* eslint-disable global-require */
    const uuid = require('uuid');
    /* eslint-disable global-require */
    spanEl.id = uuid.v4();
    spanEl.innerHTML = `
    Мои координаты: [<span data-id="geopos" class="geopos">${this.geoposition}</span>]`;
    this.parent.appendChild(spanEl);

    this.parent.scrollTop = this.parent.scrollHeight;

    const api = new API('https://ahj-diploma-server.herokuapp.com/newMessage');
    this.toServerNewMessage(spanEl.id, spanEl.textContent, api);
  }

  // eslint-disable-next-line class-methods-use-this
  toServerNewMessage(id, text, api) {
    const locId = id;
    const locText = text;
    const locApi = api;
    // console.log('mytext: ' + locText);

    async function addNewTaskToServer() {
      // eslint-disable-next-line no-unused-vars
      const newMessage = await locApi.addNewMessage({
        id: locId,
        text: locText,
      });
    }

    addNewTaskToServer();
  }
}
