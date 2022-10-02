use chrono::prelude::*;

pub fn get_msg(ymd: String, no_classes: bool) -> (String, String) {
    let ymd_sep: (i32, u32, u32) = ((&ymd[0..4]).parse().unwrap(),
                                    (&ymd[4..6]).parse().unwrap(),
                                    (&ymd[6..8]).parse().unwrap()
                                    );
    println!("{:#?}", ymd_sep);
    let date: Date<Local> = Local.ymd(ymd_sep.0, ymd_sep.1, ymd_sep.2);
    let fmt: String = date.format("%A, %e %B").to_string();
    let weekday: i32 = date.format("%u").to_string().parse().unwrap();

    // tuple, 0 is date, 1 is extra msg
    let mut msg: (String, String) = (fmt, String::new());

    if no_classes {
        if weekday >= 5 { // if its a weekend
            msg.1 = "There's no classes today, go do something productive."
                .to_owned();
        }   else {
            msg.1 = "It's a holiday! (or something broke and syncing didn't work)"
                .to_owned();
        }
    }

    return msg;
}
