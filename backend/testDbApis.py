from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_rep_reviews_valid(bioguideID):
    response = client.get(f"/members/{bioguideID}/reviews")

    print(response.json())

def test_get_bill_reviews_valid(bioguideID):
    response = client.get(f"/bills/{bioguideID}/reviews")
    print(response.json())

test_get_rep_reviews_valid('4')
test_get_bill_reviews_valid('4')