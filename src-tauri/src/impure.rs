use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use std::{fs::File, io::Write};
use tauri::api::http::{Client, ClientBuilder, HttpRequestBuilder, Response, ResponseData, ResponseType};

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

// converts stringify json timetable to vectored form
pub fn get_timetable_as_vec(timetable_json: String) -> Vec<Class> {
    return serde_json::from_str(&timetable_json).unwrap();
}

// get the date of the class from the id
fn get_class_date(class: Class) -> String {
    return (&class.id[..7]).to_owned();
}

// write the <data> to a file in datadir with the file name being ".storage.${key}"
fn set_data(key: &str, data: &str) -> Result<(), std::io::Error> {
    let mut file = File::create(datadir().join(".storage.".to_owned() + key).as_path())?;
    return file.write_all(data.as_bytes());
}

// get the <data> in the file in datadir, its name being ".storage.${key}"
fn get_data(key: &str) -> tauri::api::Result<String> {
    let filepath_buf = datadir().join(".storage.".to_owned() + key);
    return tauri::api::file::read_string(filepath_buf.as_path());
}

// generic fetch
async fn fetch(url: &str) -> Result<ResponseData, String> {
    // http client
    let client: Client = ClientBuilder::new().build().unwrap();
    // get the response
    let res: Response = client
        .send(
            HttpRequestBuilder::new("GET", url)
                .unwrap()
                .response_type(ResponseType::Json),
        )
        .await.unwrap();

    if res.status() != 200 {
        return Err(res.status().to_string());
    }

    let read: ResponseData = res.read().await.unwrap();
    return Ok(read);
}

#[tauri::command]
pub async fn fetch_token(student_id: &str, password: &str) -> Result<String, ()> {
    let url: String = format!(
        "{}/token?username={}&password={}",
        HOST, student_id, password
    );

    let res: ResponseData = match fetch(&url).await {
        Ok(s) => s,
        Err(e) => return Ok(e),
    };
    // get the token from the response
    let token_data: &str = res.data["token"].as_str().unwrap();
    if token_data.is_empty() {
        return Ok("Something went wrong".to_owned());
    }
    set_data("token", token_data);
    return Ok("".to_owned());
}

// #[tauri::command]
// pub async fn fetch_timetable() -> Result<Ok> {
//     let token: String = match get_data("token") {
//         Ok(s) => s,
//         Err(e) => return Err(e),
//     };
//     // if token.is_empty() {
//     //     // TODO: go to login
//     // }
//     let url: String = format!(
//         "{}/timetable/{}?daysMinus={}&daysPlus={}&shorten=true",
//         HOST, "15", "15"
//     );
//     let res: ResponseData = match fetch(&url).await {
//         Ok(s) => s,
//         Err(e) => return Err(e),
//     };
//     let timetable_data: Vec<Class> =
//         serde_json::from_str(res.data["data"]["classes"].as_str().unwrap()).unwrap();
//
//     let mut cached_timetable: Map<String, Value> =
//         serde_json::from_str(get_data("timetable").unwrap().as_str()).unwrap();
//     let mut new_timetable: Map<String, Value> = Map::new();
//
//     for i in 0..timetable_data.len() {
//         let val: Class = timetable_data[i];
//         let date: &str = get_class_date(val);
//         // insert key=date value=classes_on_that_day to new_timetable
//         if !new_timetable.contains_key(date) {
//             new_timetable.insert(date, Vec::new());
//         }
//         new_timetable.get_mut(date).unwrap().push(val);
//
//         // put the date to cached timetable, only the finished day will be inserted
//         // because all recurring inserts will be removed.
//         cached_timetable.insert(date, new_timetable.get(date));
//     }
//     return Ok(());
// }
