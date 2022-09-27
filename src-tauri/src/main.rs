#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod tray;

fn main() {
    let tray = tray::init_tray();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![tray::add_timetable_to_tray])
        .system_tray(tray)
        .on_system_tray_event(|app, event| tray::handle_tray_event(app, event))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
