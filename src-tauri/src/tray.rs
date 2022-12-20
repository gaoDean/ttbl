use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct EventPayload {
  message: String,
}

use crate::impure;

// takes the date, gets the timetable for date and adds classes in timetable to tray
#[tauri::command]
pub fn add_to_tray(
    items: Vec<impure::Class>,
    date: String,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let mut menu: SystemTrayMenu = SystemTrayMenu::new();

    menu = tray_add_item(menu, "date", &date);

    if items.is_empty() {
        menu = tray_add_item(menu, "message", "No classes today.");
    } else {
        menu = menu.add_native_item(SystemTrayMenuItem::Separator);
        // padding is to make align the classes in one column
        let padding: &str = "        ";
        // add the class to the tray
        for class in items {
            let room_padding: &str = &padding[..(padding.len() - class.room.len())];
            let text: String = format!(
                "{}\t{}{}\t{}",
                &class.period_name.clone(),
                &class.room,
                room_padding,
                &class.description
            );

            if class.done.unwrap() {
                menu = menu.add_item(CustomMenuItem::new(&class.period_name, &text).disabled())
            } else {
                menu = tray_add_item(menu, &class.period_name, &text);
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
                app_handle.emit_all("fetch-timetable", "").unwrap();
            }
            "more" => {
                let window = (*app_handle).get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            _ => {}
        }
    }
}
