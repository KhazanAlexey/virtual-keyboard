import keys from './keys.js';

/* create HTML */

/* meta tags */
const metaCharset = document.createElement('meta');
metaCharset.setAttribute('charset', 'UTF-8');
document.head.appendChild(metaCharset);

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
info.insertAdjacentText('afterbegin', 'Клавиатура создана в операционной системе Windows. Для смены языка используйте alt+shift');

const textarea = document.createElement('textarea');
textarea.setAttribute('autofocus', '');
textarea.setAttribute('rows', '10');

const inputWithInfo = document.createElement('div');
inputWithInfo.classList.add('info-input-container');
inputWithInfo.append(info, textarea);

const container = document.createElement('div');
container.classList.add('container');

// variables

let isShiftLeftPressed;
let isShiftRightPressed;
let isAltLeftPressed;
let isAltRightPressed;

let isCapsLockPressed = false;

const rowKeysNodeS = [];

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
// highlightCapsLock button
const highlightCapsLock = () => {
  const capsDom = document.querySelector('div[data-keycode=\'CapsLock\']');
  if (isCapsLockPressed) {
    capsDom.classList.add('caps-lock');
  } else {
    capsDom.classList.remove('caps-lock');
  }
};

// initialize textarea insertText method
textarea.insertText = function insertText(text) {
  this.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, 'end');
};

function createRow() {
  const rowElement = document.createElement('div');

  rowElement.classList.add('row');
  return rowElement;
}

const isShiftPressed = () => isShiftRightPressed || isShiftLeftPressed;

function createKeyboardLayout(registerCase) {
  if (container.children.length !== 0) {
    container.innerHTML = '';
  }
  keys.forEach((rowArr) => {
    const row = createRow();

    container.append(row);
    const rowKeysNode = rowArr
      .map((k) => new Key(k))
      .map((key) => key[registerCase]().buildKey());
    rowKeysNodeS.push(rowKeysNode);
    row.append(...rowKeysNode);
  });

  document.body.appendChild(container);
}
const deletePrevious = () => {
  if (textarea.selectionStart === textarea.selectionEnd) {
    if (textarea.selectionStart > 0) {
      textarea.setRangeText('', textarea.selectionStart - 1, textarea.selectionEnd, 'end');
    }
  } else {
    textarea.insertText('');
  }
};

const deleteNext = () => {
  if (textarea.selectionStart === textarea.selectionEnd) {
    if (textarea.selectionStart < textarea.value.length) {
      textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd + 1, 'end');
    }
  } else {
    textarea.insertText('');
  }
};

const moveHorizontal = (direction) => {
  const delta = direction === 'left' ? -1 : 1;
  let newPosition = textarea.selectionEnd + delta;
  if (newPosition < 0) newPosition = 0;
  if (newPosition > textarea.value.length) newPosition = textarea.value.length;
  textarea.setSelectionRange(newPosition, newPosition);
};
// process action keys

function startAction(targetElement) {
  const key = targetElement.keyCode;
  switch (key) {
    case 'CapsLock':
      isCapsLockPressed = !isCapsLockPressed;
      if (!isCapsLockPressed) {
        createKeyboardLayout('nameToLowerCase');
      } else createKeyboardLayout('nameToUpperCase');

      highlightCapsLock();

      break;
    case
      'ShiftLeft'
      :
      {
        if (isAltLeftPressed) {
          change();
          isAltLeftPressed = false;
        }
        if (isCapsLockPressed) {
          createKeyboardLayout('nameToLowerCase');
        } else {
          createKeyboardLayout('nameToUpperCase');
        }
        isShiftLeftPressed = true;
        highlightCapsLock();

        const targetDomEl = document.querySelector(`div[data-keycode=${key}]`);
        targetDomEl.classList.add('pressed');
      }

      break;
    case
      'ShiftRight'
      :
      {
        if (isAltRightPressed) {
          change();
          isAltRightPressed = false;
        }
        if (isCapsLockPressed) {
          createKeyboardLayout('nameToLowerCase');
        } else {
          createKeyboardLayout('nameToUpperCase');
        }
        isShiftRightPressed = true;
        highlightCapsLock();

        const targetDomEl = document.querySelector(`div[data-keycode=${key}]`);
        targetDomEl.classList.add('pressed');
      }

      break;
    case
      'AltLeft'
      :
      isAltLeftPressed = true;
      isAltRightPressed = false;

      break;
    case
      'AltRight'
      :
      isAltRightPressed = true;
      isAltLeftPressed = false;

      break;
    case 'Backspace':
      deletePrevious();
      break;
    case 'Delete':
      deleteNext();
      break;
    case 'ArrowLeft':
      moveHorizontal('left');
      break;
    case 'ArrowRight':
      moveHorizontal('right');
      break;
    default:
  }
}
function findPressedKeyValues(keyCode) {
  let targetElement = {};
  function find(el) {
    if (el.keyCode === keyCode) {
      targetElement = el;
      return el;
    }
    return undefined;
  }
  keys.forEach((row) => row.find(find));

  if (targetElement.type === 'action' && !isShiftPressed()) {
    startAction(targetElement);
  }
  const currentLang = getLanguage();
  const shift = isShiftPressed();
  let input = 'input';

  // input=(isCapsLockPressed&&targetElement.mutable===false)?'input':'inputShift';
  // input = (shift || isCapsLockPressed) ? 'inputShift' : 'input';
  if (isCapsLockPressed && targetElement.mutable === false) input = 'input';
  if (isCapsLockPressed && targetElement.mutable === true) input = 'inputShift';

  if (shift)input = 'inputShift';
  if (isCapsLockPressed && shift) input = 'input';
  if (isCapsLockPressed && shift && targetElement.mutable === false) input = 'inputShift';
  if (targetElement.type === 'char') {
    return targetElement[currentLang][input];
  }
  return null;
}
function doGetCaretPosition(ctrl) {
  let CaretPos = 0;

  if (document.selection) {
    ctrl.focus();
    const Sel = document.selection.createRange();
    Sel.moveStart('character', -ctrl.value.length);
    CaretPos = Sel.text.length;
  } else if (ctrl.selectionStart || ctrl.selectionStart === '0') CaretPos = ctrl.selectionStart;
  return (CaretPos);
}
// keyboard key dom element
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

      if (!isCapsLockPressed) {
        isCapsLockPressed = false;
        highlightCapsLock();
      }
      if (event.which === 1) {
        const PressedKeyValue = findPressedKeyValues(keyCode);

        const pos = doGetCaretPosition(textarea);
        textarea.setSelectionRange(textarea.value.length, pos);

        if (PressedKeyValue) textarea.insertText(PressedKeyValue);
        textarea.focus();
        // mouseWatch(keyCode);
      }
    });

    this.keyElement.addEventListener('mouseup', () => {
      textarea.focus();
      isShiftLeftPressed = false;
      isShiftRightPressed = false;

      if (isCapsLockPressed) {
        createKeyboardLayout('nameToUpperCase');
        highlightCapsLock();
      } else createKeyboardLayout('nameToLowerCase');
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

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(inputWithInfo);

  createKeyboardLayout('nameToLowerCase');

  document.addEventListener('keydown', (event) => {
    const targetDomEl = document.querySelector(`div[data-keycode=${event.code}]`);
    event.preventDefault();

    targetDomEl.classList.add('pressed');
    const pressedKeyValue = findPressedKeyValues(event.code);
    if (pressedKeyValue) {
      // value=textarea.value+pressedKeyValue
      textarea.insertText(pressedKeyValue);
    }
  });

  document.addEventListener('keyup', (event) => {
    const targetDomEl = document.querySelector(`div[data-keycode=${event.code}]`);
    event.preventDefault();
    isAltLeftPressed = false;
    isAltRightPressed = false;
    if ((event.code === 'ShiftLeft' || event.code === 'ShiftRight') && (isShiftLeftPressed || isShiftRightPressed)) {
      if (isCapsLockPressed) {
        createKeyboardLayout('nameToUpperCase');
        highlightCapsLock();
      } else createKeyboardLayout('nameToLowerCase');
      isShiftLeftPressed = false;
      isShiftRightPressed = false;
    }

    targetDomEl.classList.remove('pressed');
  });
});
