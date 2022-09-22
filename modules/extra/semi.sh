#!/bin/sh

# tests for no semicolons

cd app/js
result=$(find . -name '*.js' -exec cat {} \; | sed -E '
/\s*\/\//d ;
/; \/\//d ;
/[;:,{}]$/d ;
/\*\/$/d ;
/^\s*[a-zA-z]*:/d ;
/^\s*[+]/d ;
/\/\/ join/d ;
/^\s*$/d')

echo "$result" | \
while IFS= read -r line; do
	rg --fixed-strings "$line" .
done
exit 0
