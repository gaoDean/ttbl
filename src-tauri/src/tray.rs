use serde::{Deserialize, Serialize};
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[derive(Clone, Serialize, Deserialize)]
pub struct TrayText {
    done: bool,
    id: String,
    text: String,
}

#[derive(Clone, Serialize)]
struct EventPayload {
    data: String,
}

#[tauri::command]
pub fn add_to_tray(
    items: Vec<TrayText>,
    date: String,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let mut menu: SystemTrayMenu = SystemTrayMenu::new();

    menu = tray_add_item(menu, "date", &date);

    if items.is_empty() {
        menu = tray_add_item(menu, "message", "No classes today.");
    } else {
        menu = menu.add_native_item(SystemTrayMenuItem::Separator);

        for class in items {
            if class.done {
                menu = menu.add_item(CustomMenuItem::new(class.id, class.text).disabled())
            } else {
                menu = tray_add_item(menu, &class.id, &class.text);
            }
        }
    }

    menu = menu.add_native_item(SystemTrayMenuItem::Separator);

    // add the remaining opts
    let opts: [&str; 3] = ["more", "sync", "quit"];
    let desc: [&str; 3] = ["More...", "Sync Timetable", "Quit Timetable"];
    for i in 0..opts.len() {
        menu = tray_add_item(menu, opts[i], desc[i]);
    }

    // if dry run, return the data, else match the result of setting the tray
    // if matched ok, return the data, will be passed to set_gui in the front
    match if false {
        Result::Ok(())
    } else {
        app_handle.tray_handle().set_menu(menu)
    } {
        Ok(_) => Ok(()),
        Err(_) => Err(String::from("Failed to set tray menu")),
    }
}

pub fn tray_add_item(menu: SystemTrayMenu, id: &str, desc: &str) -> SystemTrayMenu {
    menu.add_item(CustomMenuItem::new(id.to_string(), desc))
}

// the tray without the classes
pub fn default_tray() -> SystemTray {
    let opts: [&str; 3] = ["more", "sync", "quit"];
    let desc: [&str; 3] = ["More...", "Sync Timetable", "Quit Timetable"];
    let mut menu = SystemTrayMenu::new();

    menu = tray_add_item(menu, "info", "There's nothing here.");
    menu = menu.add_native_item(SystemTrayMenuItem::Separator);

    for i in 0..opts.len() {
        menu = tray_add_item(menu, opts[i], desc[i]);
    }

    SystemTray::new().with_menu(menu)
}

pub fn handle_tray_event(app_handle: &tauri::AppHandle, evt: SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = evt {
        match id.as_str() {
            "quit" => {
                app_handle.exit(0);
            }
            "sync" => {
                app_handle.emit_all("sync-timetable-clicked", "").unwrap();
            }
            "more" => {
                let window = (*app_handle).get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            class_id => {
                app_handle
                    .emit_all(
                        "tray-class-clicked",
                        EventPayload {
                            data: String::from(class_id),
                        },
                    )
                    .unwrap();
            }
        }
    }
}
