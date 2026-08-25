import requests
import json

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

    print("\\n1. Guest tries to access Admin Support (Should be 401)")
    res = requests.get(f"{BASE_URL}/api/admin/support")
    print(res.status_code)

    print("\\n2. Buyer tries to access Admin Stats (Should be 403)")
    res = requests.get(f"{BASE_URL}/api/admin/stats", headers={"Authorization": f"Bearer {buyer_token}"})
    print(res.status_code)

    print("\\n3. Farmer creates a support query")
    res = requests.post(f"{BASE_URL}/api/support", json={
        "question": "I need help understanding crop prices."
    }, headers={"Authorization": f"Bearer {farmer_token}"})
    print(res.status_code, res.json())
    query_id = res.json()["id"]

    print("\\n4. Farmer views their own support queries")
    res = requests.get(f"{BASE_URL}/api/support/my", headers={"Authorization": f"Bearer {farmer_token}"})
    print(res.status_code, len(res.json()))

    print("\\n5. Admin views stats")
    res = requests.get(f"{BASE_URL}/api/admin/stats", headers={"Authorization": f"Bearer {admin_token}"})
    print(res.status_code, res.json())

    print("\\n6. Admin views support queries")
    res = requests.get(f"{BASE_URL}/api/admin/support", headers={"Authorization": f"Bearer {admin_token}"})
    print(res.status_code, len(res.json()))

    print("\\n7. Admin resolves support query")
    res = requests.patch(f"{BASE_URL}/api/admin/support/{query_id}", json={
        "status": "resolved"
    }, headers={"Authorization": f"Bearer {admin_token}"})
    print(res.status_code, res.json())

    print("\\n8. Farmer checks resolved status")
    res = requests.get(f"{BASE_URL}/api/support/my", headers={"Authorization": f"Bearer {farmer_token}"})
    print(res.status_code, res.json()[0]["status"])

if __name__ == "__main__":
    run_tests()
