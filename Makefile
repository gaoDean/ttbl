BIN=dist/ttbl
CLI_SRC=modules/ttbl-cli/src
MACOS=dist/ttbl.app/Contents

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

.PHONY: setup
setup:
	@echo "Setting up the environment"
	@npm i -g @neutralinojs/neu
	@git submodule update --init --recursive
	@neu update

.PHONY: update
update:
	@echo "Updating ttbl-cli"
	@cd modules/ttbl-cli && git pull -q
	@echo "Updating pico"
	@cd modules/pico && git pull -q
	@cp modules/pico/css/pico.min.css app/css/
	@cp modules/pico/css/pico.min.css.map app/css/
