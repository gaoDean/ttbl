<p align="center">
  <h2 align="center">ttbl</h2>
</p>
<p align="center">
	A fast gui interface to the CaulfieldLife timetable
</p>
<p align="center">
	<a href="https://github.com/gaoDean/ttbl">
			<img alt="Version" src="https://img.shields.io/github/v/release/gaoDean/ttbl?display_name=tag&include_prereleases&style=for-the-badge&logo=starship&color=C9CBFF&logoColor=D9E0EE&labelColor=302D41"></a>
	<a href="https://github.com/gaoDean/ttbl">
			<img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/gaoDean/ttbl/build.yml?branch=main&style=for-the-badge&logo=semanticrelease&color=F5E0DC&logoColor=D9E0EE&labelColor=302D41"></a>
	<a href="https://github.com/gaoDean/ttbl">
		<img alt="Repo size" src="https://img.shields.io/github/languages/code-size/gaoDean/ttbl?color=%23DDB6F2&logo=hackthebox&style=for-the-badge&logoColor=D9E0EE&labelColor=302D41"/></a>
</p>

Note: still in development

<img width="294" alt="Screenshot 2022-12-21 at 10 03 45 am" src="https://user-images.githubusercontent.com/97860672/208785945-d3faf55c-8d1a-4a20-919a-e7238c9337e8.png">

## Installation
You can grab the stable release [here](https://github.com/gaoDean/ttbl/releases), or latest build [here](https://nightly.link/gaoDean/ttbl/workflows/build/main)

## Development
Install the rust MacOS build targets with
```
rustup target add aarch64-apple-darwin
rustup target add x86_64-apple-darwin
```
and run `yarn install` (or `npm install`)

To open a dev server, run
```
yarn tauri dev
```

To build, run
```
yarn build
```

To lint and format, run
```
yarn format && yarn lint
```

To flush your app data, run
```
rm -rf ~/Library/Application\ Support/ttbl
```

## Credit
* This app was built with [Tauri](https://github.com/tauri-apps/tauri).
* This app uses [CaulfieldSync](https://caulfieldsync.vercel.app) to access the CaulfieldLife endpoints.
