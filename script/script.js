/* create HTML */

/*meta tags*/
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

const favicon =`<link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
<link rel="manifest" href="favicon/site.webmanifest">
<link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">`

document.head.insertAdjacentHTML('afterbegin', favicon);

const title = document.createElement('title');
title.innerText = 'Virtual keyboard';
document.head.appendChild(title);


