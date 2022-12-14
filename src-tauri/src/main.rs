#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod impure;
mod tray;

fn main() {
    let tray = tray::default_tray();

    #[allow(unused_mut)]
    let mut app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            tray::add_to_tray,
            impure::log,
            impure::set_data,
            impure::get_data,
            impure::clear_all_data,
            impure::create_notification,
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
