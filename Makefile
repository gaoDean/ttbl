BIN=dist/ttbl
CLI_SRC=modules/ttbl-cli/src
MACOS=dist/macos/ttbl.app/Contents

build:
	@echo "Building"
	@rm -rf dist
	@neu build 2>&1 1>/dev/null
	@mkdir -p $(BIN)/$(CLI_SRC)
	@cp -R $(CLI_SRC)/* $(BIN)/$(CLI_SRC)
	@echo "Making MacOS app"
	@mkdir -p $(MACOS)/MacOS
	@mkdir -p $(MACOS)/Resources
	@cp $(BIN)/ttbl-mac_x64 		$(MACOS)/MacOS/ttbl
	@cp $(BIN)/resources.neu 		$(MACOS)/MacOS/
	@cp -R $(BIN)/modules 			$(MACOS)/MacOS/
	@cp modules/extra/Info.plist	$(MACOS)/
	@cp app/img/appIcon.png 		$(MACOS)/Resources/
	@echo "Finished"

run:
	@chmod +x $(BIN)/ttbl-mac_x64
	@echo "Running ttbl"
	@$(BIN)/ttbl-mac_x64

.PHONY: setup
setup:
	@echo "Setting up the environment"
	@npm i -g @neutralinojs/neu
	@git submodule update --init --recursive
	@neu update

.PHONY: update
update:
	@echo "Updating submodules"
	@git submodule update --remote --merge --recursive
	@cp modules/pico/css/pico.min.css app/css/
	@cp modules/pico/css/pico.min.css.map app/css/

.PHONY: test
test:
	@sh modules/extra/hidden.sh

.PHONY: fmt
fmt:
	@sh modules/extra/semi.sh
