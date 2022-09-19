#!/bin/sh

# tests for no semicolons
result=$(cd app/js && cat helper/cli.js helper/time.js main.js token.js tray.js ui.js | sed -E '/\s*\/\//d ;
/; \/\//d ;
/[;:,{}]$/d ;
/\*\/$/d ;
/^\s*[a-zA-z]*:/d ;
/^\s*[+]/d ;
/\/\/ join/d ;
/^\s*$/d')
[ $(echo "$result" | wc -w) -ne "0" ] && echo "$result" | wc -w
