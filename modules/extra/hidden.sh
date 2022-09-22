if [ "$(jq -r ".modes.window.hidden" neutralino.config.json)" = "false" ]; then
	exit 1
fi
