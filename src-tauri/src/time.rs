use chrono::{Date, Duration, Local, TimeZone};
use std::{ops::Add, thread};

use crate::impure;

// from YYYYMMDD string to Date<Local>
fn parse_ymd(ymd: String) -> Date<Local> {
    let ymd_sep: (i32, u32, u32) = (
        ymd[0..4].parse().unwrap(),
        ymd[4..6].parse().unwrap(),
        ymd[6..8].parse().unwrap(),
    );
    Local.ymd(ymd_sep.0, ymd_sep.1, ymd_sep.2)
}

// get the display msg from YYYYMMDD and no_classes
pub fn get_msg(ymd: String, no_classes: bool) -> (String, String) {
    let date: Date<Local> = parse_ymd(ymd);

    // date human-readable and the weekday (1-7)
    let fmt: String = date.format("%A, %e %B").to_string();
    let weekday: i32 = date.format("%u").to_string().parse().unwrap();

    // tuple, 0 is date, 1 is extra msg
    let mut msg: (String, String) = (fmt, String::new());

    if no_classes {
        if weekday >= 5 {
            // if its a weekend
            msg.1 = "There's no classes today, go do something productive.".to_owned();
        } else {
            msg.1 = "It's a holiday! (or something broke and syncing didn't work)".to_owned();
        }
    }

    msg
}

// add duration in days (int) to YYYYMMDD
#[tauri::command]
pub fn ymd_add(ymd: String, dur_in_days: i64) -> String {
    let date: Date<Local> = parse_ymd(ymd);
    let duration: Duration = Duration::days(dur_in_days);
    return date.add(duration).format("%Y%m%d").to_string();
}

// get the current time
#[tauri::command]
pub fn get_ymd() -> String {
    return Local::now().format("%Y%m%d").to_string();
}

// spawn the fetch timetable thread
#[tauri::command]
pub fn spawn_thread() {
    #[allow(unused)] // async not used, but needs await
    thread::spawn(move || loop {
        async {
            if let Err(_) = impure::fetch_timetable().await {
                impure::log("Couldn't fetch timetable".to_owned())
            };
        };
    });
}
