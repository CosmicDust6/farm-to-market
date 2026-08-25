import requests

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing /docs...")
    res = requests.get(f"{BASE_URL}/docs")
    print(res.status_code)

    # Login Farmer
    res = requests.post(f"{BASE_URL}/api/auth/farmer/login", json={
        "phone": "1234567890",
        "farmer_id": "FARM1001"
    })
    if res.status_code != 200:
        # Register if needed
        res = requests.post(f"{BASE_URL}/api/auth/farmer/register", json={
            "name": "John Farmer",
            "phone": "1234567890",
            "farmer_id": "FARM1001"
        })
    
    res = requests.post(f"{BASE_URL}/api/auth/farmer/login", json={"phone": "1234567890", "farmer_id": "FARM1001"})
    farmer_token = res.json().get("access_token")

    # Login Buyer
    res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "alice@example.com",
        "password": "password123"
    })
    if res.status_code != 200:
        res = requests.post(f"{BASE_URL}/api/auth/buyer/register", json={
            "name": "Alice Buyer",
            "email": "alice@example.com",
            "password": "password123",
            "confirm_password": "password123",
            "phone": "0987654321",
            "location": "Karnataka",
            "interested_crop": "Rice"
        })
    res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "alice@example.com", "password": "password123"})
    buyer_token = res.json().get("access_token")

    print("\nFarmer creates a listing...")
    res = requests.post(f"{BASE_URL}/api/listings", json={
        "crop_name": "Rice",
        "location": "Karnataka",
        "description": "Premium quality."
    }, headers={"Authorization": f"Bearer {farmer_token}"})
    print(res.status_code, res.text)

    print("\nFarmer creates second listing...")
    res = requests.post(f"{BASE_URL}/api/listings", json={
        "crop_name": "Rice",
        "location": "Kerala",
        "description": "Good quality."
    }, headers={"Authorization": f"Bearer {farmer_token}"})
    print(res.status_code, res.text)

    print("\nFarmer viewing own listings...")
    res = requests.get(f"{BASE_URL}/api/listings/my", headers={"Authorization": f"Bearer {farmer_token}"})
    print(res.status_code, len(res.json()))

    print("\nGuest viewing public listings...")
    res = requests.get(f"{BASE_URL}/api/listings")
    print(res.status_code, len(res.json()))

    print("\nBuyer creates a request...")
    res = requests.post(f"{BASE_URL}/api/requests", json={
        "crop_name": "Rice",
        "location": "Karnataka"
    }, headers={"Authorization": f"Bearer {buyer_token}"})
    print(res.status_code, res.text)
    request_id = res.json()["id"]

    print("\nBuyer retrieving own requests...")
    res = requests.get(f"{BASE_URL}/api/requests/my", headers={"Authorization": f"Bearer {buyer_token}"})
    print(res.status_code, len(res.json()))

    print("\nBuyer retrieving matches...")
    res = requests.get(f"{BASE_URL}/api/matches/{request_id}", headers={"Authorization": f"Bearer {buyer_token}"})
    print(res.status_code, res.text)

    print("\nGuest cannot access private requests...")
    res = requests.get(f"{BASE_URL}/api/requests/my")
    print(res.status_code) # Should be 401

    print("\nFarmer cannot create buyer requests...")
    res = requests.post(f"{BASE_URL}/api/requests", json={
        "crop_name": "Wheat",
        "location": "Delhi"
    }, headers={"Authorization": f"Bearer {farmer_token}"})
    print(res.status_code) # Should be 403

    print("\nBuyer cannot create farmer listings...")
    res = requests.post(f"{BASE_URL}/api/listings", json={
        "crop_name": "Wheat",
        "location": "Delhi"
    }, headers={"Authorization": f"Bearer {buyer_token}"})
    print(res.status_code) # Should be 403

if __name__ == "__main__":
    run_tests()
