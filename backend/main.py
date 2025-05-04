from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os
from index import getConnection

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
    

'''
#############################
#############################
#####                   #####
#####   DATABASE APIS   #####
#####                   #####
#############################
#############################
'''

async def closeDBConnection(conn):
    await conn.close()

@app.get("/members/{bioguideID}/reviews")
async def getRepReviews(bioguideID):
    query = f'''
    SELECT * FROM Representative_Review WHERE rep_id={bioguideID};
    '''
    conn = await getConnection()

    try:
        rows = await conn.fetch(query, bioguideID)
        if not rows:
            insertRepQuery = f'''
            INSERT INTO REPRESENTATIVE (rep_id, full_name, rating)
            VALUES ('{bioguideID}', 'John Doe', 3.5);
            '''

            insertQuery = f'''
            INSERT INTO representative_review (rep_id, reviewer, created_at, rating, review)
            VALUES
                ('{bioguideID}', 'Alex P.', CURRENT_TIMESTAMP, 5, 'Always supports strong policy!'),
                ('{bioguideID}', 'Jordan M.', CURRENT_TIMESTAMP, 4, 'Generally good rep, some missed votes.'),
                ('{bioguideID}', 'Taylor S.', CURRENT_TIMESTAMP, 2, 'Not responsive to constituent concerns.'),
                ('{bioguideID}', 'Morgan K.', CURRENT_TIMESTAMP, 5, 'Excellent communication with the community.'),
                ('{bioguideID}', 'Chris R.', CURRENT_TIMESTAMP, 3, 'Mixed record on environmental issues.'),
                ('{bioguideID}', 'Riley T.', CURRENT_TIMESTAMP, 4, 'Good on healthcare, not great on tech.'),
                ('{bioguideID}', 'Casey L.', CURRENT_TIMESTAMP, 1, 'Does not represent our district well.'),
                ('{bioguideID}', 'Devon W.', CURRENT_TIMESTAMP, 5, 'Always votes in our best interest!'),
                ('{bioguideID}', 'Jesse B.', CURRENT_TIMESTAMP, 4, 'Solid voting record and transparency.'),
                ('{bioguideID}', 'Dana S.', CURRENT_TIMESTAMP, 2, 'Seems out of touch with local concerns.'),
                ('{bioguideID}', 'Skyler V.', CURRENT_TIMESTAMP, 3, 'Average performance, could improve.'),
                ('{bioguideID}', 'Sam G.', CURRENT_TIMESTAMP, 5, 'Top-notch representative!'),
                ('{bioguideID}', 'Jamie N.', CURRENT_TIMESTAMP, 4, 'Supportive of progressive policy.'),
                ('{bioguideID}', 'Robin Z.', CURRENT_TIMESTAMP, 1, 'Never replies to emails or calls.'),
                ('{bioguideID}', 'Quinn D.', CURRENT_TIMESTAMP, 2, 'Votes against majority interest.');
            '''

            try:
                await conn.fetch(insertRepQuery)
            except:
                print('Rep already exists')
            await conn.fetch(insertQuery)
            rows = await conn.fetch(query)
        return [{"reviewer": row['reviewer'], "rating": row['rating'], "review": row['review']} for row in rows]
    finally:
        await closeDBConnection(conn)

@app.get("/bills/{bioguideID}/reviews")
async def getBillReviews(bioguideID):
    query = f'''
    SELECT * FROM Bill_Review WHERE bill_id={bioguideID};
    '''
    conn = await getConnection()

    try:
        rows = await conn.fetch(query, bioguideID)
        if not rows:
            insertBillQuery = f'''
            INSERT INTO bill (bill_id, rating)
            VALUES ('{bioguideID}', 3.5);
            '''

            insertQuery = f'''
            INSERT INTO bill_review (bill_id, reviewer, created_at, rating, review)
            VALUES
                ('{bioguideID}', 'Alex P.', CURRENT_TIMESTAMP, 5, 'Pretty great'),
                ('{bioguideID}', 'Jordan M.', CURRENT_TIMESTAMP, 4, 'Its ok'),
                ('{bioguideID}', 'Taylor S.', CURRENT_TIMESTAMP, 2, 'Not a big fan of this one'),
                ('{bioguideID}', 'Morgan K.', CURRENT_TIMESTAMP, 5, 'This might save the state'),
                ('{bioguideID}', 'Chris R.', CURRENT_TIMESTAMP, 3, 'Almost a great bill'),
                ('{bioguideID}', 'Riley T.', CURRENT_TIMESTAMP, 4, 'This is pretty promising!'),
                ('{bioguideID}', 'Casey L.', CURRENT_TIMESTAMP, 1, 'Have you all gone insane?'),
                ('{bioguideID}', 'Devon W.', CURRENT_TIMESTAMP, 5, 'LETS DO IT!!'),
                ('{bioguideID}', 'Jesse B.', CURRENT_TIMESTAMP, 4, 'Fingers crossed this turns out great'),
                ('{bioguideID}', 'Dana S.', CURRENT_TIMESTAMP, 2, 'Seems out of touch with local concerns.'),
                ('{bioguideID}', 'Skyler V.', CURRENT_TIMESTAMP, 3, 'Doesnt do enough'),
                ('{bioguideID}', 'Sam G.', CURRENT_TIMESTAMP, 5, 'Amazing'),
                ('{bioguideID}', 'Jamie N.', CURRENT_TIMESTAMP, 4, 'Supportive of progressive policy.'),
                ('{bioguideID}', 'Robin Z.', CURRENT_TIMESTAMP, 1, 'This is going to do nothing for us'),
                ('{bioguideID}', 'Quinn D.', CURRENT_TIMESTAMP, 2, 'What is the point of this?');
            '''
            try:
                await conn.fetch(insertBillQuery)
            except:
                print("Bill already exists")
            await conn.fetch(insertQuery)
            rows = await conn.fetch(query)
        return [{"reviewer": row['reviewer'], "rating": row['rating'], "review": row['review']} for row in rows]
    finally:
        await closeDBConnection(conn)

# @app.post("/member/{bioguideID}/reviews")
# async def createRepReview(bioguideID, username, rating, review_text):
#     conn = await getConnection()

#     try:
#         query = f'''
#         INSERT INTO Representative_review (rep_id, reviewer, created_at, rating, review)
#         VALUES
#             ({bioguideID}, {username}, CURRENT_TIMESTAMP, {rating}, {review_text})
#         '''

#     finally:
#         await closeDBConnection(conn)
