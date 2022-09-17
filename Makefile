build:
	@echo "Building"
	@neu build 2>&1 1>/dev/null
	@echo "Copying modules/ttbl-cli/src/ttbl to dist/ttbl/ttbl"
	@cp modules/ttbl-cli/src/ttbl dist/ttbl/ttbl
