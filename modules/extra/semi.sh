#!/bin/sh

# tests for no semicolons
cd app/js
result=$(cat helper/cli.js helper/time.js main.js token.js tray.js ui.js | sed -E '/\s*\/\//d ;
/; \/\//d ;
/[;:,{}]$/d ;
/\*\/$/d ;
/^\s*[a-zA-z]*:/d ;
/^\s*[+]/d ;
/\/\/ join/d ;
/^\s*$/d')
if [ $(echo "$result" | wc -w) -gt "0" ]; then
	rg --fixed-strings "$result"
fi
exit 0
