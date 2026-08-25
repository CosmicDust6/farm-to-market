import requests

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    # Login Farmer
    res = requests.post(f"{BASE_URL}/api/auth/farmer/login", json={
        "phone": "1234567890",
        "farmer_id": "FARM1001"
    })
    if res.status_code != 200:
        res = requests.post(f"{BASE_URL}/api/auth/farmer/register", json={
            "name": "John Farmer",
            "phone": "1234567890",
            "farmer_id": "FARM1001"
        })
    res = requests.post(f"{BASE_URL}/api/auth/farmer/login", json={"phone": "1234567890", "farmer_id": "FARM1001"})
    farmer_token = res.json().get("access_token")

    # Login Buyer
    res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "freshmart@example.com",
        "password": "buyer123"
    })
    buyer_token = res.json().get("access_token")

    # Login Admin
    res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@farmtomarket.com",
        "password": "Admin@123"
    })
    admin_token = res.json().get("access_token")

    print("\\n1. Farmer calls GET /api/matches?crop=tomato&location=Hyderabad")
    res = requests.get(f"{BASE_URL}/api/matches?crop=tomato&location=Hyderabad", headers={"Authorization": f"Bearer {farmer_token}"})
    print(res.status_code)
    matches = res.json()
    print([m["name"] for m in matches])
    print(matches[0]["name"] if matches else "No matches") # Expect Fresh Mart or similar with 100 score

    print("\\n2. Buyer updates profile...")
    res = requests.put(f"{BASE_URL}/api/buyers/me", json={
        "location": "Warangal",
        "interested_crop": "rice"
    }, headers={"Authorization": f"Bearer {buyer_token}"})
    print(res.status_code)
    
    print("\\n3. Farmer searches for rice in Warangal...")
    res = requests.get(f"{BASE_URL}/api/matches?crop=rice&location=Warangal", headers={"Authorization": f"Bearer {farmer_token}"})
    matches = res.json()
    print([m["name"] for m in matches])

    print("\\n4. Guest calls GET /api/matches (Should fail 401)")
    res = requests.get(f"{BASE_URL}/api/matches?crop=tomato&location=Hyderabad")
    print(res.status_code)

    print("\\n5. Admin calls GET /api/admin/farmers")
    res = requests.get(f"{BASE_URL}/api/admin/farmers", headers={"Authorization": f"Bearer {admin_token}"})
    print(res.status_code, len(res.json()))

    print("\\n6. Admin calls GET /api/admin/buyers")
    res = requests.get(f"{BASE_URL}/api/admin/buyers", headers={"Authorization": f"Bearer {admin_token}"})
    print(res.status_code, len(res.json()))

if __name__ == "__main__":
    run_tests()
