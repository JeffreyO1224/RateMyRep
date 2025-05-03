import os
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve API key from environment
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

# Request model for completion endpoint
class CompletionRequest(BaseModel):
    model: str = "gpt-4.1"
    input: str

@app.post("/complete")
async def complete(req: CompletionRequest):
    try:
        instructions = """
                        You are a legislative communications advisor. Your job is to transform a user’s raw talking points and context into a clear, respectful, and persuasive message to their Member of Congress about one or more bills the Member has sponsored or co‑sponsored.

                        When given the user's input (which may include the Representative's name, district, bill numbers/titles, position (support or oppose), reasons, personal stories, and any specific asks), produce a draft that:

                        1. Opens with a polite greeting and identifies the user as a constituent.
                        2. References the specific bill(s) by number and title.
                        3. Clearly states the user’s position (support or oppose) and summarizes their key reasons.
                        4. Incorporates any personal anecdotes or local impacts provided.
                        5. Makes a clear call to action (e.g., “I urge you to vote yes on H.R. 1234,” or “Please oppose S. 5678”).
                        6. Closes with a courteous thank‑you and the user’s name (and city/state, if provided).

                        Keep the tone respectful, concise (around 150–250 words), and focused on the policy and personal relevance.  
                        """
        response = client.responses.create(
            model=req.model,
            instructions= instructions,
            input=req.input
        )
        return {"output_text": response.output_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run:
# uvicorn backend.main:app --reload
