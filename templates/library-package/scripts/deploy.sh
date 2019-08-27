#!/bin/bash

# note: This does not work with symlinks
cd "$(dirname "$0")"

if npm "run" "build" ; then
	npm "run" "semantic-release"
else
	echo "npm run build failed"
fi