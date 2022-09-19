/* requires { Neutralino }

	== init == */

Neutralino.init();
Neutralino.events.on("windowClose", () => {
    Neutralino.window.hide();
});

import { scheduleSync } from "./helper/time.js";
scheduleSync("08", "00", "00");
