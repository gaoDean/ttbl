BIN=dist/ttbl
MACOS=dist/macos/ttbl.app/Contents

all: run

run:
	@npm run tauri dev
