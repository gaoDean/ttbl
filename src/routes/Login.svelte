<script>
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { fetchToken, fetchTimetable } from '$lib/fetch';

export let needsLogin;

let studentId = undefined;
let password = '';
let loading = false;
let loginMessage =
	"The login will take around 15 seconds, but you'll only need to do this once. This will save your login details on your computer, so when your token is changed by the school, we can re-fetch it in the background.";

const login = async () => {
	loading = true;
	loginMessage = 'Trying to log you in...';

	let res = await fetchToken(studentId, password);
	if (!res.ok) {
		switch (res.status) {
			case 401:
				loginMessage =
					'Authorisation failed. Make sure you have typed in your username and password correctly.';
				break;
			case 500:
				loginMessage = 'Something went wrong, please try again.';
			default:
				loginMessage = `Error: ${res.status}`;
		}

		loading = false;
		return;
	}

	loginMessage = 'Login successful, fetching timetable...';

	res = await fetchTimetable(res.data, []);

	if (!res.ok) {
		loading = false;
		switch (res.status) {
			case 403:
				loginMessage = 'Wrong token';
			default:
				loginMessage = `Error: ${res.status}`;
		}

		loading = false;
		return;
	}

	loading = false;
	loginMessage = 'Timetable fetched';
	needsLogin = false;
};

appWindow.show();
appWindow.setFocus();
</script>

<hgroup style="padding-bottom: 30px">
	<h1>Welcome to <a href="#">ttbl</a>!</h1>
	<h3>By Dean Gao</h3>
</hgroup>
<div class="grid">
	<form method="" on:submit|preventDefault={login}>
		<input
			type="number"
			bind:value={studentId}
			placeholder="Student ID"
			required
		/>
		<input
			type="password"
			bind:value={password}
			placeholder="Password"
			required
		/>
		<button type="submit" class="outline" aria-busy={loading}> Login </button>
	</form>
</div>
<small>{loginMessage}</small>
