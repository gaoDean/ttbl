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
