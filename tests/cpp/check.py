import sys
import difflib

if len(sys.argv) != 3:
    print("Usage: python compare_files.py <file1> <file2>")
    sys.exit(1)

file1_path = sys.argv[1]
file2_path = sys.argv[2]

file1_lines = open(file1_path, "r").readlines()
file2_lines = open(file2_path, "r").readlines()

diff_result = list(difflib.unified_diff(file1_lines, file2_lines))

for line in diff_result:
    print(line)

if diff_result:
    sys.exit(1)
else:
    sys.exit(0)
