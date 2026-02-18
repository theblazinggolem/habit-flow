import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

url = os.getenv("NEON_URL")
if url and url.startswith("postgres://"):
    url = url.replace("postgres://", "postgresql://", 1)

print(f"Testing connection to: {url.split('@')[1] if '@' in url else 'LOCAL/INVALID'}")

try:
    conn = psycopg2.connect(url)
    print("Connection successful!")
    cur = conn.cursor()
    cur.execute("SELECT version();")
    print(cur.fetchone())
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
