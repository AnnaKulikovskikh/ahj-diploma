import API from './api';

export default class AddImages {
  constructor() {
    this.url = 'https://server-dip.herokuapp.com';
    this.fileEl = document.querySelector('[data-id=file]'); // input file
    this.form = document.querySelector('[data-id=upload-form]');
    this.overlapEl = document.querySelector('[data-id=overlap]');
    this.dropEl = document.querySelector('[data-id=drop-area]');
    this.messageList = document.querySelector('[data-id=messageList]');
  }

  create() {
    this.loadTasks();

    this.addListeners();
    this.addDnDListenters();
  }

  addImgs(files) {
    this.idCount = 0;
    this.fileEl = document.querySelector('[data-id=file]');

    for (let i = 0; i < files.length; i += 1) {
      const spanEl = document.createElement('span');
      spanEl.className = 'message';
      spanEl.id = this.idCount;

      const previewEl = document.createElement('img');
      previewEl.src = URL.createObjectURL(files[i]);
      previewEl.className = 'image';

      const formData = new FormData(this.form);
      const xhr = new XMLHttpRequest();

      xhr.open('POST', this.url);
      // TODO: subscribe to response

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          URL.revokeObjectURL(`${this.url}${xhr.response}`);

          this.idCount += 1;

          this.messageList.appendChild(spanEl);
          spanEl.appendChild(previewEl);
          // прокрутка вниз к новым сообщениям
          this.messageList.scrollTop = this.messageList.scrollHeight;

          this.fileEl.value = '';
        }
      });

      xhr.send(formData);
    }
  }

  addListeners() {
    // события для запуска окна выбора файлов
    this.overlapEl.addEventListener('click', () => {
      this.fileEl.dispatchEvent(new MouseEvent('click'));
    });

    this.fileEl.addEventListener('change', (evt) => {
      const filesArr = Array.from(evt.currentTarget.files);
      this.addImgs(filesArr);
    });
  }

  addClipListener() {
    const clipPhoto = document.querySelector('[data-id=clipPhoto]');
    clipPhoto.addEventListener('click', () => {
      this.fileEl.dispatchEvent(new MouseEvent('click'));
    });
  }

  // события для drag and drop
  addDnDListenters() {
    this.dropEl.addEventListener('dragover', (evt) => {
      evt.preventDefault();
    });

    this.dropEl.addEventListener('drop', (evt) => {
      evt.preventDefault();
      const filesArr = Array.from(evt.dataTransfer.files);
      this.addImgs(filesArr);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  loadTasks() {
    const api = new API(`${this.url}/imagesArr`);

    async function a(messageList) {
      const images = await api.load();
      const data = await images.json();
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].name !== '.gitkeep') {
          const spanEl = document.createElement('span');
          spanEl.className = 'message';
          spanEl.id = data[i].name;

          const previewEl = document.createElement('img');
          previewEl.src = `${this.url}/${data[i].name}`;
          previewEl.className = 'image';

          messageList.appendChild(spanEl);
          spanEl.appendChild(previewEl);
          // прокрутка вниз к новым сообщениям
          // eslint-disable-next-line no-param-reassign
          messageList.scrollTop = messageList.scrollHeight;
        }
      }
    }

    a(this.messageList);
  }
}
