#!/bin/sh

# exit when any command fails
set -e

ver=$(jq -r '.version' < package.json)
msg=""
major_v=$(echo "$ver" | sed "s/^\(.*\)\..*\..*/\1/")
minor_v=$(echo "$ver" | sed "s/^.*\.\(.*\)\..*/\1/")
micro_v=$(echo "$ver" | sed "s/^.*\..*\.\(.*\)/\1/")

case "$1" in
	'MAJOR' | 'major' | 'a' ) ((major_v+=1)) && msg="major" && minor_v=0 && micro_v=0 ;;
	'MINOR' | 'minor' | 'i' ) ((minor_v+=1)) && msg="minor" && micro_v=0 ;;
	'MICRO' | 'micro' | 'c' ) ((micro_v+=1)) && msg="micro" ;;
	*) echo "unrecognised option: '$1'" && exit 0 ;;
esac

oldver="$ver"
# new version
ver="$major_v.$minor_v.$micro_v"

# call with a prompt string or use a default
read -r -p "Continue with a ${msg} bump from ${oldver} to ${ver}? [y/N]} " response
case "$response" in
	[yY][eE][sS]|[yY])
		true
		;;
	*)
		exit 0
		;;
esac

date=$(gdate --rfc-3339=seconds | sed 's/ /T/')
notes=$(git log v${oldver}..HEAD --grep="\(#[0-9]\)" --oneline --graph | sed -E "s/^(\*) .{7} (.*)\(#[0-9]*\)/\1\2/ ; s/\*/-/")
tmp=$(jq ".[. | length] += {
	\"version\": \"${ver}\",
	\"notes\": \"${notes}\n\nYou can find the complete release notes at https://github.com/gaoDean/ttbl/releases/tag/${ver}\",
	\"pub_date\": \"${date}\",
	\"platforms\": {
		\"darwin-x86_64\": {
			\"signature\": \"\",
			\"url\": \"https://github.com/gaoDean/ttbl/releases/download/${ver}/ttbl-intel_tarball.tar.gz\"
		},
		\"darwin-aarch64\": {
			\"signature\": \"\",
			\"url\": \"https://github.com/gaoDean/ttbl/releases/download/${ver}/ttbl-m1_tarball.tar.gz\"
		}
	}
}" < updates.json | sed "s/\\\n/\\\\\\\n/g")
echo "${tmp}" > updates.json

sed -E -i "s/(.*)\"version\".*/\1\"version\": \"${ver}\",/" package.json
sed -i "s/^version.*/version = \"${ver}\"/" src-tauri/Cargo.toml
sed -i "s/^\s\s\"version\".*/\t\t\"version\": \"${ver}\"/" src-tauri/tauri.conf.json
perl -i -p0e "s/name = \"app\"\nversion = \".*\"/name = \"app\"\nversion = \"${ver}\"/" Cargo.lock
git add updates.json
git add package.json
git add src-tauri/Cargo.toml
git add src-tauri/tauri.conf.json
git add Cargo.lock
git commit -m "chore: version bump to v${ver}"
git tag "v${ver}" HEAD
