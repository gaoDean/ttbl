//  == the user interface ==

// object destructuring
const { invoke } = window.__TAURI__; // eslint-disable-line no-underscore-dangle

// YYYYMMDD in integer form
let ymd = await invoke('get_ymd');
if (await invoke('get_hour') > 17) {
  ymd = await invoke('ymd_add', { ymd, durInDays: 1 });
}


async function setClassesToGui(timetable, periodsPassed, msg, extra) {
  const main = document.getElementById('timetable');
  main.innerHTML = '';
  document.getElementById('message').innerText = msg;

  if (extra) {
    main.innerHTML += `<p style="text-align: center; margin: 0; position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);">${extra}</p>`;
  }

  // add all the other classes
  Object.values(timetable).forEach((curClass) => {
    const greyedOut = Number(curClass.periodName) <= periodsPassed ? 'opacity: 0.5' : '';
    const classHTML = `
      <article style="${greyedOut}">
        <hgroup>
          <h4 style="display: inline">${curClass.description}</h4>
          <small style="display: inline; float: right">Period ${curClass.periodName}</small>
          <h6>${curClass.room}</h6>
          <p>${curClass.teacherName}</p>
        </hgroup>
      </article>`;

    // for optimisation, only append when fully created as opposed to adding each elm to dom
    main.insertAdjacentHTML('beforeend', classHTML);
  });
}

async function updateUI() {
  let ret;
  try {
    console.log(ymd);
    ret = await invoke('add_timetable_to_tray', { date: ymd });
  } catch (err) {
    // theres probably no token but try to fetch the timetable anyway
    console.log(err);
    try {
      document.getElementById('message').innerText = 'Give us a sec, something went wrong...';
      await invoke('fetch_timetable');
      ret = await invoke('add_timetable_to_tray', { date: ymd });
    } catch (err2) {
      // couldn't fetch the timetable probs cus theres no token, go to the login screen
      console.log(err2);
      window.location.href = 'login.html';
      return;
    }
  }
  setClassesToGui(
    ret[0], // timetable
    ret[1], // passed periods
    ret[2][0], // msg
    ret[2][1], // msg extra
  );

  console.log(ret);
}

async function changeDate(offset) {
  ymd = await invoke('ymd_add', { ymd, durInDays: offset });
  updateUI();
}

function addListeners() {
  document.getElementById('date-past').addEventListener('click', () => changeDate(-1));
  document.getElementById('date-future').addEventListener('click', () => changeDate(1));
}

updateUI();
addListeners();

// i have nowhere else to put this
// import { scheduleSync } from "./helper/time.js";
// scheduleSync("08", "00", "00"); // run in background
