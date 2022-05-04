import { keys } from "./keys.js";

/* create HTML */

/* meta tags */
// const metaCharset = document.createElement('meta');
// metaCharset.setAttribute('charset', 'UTF-8');
// document.head.appendChild(metaCharset);

const metaDevice = document.createElement('meta');
metaDevice.setAttribute('name', 'viewport');
metaDevice.setAttribute('content', 'width=device-width, initial-scale=1.0');
document.head.appendChild(metaDevice);

const style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('href', 'css/style.css');
document.head.appendChild(style);

const favicon = `<link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
<link rel="manifest" href="favicon/site.webmanifest">
<link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">`;

document.head.insertAdjacentHTML('beforeend', favicon);

const title = document.createElement('title');
title.innerText = 'Virtual keyboard';
document.head.appendChild(title);

const info = document.createElement('div');
info.classList.add('info');
info.insertAdjacentText('afterbegin', 'SSЫЫЫЫЫ ыыыыыыыы');

const textarea = document.createElement('textarea');
textarea.setAttribute('autofocus', '');
textarea.setAttribute('rows', '10');

const inputWithInfo = document.createElement('div');
inputWithInfo.classList.add('info-input-container');
inputWithInfo.append(info, textarea);

const container = document.createElement('div');
container.classList.add('container');

// variables

let currentKey;
const wideButtons = ['Backspace', 'Tab', 'Delete', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight', 'Space'];

// get current getLanguage
const getLanguage = () => {
  let current = 'en';
  if (localStorage.getItem('currentLanguage')) {
    current = localStorage.getItem('currentLanguage');
  } else {
    localStorage.setItem('currentLanguage', current);
  }
  return current;
};

// change language
const change = () => {
  const current = getLanguage();
  const next = (current === 'en') ? 'ru' : 'en';

  localStorage.setItem('currentLanguage', next);
  return next;
};

// button layout
const buttonLayout = (charName) => {
  const charsWrapper = document.createElement('div');
  charsWrapper.classList.add('chars-container');
  if (charName.length === 2) {
    const firstEl = document.createElement('span');
    const secondEL = document.createElement('span');
    firstEl.innerHTML = `${charName[0]}`;
    firstEl.classList.add('first-char');

    secondEL.innerHTML = `${charName[1]}`;
    secondEL.classList.add('second-char');

    charsWrapper.append(firstEl, secondEL);
  } else {
    charsWrapper.innerText = charName;
  }
  return charsWrapper;
};

/* Create Key */
// let keyq = {
//     type: 'char',
//     mutable: false,
//     keyCode: 'Digit1',
//     en: {name: '!1', input: '1', inputShift: '!',},
//     ru: {name: '!1', input: '1', inputShift: '!'},
//
//     type: 'action',
//     mutable: false,
//     keyCode: 'Backspace',
//     en: {name: 'Backspace'},
//     ru: {name: 'Backspace'}
//
// }

const mouseWatch = () => {
  container.addEventListener('mouseup', () => {
    console.log('mouseup');
  }, { once: true });
  container.addEventListener('mouseleave', () => {
    console.log('mouseleave');
  }, { once: true });
};

function createRow() {
  const rowElement = document.createElement('div');

  rowElement.classList.add('row');
  return rowElement;
}

class Key {
  constructor({
    type,
    mutable,
    keyCode,
    en,
    ru,
  }) {
    this.en = en;
    this.ru = ru;
    this.type = type;
    this.isMutable = mutable;
    this.keyElement = document.createElement('div');
    this.keyElement.classList.add('key');
    this.keyElement.setAttribute('data-keycode', keyCode);
    this.keyElement.appendChild(buttonLayout(getLanguage() === 'en' ? this.en.name : this.ru.name));

    this.keyElement.addEventListener('mousedown', (event) => {
      textarea.focus();
      // activeKeys.push(keyCode);
      // emulateKeyDown(keyCode);
      if (event.which === 1) {
        mouseWatch();
      }
    });

    this.keyElement.addEventListener('mouseenter', () => {
      currentKey = keyCode;
    });

    this.keyElement.addEventListener('mouseleave', () => {
      currentKey = '';
    });

    if (wideButtons.includes(keyCode)) {
      this.keyElement.classList.add('wide-button');
    }
  }

  nameToUpperCase() {
    if (this.isMutable) {
      this.keyElement.classList.remove('lower-case');
    }
    return this;
  }

  nameToLowerCase() {
    if (this.isMutable) {
      this.keyElement.classList.add('lower-case');
    }
    return this;
  }

  buildKey() {
    return this.keyElement;
  }
}

function createKeyboardLayout(registerCase) {
  keys.forEach((rowArr) => {
    const row = createRow();
    container.append(row);
    const rowKeysNode = rowArr
      .map((k) => new Key(k))
      .map((key) => key[registerCase]().buildKey());

    row.append(...rowKeysNode);
  });

  document.body.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(inputWithInfo);
  change();

  createKeyboardLayout('nameToUpperCase');
  document.addEventListener('keydown', (event) => {
    event.preventDefault();
    console.log(event.code);
  });
});
