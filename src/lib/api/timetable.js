import { getDate } from '../../calendar/[token]/[[...userID]]';
import { server } from '../../../../config';
import { titleCase } from 'title-case';
import { fetch as getUserInfo } from './userInfo.js';
import { payload } from './status.js';

const getResponse = (opts) => {
	let startDate;
	let endDate;
	const minusInput = (opts.dayMinus ?? '0').toString();
	const plusInput = (opts.dayPlus ?? '0').toString();

	if (minusInput.includes('T') || plusInput.includes('T')) {
		startDate = minusInput;
		endDate = plusInput;
	} else {
		let dayMinus = Number(minusInput);
		let dayPlus = Number(plusInput);
		if (isNaN(dayMinus)) dayMinus = 0;
		if (isNaN(dayPlus)) dayPlus = 0;

		startDate =
			getDate({ dayOffset: -1 - dayMinus, monthOffset: 0 }) + 'T14:00:00.000Z';
		endDate =
			getDate({ dayOffset: dayPlus, monthOffset: 0 }) + 'T13:59:59.999Z';
	}

	return fetch('https://life-api.caulfieldlife.com.au/', {
		headers: {
			accept: '*/*',
			'accept-language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
			authorization: 'Bearer X-ae97a16a-3e28-4365:Y-53e74b38-8a53-4ef7',
			'content-type': 'application/json',
			'sec-ch-ua':
				'" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site',
			'x-community-token': opts.token,
		},
		referrer: 'https://caulfieldlife.com.au/',
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: `{\"operationName\":\"ClassData\",\"variables\":{\"startTime\":\"${startDate}\",\"endTime\":\"${endDate}\",\"memberId\":\"${opts.userID}\"},\"query\":\"fragment ClassFields on Class {\\n  id\\n  title\\n  description\\n  startTime\\n  endTime\\n  dayOrder\\n  periodOrder\\n  periodName\\n  colour\\n  room\\n  teacherName\\n  __typename\\n}\\n\\nquery ClassData($memberId: ID!, $startTime: DateTime!, $endTime: DateTime) {\\n  classes(where: {startTime: $startTime, endTime: $endTime, memberId: $memberId}, orderBy: {property: \\\"startTime\\\", sort: ASC}) {\\n    ...ClassFields\\n    __typename\\n  }\\n}\\n\"}`,
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
	});
};

export const fetch = async (opts) => {
	if (userID == undefined) {
		const response = await getUserInfo(opts.token);
		userID = (await response.json())['id'];
	}

	const response = await getResponse(opts);
	let jsonResponse = await response.json();

	if (response.status == 403) {
		return payload(403, {
			error:
				'Invalid Token Provided. Please make sure you have the correct user token from CaulfieldLife',
		});
	}

	if (opts.shorten) {
		const classes = jsonResponse['data']['classes'];

		for (let classIndex = 0; classIndex < classes.length; classIndex++) {
			// @ts-ignore
			let detailedName = classes[classIndex]['description'];

			let subjectName = titleCase(detailedName.toLowerCase());

			subjectName = subjectName
				.split(' - ')[0]
				.replace(/ [W|C]\d\d?/gm, '')
				.replace(/ S1| S2/, '')
				.replace(/ \([Yr]\d\d?\)/gm, '')
				.replace(/ \(Yr \d\d?\)/, '')
				.replace(/\d\d?\w /gm, '')
				.replace(/\d\d? /gm, '')
				.replace(/ Music_ensembles/gm, '')
				.replace(/ \(Wh\)| \(Ca\)| \(CC\)| \(WH\)| \(Cc\)/, '');

			jsonResponse['data']['classes'][classIndex]['description'] = subjectName;
			jsonResponse['data']['classes'][classIndex]['detailedName'] =
				detailedName;
		}
	}

	return payload(response.status, jsonResponse);
};
