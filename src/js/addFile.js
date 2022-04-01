export default class AddFile {
  constructor() {
    this.form = document.querySelector('[data-id=formFile]');
    this.fileEl = document.querySelector('[data-id=fileFile]');
    this.overlapEl = document.querySelector('[data-id=overlapFile]');
    this.fileContainer = document.querySelector('[data-id=file-containerFile]');
    this.messageList = document.querySelector('[data-id=messageList]');

    this.files = [];
    this.idCount = 0;
  }

  create() {
    this.addListenerOverlapEl();
    this.addListenerFileEl();
  }

  downloadFile(obj) {
    const file = this.files[obj];
    const a = document.createElement('a');
    a.download = file.name;
    a.href = URL.createObjectURL(file);
    a.rel = 'noopener';
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    setTimeout(() => a.dispatchEvent(new MouseEvent('click')));
  }

  // eslint-disable-next-line class-methods-use-this
  sizeConverter(weight) {
    const size = weight / 1024 / 1024;
    return `${size.toFixed(1)} Mb`;
  }

  addFiles(files) {
    for (let i = 0; i < files.length; i += 1) {
      const spanEl = document.createElement('span');
      spanEl.className = 'message';
      spanEl.id = this.idCount; // uuid.v4();
      this.idCount += 1;

      spanEl.setAttribute('messageType', 'regular');

      spanEl.innerHTML = `
      <span class="name">${files[i].name}</span>
      <span class="size">${this.sizeConverter(files[i].size)}</span>
      <span class="link">Download</span>`;

      this.messageList.appendChild(spanEl);

      // прокрутка вниз к новым сообщениям
      this.messageList.scrollTop = this.messageList.scrollHeight;

      this.addDownloadListener(spanEl.id);

      // ПРОБУЕМ ОТПРАВИТЬ НА СЕРВЕР
      const formData = new FormData(this.form);
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'https://ajh-diploma.herokuapp.com'); // 'http://localhost:7075');

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          URL.revokeObjectURL(`https://ajh-diploma.herokuapp.com${xhr.response}`);
        }
      });

      xhr.send(formData);
      // ПРОБУЕМ ОТПРАВИТЬ НА СЕРВЕР

      this.fileEl.value = '';
    }
  }

  // события для запуска окна выбора файлов
  addListenerOverlapEl() {
    this.overlapEl.addEventListener('click', () => {
      this.fileEl.dispatchEvent(new MouseEvent('click'));
    });
  }

  addListenerFileEl() {
    this.fileEl.addEventListener('change', (evt) => {
      this.files = Array.from(evt.currentTarget.files);
      this.overlapEl.style.display = 'none';

      this.addFiles(this.files);
    });
  }

  addDownloadListener(id) {
    const downloadLink = document.getElementById(id);
    downloadLink.addEventListener('click', () => {
      // const obj = evt.toElement.parentNode.id;
      this.downloadFile(id);
    });
  }
}
