use std::{fs, io::Write};
use tauri::api::notification::Notification;

// get the data dir cus it doesn't allow it to be const
fn datadir() -> std::path::PathBuf {
    let dir = tauri::api::path::data_dir().unwrap();
    // add ttbl dir to the data_dir
    dir.join("ttbl/")
}

#[tauri::command]
pub fn clear_all_data() {
    let dir = datadir();
    fs::remove_dir_all(dir.as_path()).unwrap();
}

// write the <data> to a file in datadir with the file name being ".storage.${key}"
#[tauri::command]
pub fn set_data(key: &str, data: &str) -> Result<(), String> {
    let dir = datadir();
    fs::create_dir_all(dir.clone()).unwrap();
    let mut file = match fs::File::create(dir.join(String::from(".storage.") + key).as_path()) {
        Ok(s) => s,
        Err(_) => return Err(String::from("err")),
    };
    match file.write_all(data.as_bytes()) {
        Ok(s) => Ok(s),
        Err(_) => Err(String::from("err")),
    }
}

#[tauri::command]
pub fn get_data(key: &str) -> Result<String, ()> {
    let filepath_buf = datadir().join(String::from(".storage.") + key);
    match tauri::api::file::read_string(filepath_buf.as_path()) {
        Ok(s) => Ok(s),
        Err(_) => Err(()),
    }
}

// log msg to .storage.log
#[tauri::command]
pub fn log(time: String, msg: String) -> Result<(), ()> {
    let buf: String = match get_data("log") {
        Ok(s) => s,
        Err(_) => String::new(),
    };
    match set_data("log", format!("{}{}: {}\n", buf, time, msg).as_str()) {
        Ok(_) => Ok(()),
        Err(_) => Err(()),
    }
}

// send a toast notif
#[tauri::command]
pub fn create_notification(msg: String, app_handle: tauri::AppHandle) {
    Notification::new(app_handle.config().tauri.bundle.identifier.clone())
        .title("ttbl")
        .body(msg.as_str())
        .show()
        .unwrap();
}
