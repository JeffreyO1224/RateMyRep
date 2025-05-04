from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import asyncpg
import os
from dotenv import load_dotenv
from backend.index import getConnection

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

app = FastAPI()



# Define Pydantic models for request and response data
class Representative(BaseModel):
    bioguide_id: str
    full_name: str
    upvotes: int

class Bill(BaseModel):
    bill_id: str
    title: str

class Review(BaseModel):
    review_id: int
    review_text: str
    representative_name: str | None = None
    bill_id: str | None = None