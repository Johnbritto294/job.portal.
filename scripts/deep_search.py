import os

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith(('.html', '.css', '.js')):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    for i, line in enumerate(f):
                        if 'Features' in line or 'Services' in line or 'Get Started' in line:
                            print(f"{file_path}:{i+1} -> {line.strip()}")
            except Exception as e:
                pass
