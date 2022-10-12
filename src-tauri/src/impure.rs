use chrono::Local; // time
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs::File, io::Write};
use tauri::api::http::{
    Client, ClientBuilder, HttpRequestBuilder, Response, ResponseData, ResponseType,
};
use tauri::api::notification::Notification;
use tauri::http::status::StatusCode;

const HOST: &str = "https://caulfieldsync.vercel.app/api";
// get the data dir cus it doesn't allow it to be const
fn datadir() -> std::path::PathBuf {
    let dir = tauri::api::path::data_dir().unwrap();
    dir.join("ttbl/")
}

// data of each class
#[derive(Debug, Clone, Serialize, Deserialize)]
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
    #[serde(rename = "teacherName")]
    pub teacher_name: String,
    pub __typename: String,
    #[serde(rename = "detailedName")]
    pub detailed_name: String,
}

pub type ClassesForDay = Vec<Class>;
pub type Timetable = HashMap<String, ClassesForDay>;

// get the date of the class from the id
fn get_class_date(class: Class) -> String {
    return (&class.id[7..]).to_owned();
}

// write the <data> to a file in datadir with the file name being ".storage.${key}"
fn set_data(key: &str, data: &str) -> Result<(), std::io::Error> {
    let mut file = File::create(datadir().join(".storage.".to_owned() + key).as_path())?;
    return file.write_all(data.as_bytes());
}

// get the <data> in the file in datadir, its name being ".storage.${key}"
fn get_data(key: &str) -> String {
    let filepath_buf = datadir().join(".storage.".to_owned() + key);
    return match tauri::api::file::read_string(filepath_buf.as_path()) {
        Ok(s) => s,
        Err(_) => String::new(),
    };
}

// public func get timetable in Timetable format
#[tauri::command]
pub fn get_timetable() -> Option<Timetable> {
    return match serde_json::from_str(get_data("timetable").as_str()) {
        Ok(s) => Some(s),
        Err(_) => None,
    };
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

// generic fetch
async fn fetch(url: &str) -> Result<ResponseData, StatusCode> {
    // http client
    let client: Client = ClientBuilder::new().build().unwrap();
    // get the response
    let res: Response = client
        .send(
            HttpRequestBuilder::new("GET", url)
                .unwrap()
                .response_type(ResponseType::Json),
        )
        .await
        .unwrap();

    if res.status().as_u16() != 200 {
        return Err(res.status());
    }

    let read: ResponseData = res.read().await.unwrap();
    println!("{}", read.url.as_str().to_string());
    return Ok(read);
}

#[tauri::command]
pub async fn fetch_token(student_id: String, password: String) -> Result<(), String> {
    let url: String = format!(
        "{}/token?username={}&password={}",
        HOST, student_id, password
    );

    let res: ResponseData = match fetch(&url).await {
        Ok(s) => s,
        Err(e) => return Err(e.as_u16().to_string()),
    };
    // get the token from the response
    let token_data: &str = res.data["token"].as_str().unwrap();
    if token_data.is_empty() {
        return Err("Something went wrong".to_owned());
    }
    // set the token_data to storage
    match set_data("token", token_data) {
        Err(_) => Err("Couldn't write to storage".to_owned()),
        _ => Ok(()),
    }
}

#[tauri::command]
pub async fn fetch_timetable() -> Result<(), String> {
    // get the token
    let token: String = get_data("token");
    if token.is_empty() {
        return Err("No token stored".to_owned());
    }
    // if token.is_empty() {
    //     // TODO: go to login
    // }
    let url: String = format!(
        "{}/timetable/{}?dayMinus={}&dayPlus={}&shorten=true",
        HOST, token, "15", "15"
    );
    // fetch the url
    let res: ResponseData = match fetch(&url).await {
        Ok(s) => s,
        Err(e) => return Err(format!("{}: {}", e, "Couldn't fetch timetable".to_owned())),
    };

    // data structures
    let mut fetched_timetable: Vec<Class> =
        serde_json::from_value(res.data["data"]["classes"].clone()).unwrap();
    let mut cached_timetable: Timetable = match serde_json::from_str(get_data("timetable").as_str())
    {
        Ok(s) => s,
        Err(_) => HashMap::new(),
    };
    let mut new_timetable: Timetable = HashMap::new();

    // put fetched into data structure
    for val in &mut fetched_timetable {
        if val.room.is_empty() {
            val.room = "N/A".to_owned();
        }

        let date: &String = &get_class_date(val.clone());
        // insert key=date value=classes_on_that_day to new_timetable
        if !new_timetable.contains_key(date) {
            new_timetable.insert(date.clone(), Vec::new());
        }
        new_timetable.get_mut(date).unwrap().push(val.clone());

        // put the date to cached timetable, only the finished day will be inserted
        // because all recurring inserts will be removed.
        cached_timetable.insert(date.clone(), new_timetable.get(date).unwrap().clone());
    }
    // set to storage
    match set_data(
        "timetable",
        &serde_json::ser::to_string(&cached_timetable).unwrap(),
    ) {
        Err(_) => return Err("Couldn't write to storage".to_owned()),
        _ => return Ok(()),
    };
}
