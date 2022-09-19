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

.PHONY: run
run:
	@echo "Running"
	@neu run 2>&1 1>/dev/null

.PHONY: runbin
runbin:
	@echo "Running mac binary"
	@./dist/ttbl/ttbl-mac_x64

.PHONY: update
update:
	@echo "Updating ttbl-cli"
	@cd modules/ttbl-cli && git pull -q
	@echo "Updating pico"
	@cd modules/pico && git pull -q
	@cp modules/pico/css/pico.min.css app/css/
	@cp modules/pico/css/pico.min.css.map app/css/
