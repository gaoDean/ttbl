use chrono::Local; // time
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs, io::Write};
use tauri::api::http::{
    Client, ClientBuilder, HttpRequestBuilder, Response, ResponseData, ResponseType,
};
use tauri::api::notification::Notification;
use tauri::http::status::StatusCode;

const HOST: &str = "https://caulfieldsync.vercel.app/api";
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
fn set_data(key: &str, data: &str) -> Result<(), std::io::Error> {
    let dir = datadir();
    fs::create_dir_all(dir.clone())?;
    let mut file = fs::File::create(dir.join(String::from(".storage.") + key).as_path())?;
    return file.write_all(data.as_bytes());
}

// get the <data> in the file in datadir, its name being ".storage.${key}"
fn get_data(key: &str) -> String {
    let filepath_buf = datadir().join(String::from(".storage.") + key);
    return match tauri::api::file::read_string(filepath_buf.as_path()) {
        Ok(s) => s,
        Err(_) => String::new(),
    };
}

fn format_class_values(class: &Class) -> Class {
    let mut cl = class.clone();
    if cl.room.is_empty() {
        cl.room = String::from("N/A");
    }
    return cl;
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
    log(read.url.as_str().to_owned());
    Ok(read)
}

// use stored login details to refetch token
// returns true if changed, else false if token unchanged
async fn refresh_token() -> bool {
    // tuple: (student_id, password)
    let details: (i32, String) = get_login_details();
    let old_token: String = get_data("token");

    if fetch_token(details.0, details.1).await.is_ok() {
        let new_token: String = get_data("token");
        return old_token != new_token;
    }

    false
}

#[tauri::command]
pub async fn fetch_token(student_id: i32, password: String) -> Result<(), String> {
    let url: String = format!(
        "{}/token?username={}&password={}",
        HOST, student_id, password
    );
    println!("{}", url);

    let res: ResponseData = match fetch(&url).await {
        Ok(s) => s,
        Err(e) => return Err(e.as_u16().to_string()),
    };
    // get the token from the response
    let token_data: &str = res.data["token"].as_str().unwrap();
    if token_data.is_empty() {
        return Err(String::from("Something went wrong"));
    }
    // set the token_data to storage
    match set_data("token", token_data) {
        Err(_) => Err(String::from("Couldn't write to storage")),
        _ => Ok(()),
    }
}

#[tauri::command]
pub async fn fetch_timetable() -> Result<(), String> {
    // get the token
    let token: String = get_data("token");
    if token.is_empty() {
        return Err(String::from("No token stored"));
    }
    let url: String = format!(
        "{}/timetable/{}?dayMinus={}&dayPlus={}&shorten=true",
        HOST, token, "15", "15"
    );

    // fetch the url
    // if bad res, refresh token and try again
    let res: ResponseData = match fetch(&url).await {
        Ok(s) => s,
        Err(e) => {
            // if newly fetched token didn't change
            if !refresh_token().await {
                // it's not a problem with outdated token, return error
                return Err(format!("{}", e));
            };
            // if no err it was an outdated token and it has been refreshed, continue.
            match fetch(&url).await {
                Ok(o) => o,
                Err(f) => {
                    return Err(format!("{}", f));
                }
            }
        }
    };

    let mut timetable: Vec<Class> =
        match serde_json::from_str::<Vec<Class>>(get_data("timetable").as_str()) {
            Ok(s) => s,
            Err(_) => Vec::new(),
        };

    timetable.append(
        &mut serde_json::from_value::<Vec<Class>>(res.data["data"]["classes"].clone())
            .unwrap()
            .into_iter()
            .map(|class| format_class_values(&class))
            .collect::<Vec<_>>(),
    );
    timetable.sort_by(|a, b| a.id.cmp(&b.id));
    timetable.dedup_by(|a, b| a.id == b.id);

    // set to storage
    match set_data(
        "timetable",
        &serde_json::ser::to_string(&timetable).unwrap(),
    ) {
        Err(_) => Err(String::from("Couldn't write to storage")),
        _ => Ok(()),
    }
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

fn get_login_details() -> (i32, String) {
    (
        get_data("student_id").parse().unwrap(),
        get_data("password"),
    )
}
