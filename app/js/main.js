/* requires { Neutralino }

	== init == */

Neutralino.init();
Neutralino.events.on("windowClose", () => {
    Neutralino.window.hide();
});
