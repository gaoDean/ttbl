all: run

# dont use this, `alias tauri="npx tauri"`
run:
	@npm run tauri dev

tags:
	@cd src-tauri/src && ctags *

build:
	@cd src-tauri && cargo test
	@npm run tauri build

setup:
	@echo "Adding MacOS build targets"
	@rustup target add aarch64-apple-darwin
	@rustup target add x86_64-apple-darwin
	@echo "Installing Node.js dependencies"
	@npm install
