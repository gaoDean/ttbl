use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

use crate::impure;
use crate::time;

// takes the date, gets the timetable for date and adds classes in timetable to tray
#[tauri::command]
pub fn add_timetable_to_tray(
    date: String,
    dry_run: bool,
    app_handle: tauri::AppHandle,
) -> Result<(impure::ClassesForDay, i32, (String, String)), String> {
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
    let mut next_end_time: String = String::new();
    let mut periods_passed: i32 = -1;
    let mut menu: SystemTrayMenu = SystemTrayMenu::new();

    if !dry_run {
        // add date messages
        menu = tray_add_item(menu, "date", &msg.0);
        if !msg.1.is_empty() {
            menu = tray_add_item(menu, "extra", &msg.1);
        }

        // if timetable exists on that day
        if !timetable.is_empty() {
            menu = menu.add_native_item(SystemTrayMenuItem::Separator);

            // padding is to make align the classes in one column
            let padding: &str = "        ";
            // add the class to the tray
            for class in timetable.clone() {
                let room_padding: &str = &padding[..(padding.len() - class.room.len())];
                let text: String = format!(
                    "{}\t{}{}\t{}",
                    &class.period_name.clone(),
                    &class.room,
                    room_padding,
                    &class.description
                );

                // if not later; if already passed
                if !time::later(class.end_time.clone()) {
                    // at the end will be the last passed period
                    periods_passed = class.period_name.parse().unwrap();
                    menu = menu.add_item(CustomMenuItem::new(&class.period_name, &text).disabled())
                } else {
                    // add the tray item to <menu>, with <text> as the inner
                    menu = tray_add_item(menu, &class.period_name, &text);
                    if next_end_time.is_empty() {
                        next_end_time = class.end_time;
                    }
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
    }

    // if dry run, return the data, else match the result of setting the tray
    // if matched ok, return the data, will be passed to set_gui in the front
    println!("{:?}", dry_run);
    match if dry_run { Result::Ok(()) } else { app_handle.tray_handle().set_menu(menu) } {
        Ok(_) => Ok((timetable, periods_passed, msg)),
        Err(_) => Err("Failed to set tray menu".to_owned()),
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

pub fn handle_tray_event(app_handle: &tauri::AppHandle, evt: tauri::SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = evt {
        match id.as_str() {
            "quit" => {
                app_handle.exit(0);
            }
            #[allow(unused)] // async not used, but needs await
            "sync" => {
                async {
                    if impure::fetch_timetable().await.is_ok() {
                        impure::create_notif("Timetable fetched".to_owned(), app_handle.clone());
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
}
