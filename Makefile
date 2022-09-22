BIN=dist/ttbl
MACOS=dist/macos/ttbl.app/Contents

all: build

build:
	@echo "Building"
	@rm -rf dist
	@neu build 2>&1 1>/dev/null
	@echo "Making MacOS app"
	@mkdir -p $(MACOS)/MacOS
	@mkdir -p $(MACOS)/Resources
	@mkdir -p dist/macos/release
	@cp $(BIN)/ttbl-mac_x64 		$(MACOS)/MacOS/ttbl
	@cp $(BIN)/resources.neu 		$(MACOS)/MacOS/
	@cp modules/extra/Info.plist	$(MACOS)/
	@cp app/img/appIcon.png 		$(MACOS)/Resources/
	@cd dist/macos && tar -zcf release/ttbl.tar ttbl.app
	@echo "Finished"

run:
	@$(MAKE) build
	@chmod +x $(BIN)/ttbl-mac_x64
	@echo "Running ttbl"
	@$(BIN)/ttbl-mac_x64

clean:
	@echo "Removing dist/ and .storage/"
	@rm -rf dist
	@rm -rf .storage

setup:
	@echo "Setting up the environment"
	@npm i -g @neutralinojs/neu
	@git submodule update --init --recursive
	@neu update

update:
	@echo "Updating submodules"
	@git submodule update --remote --merge --recursive
	@cp modules/pico/css/pico.min.css app/css/
	@cp modules/pico/css/pico.min.css.map app/css/

test:
	@sh modules/extra/hidden.sh

fmt:
	@sh modules/extra/semi.sh
