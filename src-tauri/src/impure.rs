use chrono::Local; // time
use serde::{Deserialize, Serialize};
use std::{fs, io::Write};
use tauri::api::notification::Notification;

// get the data dir cus it doesn't allow it to be const
fn datadir() -> std::path::PathBuf {
    let dir = tauri::api::path::data_dir().unwrap();
    // add ttbl dir to the data_dir
    dir.join("ttbl/")
}

// data of each class, serde_json compatible
#[derive(PartialEq, Debug, Clone, Serialize, Deserialize)]
pub struct Class {
    pub id: String,
    pub title: String,
    pub description: String,
    #[serde(rename = "startTime")]
    pub start_time: String,
    #[serde(rename = "endTime")]
    pub end_time: String,
    #[serde(rename = "dayOrder")]
    pub day_order: i32,
    #[serde(rename = "periodOrder")]
    pub period_order: i32,
    #[serde(rename = "periodName")]
    pub period_name: String,
    pub colour: String,
    pub room: String,
    pub done: Option<bool>,
    #[serde(rename = "teacherName")]
    pub teacher_name: String,
    pub __typename: String,
    #[serde(rename = "detailedName")]
    pub detailed_name: String,
}

// // get the date of the class from the id
// fn get_class_date(class: &Class) -> String {
//     class.id[7..].to_owned()
// }

// write the <data> to a file in datadir with the file name being ".storage.${key}"
#[tauri::command]
pub fn set_data(key: &str, data: &str) -> Result<(), String> {
    let dir = datadir();
    fs::create_dir_all(dir.clone()).unwrap();
    let mut file = match fs::File::create(dir.join(String::from(".storage.") + key).as_path()) {
        Ok(s) => s,
        Err(_) => return Err(String::from("err"))
    };
    match file.write_all(data.as_bytes()) {
        Ok(s) => Ok(s),
        Err(_) => Err(String::from("err")),
    }
}

// get the <data> in the file in datadir, its name being ".storage.${key}"
fn get_data(key: &str) -> String {
    let filepath_buf = datadir().join(String::from(".storage.") + key);
    return match tauri::api::file::read_string(filepath_buf.as_path()) {
        Ok(s) => s,
        Err(_) => String::new(),
    };
}

#[tauri::command]
pub fn get_token() -> Result<String, ()> {
    let filepath_buf = datadir().join(String::from(".storage.token"));
    match tauri::api::file::read_string(filepath_buf.as_path()) {
        Ok(s) => Ok(s),
        Err(_) => Err(()),
    }
}

// log msg to .storage.log
pub fn log(msg: String) {
    let buf: String = get_data("log");
    set_data(
        "log",
        format!("{}{}: {}\n", buf, Local::now(), msg).as_str(),
    )
    .unwrap();
}

// send a toast notif
pub fn create_notif(msg: String, app_handle: tauri::AppHandle) {
    Notification::new(app_handle.config().tauri.bundle.identifier.clone())
        .title("ttbl")
        .body(msg.as_str())
        .show()
        .unwrap();
}

// public func get timetable in Timetable format
#[tauri::command]
pub fn get_timetable() -> Option<Vec<Class>> {
    return match serde_json::from_str(get_data("timetable").as_str()) {
        Ok(s) => Some(s),
        Err(_) => None,
    };
}

#[tauri::command]
pub fn set_login_details(id: i32, password: String) -> Result<(), String> {
    if set_data("student_id", &id.to_string()).is_err()
        || set_data("password", password.as_str()).is_err()
    {
        return Err(String::from("Something went wrong storing values"));
    };
    Ok(())
}

#[tauri::command]
pub fn get_login_details() -> Result<(i32, String), ()> {
    (
        get_data("student_id").parse().unwrap(),
        get_data("password"),
    )
}
