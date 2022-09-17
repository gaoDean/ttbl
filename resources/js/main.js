import * as tray from "./tray.js"

Neutralino.init();
Neutralino.events.on("windowClose", () => {
    Neutralino.window.hide();
});

tray.setClassesToTray();
