import Widget from './widget';

const parent = document.querySelector('[data-id=widgetHolder]');
const widget = new Widget(parent);
widget.create();
