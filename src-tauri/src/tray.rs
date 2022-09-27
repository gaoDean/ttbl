use serde::{Deserialize, Serialize};
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[derive(Debug, Serialize, Deserialize)]
struct Class {
    id: String,
	title: String,
	description: String,
    #[serde(rename = "startTime")]
	start_time: String,
    #[serde(rename = "endTime")]
	end_time: String,
    #[serde(rename = "dayOrder")]
	day_order: i32,
    #[serde(rename = "periodOrder")]
	period_order: i32,
    #[serde(rename = "periodName")]
	period_name: String,
	colour: String,
	room: String,
    #[serde(rename = "teacherName")]
	teacher_name: String,
	__typename: String,
    #[serde(rename = "detailedName")]
	detailed_name: String,
}

#[tauri::command]
pub fn add_timetable_to_tray(
    timetable_json: String,
    msg: String,
    extra_msg: String,
    app_handle: tauri::AppHandle,
) -> Result<(), tauri::Error> {
    let timetable: Vec<Class> = serde_json::from_str(&timetable_json)?;

    let mut menu: SystemTrayMenu = SystemTrayMenu::new();

    menu = tray_add_item(menu, "date", &msg);
    if !extra_msg.is_empty() {
        menu = tray_add_item(menu, "extra", &extra_msg);
    }
    if timetable.len() != 0 {
        menu = menu.add_native_item(SystemTrayMenuItem::Separator);

        let padding: &str = "       ";
        for class in timetable {
            let room_padding: &str = &padding[..class.room.len()];
            let text: &str = &(class.period_name.as_str().to_owned() + "\t" + &class.room + room_padding + &class.description);

            menu = tray_add_item(menu, &class.period_name, &text);
        }
    }

    menu = menu.add_native_item(SystemTrayMenuItem::Separator);
    let opts: [&str; 3] = ["more", "sync", "quit"];
    let desc: [&str; 3] = ["More...", "Sync Timetable", "Quit Timetable"];
    for i in 0..opts.len() {
        menu = tray_add_item(menu, opts[i], desc[i]);
    }

    return app_handle.tray_handle().set_menu(menu);
}

pub fn tray_add_item(menu: SystemTrayMenu, id: &str, desc: &str) -> SystemTrayMenu {
    return menu.add_item(CustomMenuItem::new(id.to_string(), desc));
}

pub fn default_tray() -> SystemTray {
    let opts: [&str; 3] = ["more", "sync", "quit"];
    let desc: [&str; 3] = ["More...", "Sync Timetable", "Quit Timetable"];
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