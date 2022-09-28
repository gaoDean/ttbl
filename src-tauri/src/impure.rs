use serde::{Deserialize, Serialize};
use std::{fs::File, io::Write};
use tauri::api::http::{ClientBuilder, HttpRequestBuilder, Response, ResponseType};

const HOST: &str = "https://caulfieldsync.vercel.app/api";

// get the data dir cus it doesn't allow it to be const
fn datadir() -> std::path::PathBuf {
    let dir = tauri::api::path::data_dir().unwrap();
    return dir.join("ttbl/");
}

#[derive(Debug, Serialize, Deserialize)]
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

enum ErrorMsg {
    Error(tauri::api::Error),
    Message(String),
    Fine(String),
}

// converts stringify json timetable to vectored form
pub fn get_timetable_as_vec(timetable_json: String) -> Vec<Class> {
    return serde_json::from_str(&timetable_json).unwrap();
}

// get the date of the class from the id
fn get_class_date(class: Class) -> i32 {
    return (&class.id[..7]).parse::<i32>().unwrap();
}

// write the <data> to a file in datadir with the file name being ".storage.${key}"
fn set_data(key: &str, data: &str) -> Result<(), std::io::Error> {
    let mut file = File::create(datadir().join(".storage.".to_owned() + key).as_path())?;
    return file.write_all(data.as_bytes());
}

// generic fetch
async fn fetch(url: &str) -> tauri::api::Result<Response> {
    // http client
    let client = ClientBuilder::new().build().unwrap();
    // get the response
    let res = client
        .send(
            HttpRequestBuilder::new("GET", url)
                .unwrap()
                .response_type(ResponseType::Json),
        )
        .await;
    return res;
}

// #[tauri::command]
// pub async fn fetch_token(student_id: &str, password: &str) -> ErrorMsg {
//     let url: String = format!(
//         "{}/token?username={}&password={}",
//         HOST, student_id, password
//     );
//
//     let res = fetch(&url).await;
//     // if response not ok
//     if let Err(res) = res {
//         return ErrorMsg::Error(res);
//     }
//     // get the token from the response
//     let read = res.unwrap().read().await.unwrap();
//     let token_data: &str = read.data["token"].as_str().unwrap();
//     if token_data.is_empty() {
//         return ErrorMsg::Message("Something went wrong".to_owned());
//     }
//     set_data("token", token_data);
//     return ErrorMsg::Fine("".to_owned());
// }

#[tauri::command]
pub async fn fetch_token(student_id: &str, password: &str) -> Result<&'static str, ()> {
    let url: String = format!(
        "{}/token?username={}&password={}",
        HOST, student_id, password
    );

    let res = fetch(&url).await;
    // if response not ok
    if let Err(res) = res {
        return Ok("Error");
    }
    // get the token from the response
    let read = res.unwrap().read().await.unwrap();
    let token_data: &str = read.data["token"].as_str().unwrap();
    if token_data.is_empty() {
        return Ok("Something went wrong");
    }
    set_data("token", token_data);
    return Ok("");
}
