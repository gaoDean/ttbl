let getUsername = async () => {
  const key = NL_OS == 'Windows' ? 'USERNAME' : 'USER';
  let value = '';
  try {
      value = await Neutralino.os.getEnv(key);
  }
  catch(err) {
      console.error(err);
  }
  document.getElementById('name').innerText = `Hello ${value}`;
}

Neutralino.init();
getUsername();
