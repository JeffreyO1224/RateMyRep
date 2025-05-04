from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_rep_reviews_valid(bioguideID):
    response = client.get(f"/members/{bioguideID}/reviews")

    print(response.json())

def test_get_bill_reviews_valid(bioguideID):
    response = client.get(f"/bills/{bioguideID}/reviews")
    print(response.json())

def test_create_rep_review_valid(bioguideID, username, rating, review_text):
    response = client.post(f"/bills/{bioguideID}/reviews/username={username}:rating={rating}:review_text={review_text}")
    print(response.json())

test_get_rep_reviews_valid('4')
test_get_bill_reviews_valid('4')
test_create_rep_review_valid('4', 'Jeffrey O.', 5, 'Goated')