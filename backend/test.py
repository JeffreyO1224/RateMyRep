from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_rep_by_state_valid(statecode):
    """Test /members/{statecode} with a valid state code (e.g., MI)."""
    response = client.get(f"/members/{statecode}")
    #assert response.status_code == 200

    print(response.json())
    #assert "members" in data
    #assert isinstance(data["members"], list)

    #if data["members"]:
    #    member = data["members"][0]
    #    assert "bioguideId" in member
    #    assert "name" in member
    #    assert "state" in member
    #    assert "partyName" in member

test_get_rep_by_state_valid("NY")