#!/bin/sh

ver=$(jq -r '.version' < package.json)
major_v=$(echo "$ver" | sed "s/^\(.*\)\..*/\1/")
minor_v=$(echo "$ver" | sed "s/^.*\.\(.*\)\..*/\1")
micro_v=$(echo "$ver" | sed "s/^.*\..*\.\(.*\)/\1")

case "$1" in
	'MAJOR' | 'major' | 'a' ) $((major_v++)) && minor_v=0 && micro_v=0 ;;
	'MINOR' | 'minor' | 'i' ) $((minor_v++)) && micro_v=0 ;;
	'MICRO' | 'micro' | 'c' ) $((micro_v++)) ;;
	*) echo "unrecognised: $1" ;;
esac

# new version
ver="$major_v.$minor_v.$micro_v"

cat package.json | sed "s/\(  \"version\"/  \"version\": \"$ver\",/" > package.json
cat src-tauri/Cargo.toml | sed "s/^version/version = \"$ver\"/" > src-tauri/Cargo.toml
cat src-tauri/tauri.conf.json | sed "s/^\s\s\"version\"/\t\t\"version\": \"$ver\"/" > src-tauri/tauri.conf.json
