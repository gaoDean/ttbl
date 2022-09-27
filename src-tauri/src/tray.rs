use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[tauri::command]
fn add_timetable_to_tray(timetable_json: String, msg: String, extra_msg: String) {
    // let tray_handle =
}

pub fn tray_add_item(menu: SystemTrayMenu, id: &str, desc: &str) -> SystemTrayMenu {
    return menu.add_item(CustomMenuItem::new(id.to_string(), desc));
}

pub fn init_tray(opts: &[&str], desc: &[&str]) -> SystemTray {
    let mut menu = SystemTrayMenu::new().add_native_item(SystemTrayMenuItem::Separator);

    for i in 0..opts.len() {
        menu = tray_add_item(menu, opts[i], desc[i]);
    }

    return SystemTray::new().with_menu(menu);
}

pub fn handle_tray_event(app: &tauri::AppHandle, evt: tauri::SystemTrayEvent) {
    match evt {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            // let item_handle = app.tray_handle().get_item(&id);
            match id.as_str() {
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            }
        }
        _ => {}
    }
}
