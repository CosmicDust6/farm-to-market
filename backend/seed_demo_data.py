from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

demo_buyers = [
    {"name": "Fresh Mart", "email": "freshmart@example.com", "phone": "9876543210", "location": "Hyderabad", "interested_crop": "tomato"},
    {"name": "Green Foods", "email": "greenfoods@example.com", "phone": "9123456789", "location": "Warangal", "interested_crop": "tomato"},
    {"name": "Agro Buyers", "email": "agrobuyers@example.com", "phone": "9988776655", "location": "Hyderabad", "interested_crop": "rice"},
    {"name": "City Grocers", "email": "citygrocers@example.com", "phone": "8877665544", "location": "Bengaluru", "interested_crop": "tomato"},
    {"name": "Wheat Traders", "email": "wheattraders@example.com", "phone": "7766554433", "location": "Delhi", "interested_crop": "wheat"},
    {"name": "Spice Co", "email": "spiceco@example.com", "phone": "6655443322", "location": "Vijayawada", "interested_crop": "chilli"},
    {"name": "Daily Needs", "email": "dailyneeds@example.com", "phone": "5544332211", "location": "Pune", "interested_crop": "onion"},
    {"name": "Mega Mart", "email": "megamart@example.com", "phone": "4433221100", "location": "Hyderabad", "interested_crop": "chilli"},
    {"name": "Super Spuds", "email": "superspuds@example.com", "phone": "3322110099", "location": "Lucknow", "interested_crop": "potato"},
    {"name": "Nutty Traders", "email": "nuttytraders@example.com", "phone": "2211009988", "location": "Jaipur", "interested_crop": "groundnut"},
]

def seed():
    db = SessionLocal()
    try:
        print("Seeding demo buyers...")
        for b_data in demo_buyers:
            existing = db.query(User).filter(User.email == b_data["email"]).first()
            if not existing:
                new_buyer = User(
                    name=b_data["name"],
                    email=b_data["email"],
                    phone=b_data["phone"],
                    location=b_data["location"],
                    interested_crop=b_data["interested_crop"],
                    role="buyer",
                    password_hash=get_password_hash("buyer123")
                )
                db.add(new_buyer)
        db.commit()
        print("Demo buyers seeded successfully!")
    except Exception as e:
        print(f"Error seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
