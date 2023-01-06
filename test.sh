#!/bin/sh

date=$(gdate --rfc-3339=seconds | sed 's/ /T/')

ret=$(jq ".[. | length] += {
	\"version\": \"v1.0.0\",
	\"notes\": \"https://github.com/gaoDean/ttbl/releases/tag/v1.0.0\",
	\"pub_date\": \"${date}\",
	\"platforms\": {
		\"darwin-x86_64\": {
			\"signature\": \"\",
			\"url\": \"https://github.com/gaoDean/ttbl/releases/download/v1.0.0/ttbl-intel_tarball.tar.gz\"
		},
		\"darwin-aarch64\": {
			\"signature\": \"\",
			\"url\": \"https://github.com/gaoDean/ttbl/releases/download/v1.0.0/ttbl-m1_tarball.tar.gz\"
		}
	}
}" < test.json)
echo "$ret" > test.json
