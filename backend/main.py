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
from index import getConnection


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

@app.get("/bill/{billNumber}")
def get_bill(billNumber):
    url = f"https://api.congress.gov/v3/bill/119/hr/{billNumber}?api_key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error fetching data: {str(e)}")
    
@app.get("/cosponsors/{billNumber}")
def get_cosponsor_by_bill(billNumber):
    url = f"https://api.congress.gov/v3/bill/117/hr/{billNumber}/cosponsors?api_key=[{API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error fetching data: {str(e)}")
    
@app.get("/billdetails/{url}")
def get_bill_details():
    url = f"{url}?api_key={API_KEY}"
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
    SELECT * FROM Representative_Review WHERE rep_id='{bioguideID}';
    '''
    conn = await getConnection()

    try:
        rows = await conn.fetch(query)
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
    SELECT * FROM Bill_Review WHERE bill_id='{bioguideID}';
    '''
    conn = await getConnection()

    try:
        rows = await conn.fetch(query)
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

@app.post("/members/{bioguideID}/reviews/username={username}:rating={rating}:review_text={review_text}")
async def createRepReview(bioguideID, username, rating, review_text):
    conn = await getConnection()

    try:
        query = f'''
        INSERT INTO Representative_review (rep_id, reviewer, created_at, rating, review)
        VALUES
            ('{bioguideID}', '{username}', CURRENT_TIMESTAMP, '{rating}', '{review_text}')
        '''

        try:
            await conn.fetch(f'''INSERT INTO USERS (username, password) VALUES ('{username}', 'default_password')''')
        except:
            print("Failed for some reason. User probably already exists")
        await conn.fetch(query)

    finally:
        await closeDBConnection(conn)

@app.post("/bills/{bioguideID}/reviews/username={username}:rating={rating}:review_text={review_text}")
async def createBillReview(bioguideID, username, rating, review_text):
    conn = await getConnection()

    try:
        query = f'''
        INSERT INTO bill_review (bill_id, reviewer, created_at, rating, review)
        VALUES
            ('{bioguideID}', '{username}', CURRENT_TIMESTAMP, '{rating}', '{review_text}')
        '''

        try:
            await conn.fetch(f'''INSERT INTO USERS (username, password) VALUES ('{username}', 'default_password')''')
        except:
            print("Failed for some reason. User probably already exists")
        await conn.fetch(query)

    finally:
        await closeDBConnection(conn)
    
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
