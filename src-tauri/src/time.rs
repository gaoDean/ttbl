use chrono::{DateTime, Duration, Local, TimeZone};
use std::ops::Add;

const OVERFLOW_HOUR: i32 = 17;

// // get the current hour
// fn get_hour() -> i32 {
//     Local::now().to_string().parse().unwrap() // 00-23
// }

// from YYYYMMDD string to Date<Local>
fn parse_ymd(ymd: String) -> DateTime<Local> {
    let ymd_sep: (i32, u32, u32) = (
        ymd[0..4].parse().unwrap(),
        ymd[4..6].parse().unwrap(),
        ymd[6..8].parse().unwrap(),
    );
    Local
        .with_ymd_and_hms(ymd_sep.0, ymd_sep.1, ymd_sep.2, 0, 0, 0)
        .unwrap()
}

pub fn later(iso: String) -> bool {
    let input_time: DateTime<Local> = iso.parse().unwrap();
    let cur_time: DateTime<Local> = Local::now();

    // if input time later than current time
    input_time > cur_time
}

// get the display msg from YYYYMMDD and no_classes
pub fn get_msg(ymd: String, no_classes: bool, is_cur_date: bool) -> (String, String) {
    let date: DateTime<Local> = parse_ymd(ymd);

    // date human-readable and the weekday (1-7)
    let fmt: String = date.format("%A, %e %B").to_string();
    let weekday: i32 = date.format("%u").to_string().parse().unwrap();

    // tuple, 0 is date, 1 is extra msg
    let mut msg: (String, String) = (fmt, String::new());

    if !is_cur_date {
        // date not current date, add notice msg
        msg.0 = format!("Here's {}", msg.0);
    }

    if no_classes {
        if weekday >= 5 {
            // if its a weekend
            msg.1 = String::from("There's no classes today, go do something productive.");
        } else {
            // its a weekday and theres no classes
            msg.1 = String::from("It's a holiday! (or something broke and syncing didn't work)");
        }
    }

    msg
}

// add duration in days (int) to YYYYMMDD
#[tauri::command]
pub fn ymd_add(ymd: String, dur_in_days: i64) -> String {
    let date: DateTime<Local> = parse_ymd(ymd);
    let duration: Duration = Duration::days(dur_in_days);

    date.add(duration).format("%Y%m%d").to_string()
}

// get the current time.format("%Y%m%d").to_string();
#[tauri::command]
pub fn get_ymd() -> String {
    let mut date: DateTime<Local> = Local::now();
    if date.format("%H").to_string().parse::<i32>().unwrap() > OVERFLOW_HOUR {
        date = date.add(Duration::days(1)); // get next day
    }

    date.format("%Y%m%d").to_string()
}
