from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os
from openai import OpenAI
from typing import Any, Dict
import json

app = FastAPI()

class AIRequest(BaseModel):
    name: str
    occupation: str
    neighborhood: str
    state: str
    concerns: str
    message: str
    sponsoredBills: str
    cosponsoredBills: str
    memberDetails: Dict[str, Any]

class Depiction(BaseModel):
    attribution: Optional[str]
    imageUrl: Optional[str]


class Term(BaseModel):
    chamber: Optional[str]
    startYear: Optional[int]


class Terms(BaseModel):
    item: List[Term]


class Member(BaseModel):
    bioguideId: str
    depiction: Optional[Depiction]
    district: Optional[int]
    name: str
    partyName: str
    state: str
    terms: Optional[Terms]
    updateDate: Optional[str]
    url: Optional[str]


class MembersResponse(BaseModel):
    members: List[Member]


class LatestAction(BaseModel):
    actionDate: str
    text: str


class PolicyArea(BaseModel):
    name: str


class CosponsoredLegislation(BaseModel):
    congress: int
    introducedDate: str
    latestAction: LatestAction
    number: str
    policyArea: PolicyArea
    title: str
    type: str
    url: str


class CosponsoredLegislationResponse(BaseModel):
    cosponsoredLegislation: List[CosponsoredLegislation]

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)
load_dotenv()
API_KEY = os.getenv("VITE_REACT_APP_CONGRESS_API_KEY")

openai_api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=openai_api_key)



@app.post("/draft")
async def AIDraft(req: AIRequest):
    try:
        instructions = """
                        You are a legislative communications advisor. Your job is to transform a user’s raw talking points and context into a clear, respectful, and persuasive message to their Member of Congress about one or more bills the Member has sponsored or co‑sponsored.
                        You will be provided with a representative's name, district, and a list of bills they have sponsored or co-sponsored. You will also receive the user's input, which may include the Representative's name, district, bill numbers/titles, position (support or oppose), reasons, personal stories, and any specific asks.
                        Your task is to draft a message that the user can send to their Member of Congress. The message should be concise, respectful, and focused on the policy and personal relevance. It should be around 150–250 words in length.
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
            model="gpt-4.1",
            instructions=instructions,
            input=json.dumps(req.dict())
        )
        return {"output_text": response.output_text}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/members/{statecode}")
def get_rep_by_state(statecode):
    url = f"https://api.congress.gov/v3/member/{statecode.upper()}?api_key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error fetching data: {str(e)}")
    
@app.get("/sponsorbills/{bioguideID}")
def get_sponsor_bills_by_rep(bioguideID):
    url = f"https://api.congress.gov/v3/member/{bioguideID}/sponsored-legislation?api_key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error fetching data: {str(e)}")
    
@app.get("/cosponsorbills/{bioguideID}")
def get_cosponsor_bills_by_rep(bioguideID):
    url = f"https://api.congress.gov/v3/member/{bioguideID}/cosponsored-legislation?api_key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error fetching data: {str(e)}")
    
@app.get("/member/{bioguideID}")
def get_rep(bioguideID):
    url = f"https://api.congress.gov/v3/member/{bioguideID}?api_key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error fetching data: {str(e)}")
    
@app.get("/bulk/member")
def get_reps(bioguideList: list[str] = Query(...)):
    print(bioguideList)
    members = []
    for bioguide_id in bioguideList:
        url = f"https://api.congress.gov/v3/member/{bioguide_id}?api_key={API_KEY}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            members.append(response.json())
        except requests.RequestException as e:
            raise HTTPException(status_code=502, detail=f"Error fetching data for {bioguide_id}: {str(e)}")
    return {"members": members}
