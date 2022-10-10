use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

use crate::impure;
use crate::time;

// takes the date, gets the timetable for date and adds classes in timetable to tray
#[tauri::command]
pub fn add_timetable_to_tray(
    date: String,
    app_handle: tauri::AppHandle,
) -> Result<(impure::ClassesForDay, (String, String)), String> {
    // get the timetable from storage
    let timetable: impure::ClassesForDay = match impure::get_timetable() {
        Some(r) => match r.get(&date) {
            Some(s) => s.clone(),
            _ => Vec::new(),
        },
        None => return Err("Timetable not found".to_owned()),
    };
    // tuple: msg, extra msg
    let msg: (String, String) = time::get_msg(date, timetable.is_empty());

    let mut menu: SystemTrayMenu = SystemTrayMenu::new();

    // add date messages
    menu = tray_add_item(menu, "date", &msg.0);
    if !msg.1.is_empty() {
        menu = tray_add_item(menu, "extra", &msg.1);
    }

    // if timetable exists on that day
    if timetable.len() > 0 {
        menu = menu.add_native_item(SystemTrayMenuItem::Separator);

        // padding is to make align the classes in one column
        let padding: &str = "        ";
        // add the class to the tray
        for class in timetable.clone() {
            let room_padding: &str =
                &padding[..(padding.len() - class.room.len())];
            let text: String = format!(
                "{}\t{}{}\t{}",
                &class.period_name.clone(),
                &class.room,
                room_padding,
                &class.description
            );

            // add the tray item to <menu>, with <text> as the inner
            menu = tray_add_item(menu, &class.period_name, &text);
        }
    }

    menu = menu.add_native_item(SystemTrayMenuItem::Separator);

    // add the remaining opts
    let opts: [&str; 3] = ["more", "sync", "quit"];
    let desc: [&str; 3] = ["More...", "Sync Timetable", "Quit Timetable"];
    for i in 0..opts.len() {
        menu = tray_add_item(menu, opts[i], desc[i]);
    }

    // if ok, return the timetable and all of the messages, will be passed to set_gui in the front
    return match app_handle.tray_handle().set_menu(menu) {
        Ok(_) => Ok((timetable, msg)),
        Err(_) => Err("Failed to set tray menu".to_owned()),
    };
}

pub fn tray_add_item(menu: SystemTrayMenu, id: &str, desc: &str) -> SystemTrayMenu {
    return menu.add_item(CustomMenuItem::new(id.to_string(), desc));
}

// the tray without the classes
pub fn default_tray() -> SystemTray {
    let opts: [&str; 3] = ["more", "sync", "quit"];
    let desc: [&str; 3] = ["More...", "Sync Timetable", "Quit Timetable"];
    let mut menu = SystemTrayMenu::new().add_native_item(SystemTrayMenuItem::Separator);

    for i in 0..opts.len() {
        menu = tray_add_item(menu, opts[i], desc[i]);
    }

    return SystemTray::new().with_menu(menu);
}

pub fn handle_tray_event(app_handle: &tauri::AppHandle, evt: tauri::SystemTrayEvent) {
    match evt {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            // let item_handle = app_handle.tray_handle().get_item(&id);
            match id.as_str() {
                "quit" => {
                    app_handle.exit(0);
                }
                #[allow(unused)] // async not used, but needs await
                "sync" => {
                    async {
                        match impure::fetch_timetable().await {
                            Ok(_) => impure::create_notif(
                                "Timetable fetched".to_owned(),
                                app_handle.clone(),
                            ),
                            _ => {}
                        }
                    };
                }
                "more" => {
                    let window = (*app_handle).get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                _ => {}
            }
        }
        _ => {}
    }
}
