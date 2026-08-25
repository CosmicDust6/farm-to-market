import requests

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing farmer registration...")
    res = requests.post(f"{BASE_URL}/api/auth/farmer/register", json={
        "name": "John Farmer",
        "phone": "1234567890",
        "farmer_id": "FARM1001"
    })
    print(res.status_code, res.text)
    
    print("\nTesting farmer login...")
    res = requests.post(f"{BASE_URL}/api/auth/farmer/login", json={
        "phone": "1234567890",
        "farmer_id": "FARM1001"
    })
    print(res.status_code, res.text)
    farmer_token = res.json().get("access_token")

    print("\nTesting buyer registration...")
    res = requests.post(f"{BASE_URL}/api/auth/buyer/register", json={
        "name": "Alice Buyer",
        "email": "alice@example.com",
        "password": "password123",
        "confirm_password": "password123",
        "phone": "0987654321",
        "location": "City Center",
        "interested_crop": "Wheat"
    })
    print(res.status_code, res.text)
    
    print("\nTesting buyer login...")
    res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "alice@example.com",
        "password": "password123"
    })
    print(res.status_code, res.text)
    buyer_token = res.json().get("access_token")
    
    print("\nTesting /api/auth/me for buyer...")
    res = requests.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": f"Bearer {buyer_token}"})
    print(res.status_code, res.text)

    print("\nTesting admin login...")
    res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@farmtomarket.com",
        "password": "Admin@123"
    })
    print(res.status_code, res.text)
    admin_token = res.json().get("access_token")

    print("\nTesting /api/auth/me for admin...")
    res = requests.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    print(res.status_code, res.text)

if __name__ == "__main__":
    run_tests()
