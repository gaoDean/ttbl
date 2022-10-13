const { appWindow } = window.__TAURI__.window; // eslint-disable-line no-underscore-dangle

const titlebarHTML = `
    <div data-tauri-drag-region class="titlebar secondary">
      <div class="titlebar-button" id="titlebar-hide">
        <img src="img/minimize.svg" alt="minimize" />
      </div>
      <div class="titlebar-button" class="" id="titlebar-close">
        <img src="img/close.svg" alt="close" />
      </div>
    </div>`;

// create titlebar element
const newTitlebar = document.createElement('div');
newTitlebar.innerHTML = titlebarHTML;

// insert the titlebar element at the top of the body tag
document.body.insertBefore(newTitlebar, document.body.firstChild);

// add functionality
document
  .getElementById('titlebar-hide')
  .addEventListener('click', () => appWindow.hide());

document
  .getElementById('titlebar-close')
  .addEventListener('click', () => appWindow.close());
