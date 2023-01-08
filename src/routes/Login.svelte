<script>
import { appWindow } from '@tauri-apps/api/window';
import { setData } from '$lib/helper.js';
import { fetchToken, fetchUserInfo, fetchTimetable } from '$lib/fetch.js';
import { currentPage } from './stores.js';

let studentId;
let password = '';
let loading = false;
let loginMessage =
	"The login will take around 15 seconds, but you'll only need to do this once. This will save your login details on your computer, so when your token is changed by the school, we can re-fetch it in the background.";

const login = async () => {
	loading = true;

	loginMessage = 'Trying to log you in...';
	const token = await fetchToken(studentId, password);
	if (!token.ok) {
		switch (token.status) {
			case 401:
				loginMessage =
					'Authorisation failed. Make sure you have typed in your username and password correctly.';
				break;
			case 500:
				loginMessage = 'Something went wrong, please try again.';
				break;
			default:
				loginMessage = `Error: ${token.status}`;
		}

		loading = false;
		return;
	}

	loginMessage = 'Fetching user ID...';
	const userInfo = await fetchUserInfo(token.data);
	if (!userInfo.ok) {
		loading = false;
		switch (userInfo.status) {
			case 403:
				loginMessage = 'Wrong token, try again';
				break;
			default:
				loginMessage = `Error: ${userInfo.status}`;
		}

		loading = false;
		return;
	}

	loginMessage = 'Login successful, fetching timetable...';
	const timetable = await fetchTimetable(token.data, userInfo.data.id, []);
	if (!timetable.ok) {
		loading = false;
		switch (timetable.status) {
			case 403:
				loginMessage = 'Wrong token, try again';
				break;
			default:
				loginMessage = `Error: ${timetable.status}`;
		}

		loading = false;
		return;
	}

	loginMessage = 'Timetable fetched';

	const defaultSettings = {
		datetime: {
			name: 'Date and time',
			options: {
				syncTime: {
					name: 'Set scheduled time to sync the timetable every day',
					type: 'time',
					value: '00:00',
				},
				dayRolloverTime: {
					name: "Set the time after the day has ended when the tray menu should display the next day's classes",
					type: 'time',
					value: '17:00',
				},
			},
		},
	};

	setData('settings', defaultSettings);

	$currentPage = 'timetable';
};

appWindow.show();
appWindow.setFocus();
</script>

<hgroup style="padding-bottom: 30px">
	<h1>Welcome to <a href="/">ttbl</a>!</h1>
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
