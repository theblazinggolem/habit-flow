from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / '.env'
print(f"Path: {env_path}")
if env_path.exists():
    print("File exists.")
    try:
        content = env_path.read_text(encoding='utf-8')
        print("Content:")
        print(content)
    except Exception as e:
        print(f"Error reading path: {e}")
else:
    print("File does not exist.")
