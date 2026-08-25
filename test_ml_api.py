import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing /docs...")
    res = requests.get(f"{BASE_URL}/docs")
    print(res.status_code)

    print("\nTesting Crop Recommendation (No Auth)...")
    res = requests.post(f"{BASE_URL}/api/predictions/crop-recommendation", json={
        "soil_type": "loamy",
        "land_area": 2.5,
        "location": "Hyderabad",
        "budget": 50000,
        "water_availability": "medium"
    })
    print(res.status_code)
    print(json.dumps(res.json(), indent=2))

    print("\nTesting Price Prediction (No Auth)...")
    res = requests.post(f"{BASE_URL}/api/predictions/price", json={
        "crop": "tomato",
        "location": "Hyderabad"
    })
    print(res.status_code)
    print(json.dumps(res.json(), indent=2))

    print("\nConfirming existing auth still works (Buyer Login)...")
    res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "alice@example.com",
        "password": "password123"
    })
    print(res.status_code)
    if "access_token" in res.json():
        print("Auth successful!")
    else:
        print("Auth failed or user not seeded yet")

if __name__ == "__main__":
    run_tests()
