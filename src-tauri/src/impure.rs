use serde::{Deserialize, Serialize};
use std::{clone::Clone, collections::HashMap, fs::File, io::Write};
use tauri::api::http::{
    Client, ClientBuilder, HttpRequestBuilder, Response, ResponseData, ResponseType,
};

const HOST: &str = "https://caulfieldsync.vercel.app/api";

// get the data dir cus it doesn't allow it to be const
fn datadir() -> std::path::PathBuf {
    let dir = tauri::api::path::data_dir().unwrap();
    return dir.join("ttbl/");
}

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
        .await
        .unwrap();

    if res.status() != 200 {
        return Err(res.status().to_string());
    }

    let read: ResponseData = res.read().await.unwrap();
    println!("{}", read.url.as_str().to_string());
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
    match set_data("token", token_data) {
        Err(_) => return Ok("Couldn't write to storage".to_owned()),
        _ => return Ok("".to_owned()),
    };
}

#[tauri::command]
pub async fn fetch_timetable() -> Result<String, ()> {
    let token: String = match get_data("token") {
        Ok(s) => s,
        Err(_) => return Ok("No token".to_owned()),
    };
    // if token.is_empty() {
    //     // TODO: go to login
    // }
    let url: String = format!(
        "{}/timetable/{}?dayMinus={}&dayPlus={}&shorten=true",
        HOST, token, "15", "15"
    );
    let res: ResponseData = match fetch(&url).await {
        Ok(s) => s,
        Err(e) => return Ok(format!("{}: {}", e, "Couldn't fetch timetable".to_owned())),
    };
    let timetable: Vec<Class> =
        serde_json::from_value(res.data["data"]["classes"].clone()).unwrap();

    let mut cached_timetable: HashMap<String, Vec<Class>> = match serde_json::from_str(
        match get_data("timetable") {
            Ok(s) => s,
            Err(_) => String::new(),
        }
        .as_str(),
    ) {
        Ok(s) => s,
        Err(e) => HashMap::new(),
    };
    let mut new_timetable: HashMap<String, Vec<Class>> = HashMap::new();

    for i in 0..timetable.len() {
        let val: &Class = &timetable[i];
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
    match set_data(
        "timetable",
        &serde_json::ser::to_string(&cached_timetable).unwrap(),
    ) {
        Err(_) => return Ok("Couldn't write to storage".to_owned()),
        _ => return Ok("".to_owned()),
    };
}
