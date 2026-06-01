import glob
import re

html_files = glob.glob('*.html')
for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        match = re.search(r'<header.*?</header>', content, re.DOTALL)
        if match:
            print(f"File: {file_path}")
            print(match.group(0))
            print("-" * 40)
