from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os

app = FastAPI()



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