build:
	@echo "Building"
	@neu build 2>&1 1>/dev/null
	@echo "Copying modules/ttbl-cli/src/ttbl to dist/ttbl/ttbl"
	@cp modules/ttbl-cli/src/ttbl dist/ttbl/ttbl

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
