// == login and tokens ==

const { appWindow } = window.__TAURI__.window; // eslint-disable-line no-underscore-dangle
const invoke = window.__TAURI__.invoke; // eslint-disable-line no-underscore-dangle

// gui: the msg under the login
function loginMsg(msg) {
  document.getElementById('login_msg').innerText = msg;
}

// gui: the rotating circle on the button
function busy(bool) {
  document.getElementById('submit').setAttribute('aria-busy', `${bool}`);
}

function isNumeric(str) {
  // eslint-disable-next-line eqeqeq
  return Number(str) == str;
}

function checkValidity(node, validFunc) {
  if (node.value !== '' && validFunc(node.value)) {
    node.setAttribute('aria-invalid', 'false');
    return true; // is valid
  }
  node.setAttribute('aria-invalid', 'true');
  return false; // isn't valid
}

async function login() {
  const studentId = document.getElementById('login');
  const password = document.getElementById('password');

  // check validity of entries
  if (!checkValidity(studentId, isNumeric) + !checkValidity(password, () => (true))) {
    // if they're both valid, the above will equate to 0
    // I didn't use a logical or because it short circuits and only one of them turns red
    loginMsg('Looks like you missed something.');
    return;
  }

  // try to fetch the token
  busy(true);
  loginMsg('Trying to fetch token');

  try {
    await invoke('fetch_token', { studentId: studentId.value, password: password.value });
  } catch (err) {
    console.log(err);
    busy(false);
    if (err === '403') {
      loginMsg('Authorisation failed. Make sure you have typed in your username and password correctly.');
    } else {
      loginMsg(err);
    }
    return;
  }

  loginMsg('Token fetched successfully, fetching timetable');

  try {
    await invoke('fetch_timetable');
  } catch (err) {
    console.log(err);
    busy(false);
    if (err === '403') {
      loginMsg('Authorisation failed. Make sure you have typed in your username and password correctly.');
    } else {
      loginMsg(err);
    }
    return;
  }

  invoke('set_login_details', { id: studentId.value, password: password.value });

  busy(false);
  loginMsg('Timetable fetched');
  window.location.href = 'index.html';
}

function addListeners() {
  const studentId = document.getElementById('login');
  const password = document.getElementById('password');

  // adds input listener to check if input is valid (gui)
  studentId.addEventListener('input', () => (checkValidity(studentId, isNumeric)));
  password.addEventListener('input', () => (checkValidity(password, () => (true))));

  // on the "login" button clicked, try to fetch token
  document.getElementById('submit').addEventListener('click', () => (login()));
}

addListeners();
appWindow.show();
appWindow.setFocus();
