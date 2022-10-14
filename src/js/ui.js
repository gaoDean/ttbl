//  == the user interface ==

// object destructuring
const { invoke } = window.__TAURI__; // eslint-disable-line no-underscore-dangle

// YYYYMMDD in integer form
let ymd = await invoke('get_ymd');

// adds <tag> with <inner> to <parent_element>, returns the newly appended node
// attributes = { { <attr>, <value> }, { <attr>, <value> } };
function addElement(parentElement, tag, inner, attributes) {
  const element = document.createElement(tag);
  element.textContent = inner;

  if (attributes) {
    Object.values(attributes).forEach((attr) => element.setAttribute(attr[0], attr[1]));
  }

  return parentElement.appendChild(element);
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
    let greyed = null;
    if (Number(curClass.periodName) <= periodsPassed) {
      greyed = [['style', 'opacity: 0.5']];
    }
    const classContainer = addElement(main, 'article', '', greyed);
    const classGroup = addElement(classContainer, 'hgroup', '');

    addElement(classGroup, 'h4', curClass.description, [['style', 'display: inline']]);
    addElement(classGroup, 'small', `Period ${curClass.periodName}`, [['style', 'display: inline; float: right']]);
    addElement(classGroup, 'h6', curClass.room);
    addElement(classGroup, 'p', curClass.teacherName);
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
