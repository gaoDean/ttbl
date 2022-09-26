
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent};
use tauri::Manager;

pub fn tray_add_item(menu: SystemTrayMenu, id: &str, desc: &str) -> SystemTrayMenu {
    return menu.add_item(CustomMenuItem::new(id.to_string(), desc));
}

pub fn init_tray(opts: &[&str], desc: &[&str]) -> SystemTray {
    let mut menu = SystemTrayMenu::new()
        .add_native_item(SystemTrayMenuItem::Separator);

    for i in 0..opts.len() {
        menu = tray_add_item(menu, opts[i], desc[i]);
    }

    return SystemTray::new().with_menu(menu);
}

pub fn handle_tray_event(app: &tauri::AppHandle, evt: tauri::SystemTrayEvent) {
    match evt {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            // get a handle to the clicked menu item
            // note that `tray_handle` can be called anywhere,
            // just get a `AppHandle` instance with `app.handle()` on the setup hook
            // and move it to another function or thread
            let item_handle = app.tray_handle().get_item(&id);
            match id.as_str() {
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                    // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
                    item_handle.set_title("Show").unwrap();
                },
                _ => {}
            }
        },
        _ => {}
    }
}
