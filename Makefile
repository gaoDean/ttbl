all: run

# dont use this, `alias tauri="yarn tauri"`
run:
	@yarn tauri dev

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

# full clean data dir
clean:
	@rm -rf ~/Library/Application\ Support/ttbl
