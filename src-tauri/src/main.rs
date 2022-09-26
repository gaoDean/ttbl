#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent};
use tauri::Manager;


fn get_tray(opts: [&str; 3], desc: [&str; 3]) -> SystemTray {
    let mut menu = SystemTrayMenu::new()
        .add_native_item(SystemTrayMenuItem::Separator);

    for i in 0..opts.len() {
        menu = menu.add_item(CustomMenuItem::new(opts[i].to_string(), desc[i]));
    }

    return SystemTray::new().with_menu(menu);
}

fn main() {
    let tray_opts: [&str; 3] = ["more", "sync", "quit"];
    let tray_opts_desc: [&str; 3] = ["More...", "Sync Timetable", "Quit Timetable"];
    let tray = get_tray(tray_opts, tray_opts_desc);

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event { // this is the sample snippet they give you on the docs: try to move this into a neat function without it giving you a "unknown size" error
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
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
