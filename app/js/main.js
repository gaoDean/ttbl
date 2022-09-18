Neutralino.init();
Neutralino.events.on("windowClose", () => {
    Neutralino.window.hide();
});

import { scheduleSync } from "./cli.js"
scheduleSync("05", "00", "00")
