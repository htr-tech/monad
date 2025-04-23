#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Error: No Argument"
    exit 1
fi

input_file=$1
output_file="${input_file%.*}-done.txt"

if [ ! -f "$input_file" ]; then
    echo "Error: $input_file not found"
    exit 1
fi

echo "[" > "$output_file"
# Remove whitespace, duplicate, blank lines
grep -v '^[[:space:]]*$' "$input_file" | awk '{$1=$1};1' | awk '!seen[$0]++' | while IFS= read -r line; do
    echo "  \"$line\"," >> "$output_file"
done

sed -i '$ s/,$//' "$output_file"
echo "]" >> "$output_file"
echo "Saved as $output_file"
