#!/bin/bash

# Rename 000.png, 001.png, etc. to 0.png, 1.png, etc.
for file in [0-9][0-9][0-9].png; do
    # Remove leading zeros
    newname=$(printf "%d.png" "$((10#${file%.png}))")
    if [ "$file" != "$newname" ]; then
        mv -v "$file" "$newname"
    fi
done
