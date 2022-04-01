export default class API {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  load() {
    return fetch(this.url);
  }

  add(images) {
    return fetch(this.url, {
      body: JSON.stringify(images),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  addFavorite(message) {
    return fetch(this.url, {
      body: JSON.stringify(message),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  addNewMessage(message) {
    return fetch(this.url, {
      body: JSON.stringify(message),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  remove(id) {
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE',
    });
  }
}
