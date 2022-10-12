#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod impure;
mod time;
mod tray;

fn main() {
    let tray = tray::default_tray();

    let mut app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            time::spawn_thread,
            time::get_ymd,
            time::ymd_add,
            tray::add_timetable_to_tray,
            impure::fetch_token,
            impure::fetch_timetable,
        ])
        .system_tray(tray)
        .on_system_tray_event(tray::handle_tray_event)
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    // accessory means its a menu bar app, doesn't show up in dock
    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Accessory);

    app.run(|_app_handle, _event| {});
}
