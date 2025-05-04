from dotenv import load_dotenv
from pathlib import Path
import os
import asyncpg

async def getConnection():
    current_dir = Path(__file__).parent
    env_path = current_dir.parent.parent / '.env'
    load_dotenv(dotenv_path=env_path)
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_DATABASE = os.getenv("DB_DATABASE")


    conn = await asyncpg.connect(f"postgres://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}?sslmode=require")

    return conn


if __name__ == "__main__":
    getConnection()