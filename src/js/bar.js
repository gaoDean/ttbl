const { appWindow } = window.__TAURI__.window; // eslint-disable-line no-underscore-dangle

const titlebarHTML = `
    <div data-tauri-drag-region class="titlebar secondary">
      <div class="titlebar-button" id="titlebar-hide">
        <img src="https://api.iconify.design/gg:minimize.svg?color=white" alt="minimize" />
      </div>
      <div class="titlebar-button" class="" id="titlebar-close">
        <img src="https://api.iconify.design/mdi:close.svg?color=white" alt="close" />
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
