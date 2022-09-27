#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod tray;

fn main() {
    let tray_opts: [&str; 3] = ["more", "sync", "quit"];
    let tray_opts_desc: [&str; 3] = ["More...", "Sync Timetable", "Quit Timetable"];
    let tray = tray::init_tray(&tray_opts, &tray_opts_desc);

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| tray::handle_tray_event(app, event))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
