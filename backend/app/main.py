from fastapi import FastAPI
from .database import engine, Base, SessionLocal
from .models import ValidFarmerID, User
from .auth import get_password_hash
from .routes import auth, listings, requests, matches, predictions, buyers, admin, support

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Farm to Market MVP")

app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(requests.router)
app.include_router(matches.router)
app.include_router(predictions.router)
app.include_router(buyers.router)
app.include_router(admin.router)
app.include_router(support.router)

@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    
    # Seed valid farmer IDs
    demo_farmers = ["FARM1001", "FARM1002", "FARM1003", "FARM1004", "FARM1005"]
    for f_id in demo_farmers:
        exists = db.query(ValidFarmerID).filter(ValidFarmerID.farmer_id == f_id).first()
        if not exists:
            db.add(ValidFarmerID(farmer_id=f_id))
            
    # Seed admin user
    admin_email = "admin@farmtomarket.com"
    admin_exists = db.query(User).filter(User.email == admin_email).first()
    if not admin_exists:
        admin = User(
            name="Admin",
            email=admin_email,
            password_hash=get_password_hash("Admin@123"),
            role="admin"
        )
        db.add(admin)
        
    db.commit()
    db.close()

@app.get("/")
def root():
    return {"message": "Welcome to Farm to Market API"}
