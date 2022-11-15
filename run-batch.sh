while IFS= read -r line; do
    node kdb-test.js $line
done