BIN=dist/ttbl
MACOS=dist/macos/ttbl.app/Contents

build:
	@echo "Building"
	@rm -rf dist
	@neu build 2>&1 1>/dev/null
	@echo "Making MacOS app"
	@mkdir -p $(MACOS)/MacOS
	@mkdir -p $(MACOS)/Resources
	@cp $(BIN)/ttbl-mac_x64 		$(MACOS)/MacOS/ttbl
	@cp $(BIN)/resources.neu 		$(MACOS)/MacOS/
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
