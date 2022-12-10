<script>
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';

export let needsLogin;

let studentId;
let password = '';
let loading = false;
let loginMessage =
	"The login will take around 15 seconds, but you'll only need to do this once. This will save your login details on your computer, so when your token is changed by the school, we can re-fetch it in the background.";

const login = async () => {
	loading = true;
	loginMessage = 'Trying to fetch token';

	try {
		await invoke('fetch_token', { studentId: studentId, password: password });
	} catch (err) {
		console.log(err); loading = false;
		if (err === '401') {
			loginMessage =
				'Authorisation failed. Make sure you have typed in your username and password correctly.';
		} else if (err === '500') {
			loginMessage = 'Something went wrong, please try again.';
		} else {
			loginMessage = err;
		}
		return;
	}

	loginMessage = 'Token fetched successfully, fetching timetable';

	try {
		await invoke('fetch_timetable');
	} catch (err) {
		console.log(err);
		loading = false;
		if (err === '403') {
			loginMessage =
				'Authorisation failed. Make sure you have typed in your username and password correctly.';
		} else {
			loginMessage = err;
		}
		return;
	}

	invoke('set_login_details', {
		id: studentId.value,
		password: password.value,
	});

	loading = false;
	loginMessage = 'Timetable fetched';
	/* needsLogin = false; */
};

appWindow.show();
appWindow.setFocus();
</script>

<hgroup style="padding-bottom: 30px">
	<h1>Welcome to <a href="#">ttbl</a>!</h1>
	<h3>By Dean Gao</h3>
</hgroup>
<div class="grid">
	<form method="" on:submit|preventDefault{login()}>
		<input
			type="number"
			value={studentId}
			placeholder="Student ID"
			required
		/>
		<input type="password" value={password} placeholder="Password" required />
		<button
			type="submit"
			id="submit"
			class="outline"
			aria-busy={loading}
		>
			Login
		</button>
	</form>
</div>
<small>{loginMessage}</small>
