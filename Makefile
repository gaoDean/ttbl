BIN=dist/ttbl
MACOS=dist/macos/ttbl.app/Contents

all: run

run:
	@npm run tauri dev

build:
	@echo "Building MacOS Intel"
	@cargo-tauri build --target x86_64-apple-darwin
	@echo "Building MacOS M1"
	@cargo-tauri build --target aarch64-apple-darwin

setup:
	@echo "Installing Node.js dependencies"
	@npm install
	@echo "Adding MacOS build targets"
	@rustup target add aarch64-apple-darwin
	@rustup target add x86_64-apple-darwin
	@echo "Testing cargo"
	@cd src-tauri && cargo test
