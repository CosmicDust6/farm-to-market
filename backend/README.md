# Farm to Market Backend
Hackathon MVP Backend

## Project Overview
This project provides the backend APIs for a Farm-to-Market marketplace MVP. It includes:
- Authentication (JWT-based) for Farmers, Buyers, and Admins.
- Machine Learning (Synthetic) Crop Recommendation & Price Prediction.
- Buyer/Farmer Matching Algorithm.
- Lightweight Support Query Management for Admins.

## Tech Stack
- **Python 3.10+**
- **FastAPI**
- **PostgreSQL** (via SQLAlchemy)
- **Pydantic v2**
- **Scikit-Learn** (for ML models)
- **Pandas/Numpy** (for data generation)

## PostgreSQL Setup
Ensure you have a running instance of PostgreSQL. By default, the application will attempt to connect using the connection string defined in your environment variables. If PostgreSQL isn't available, SQLite will be used as a fallback for simple local testing.

## Environment Variables
Create a `.env` file in the `backend/` directory:
```
DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET_KEY=yoursupersecretkey
```
*(See `.env.example` for reference)*

## Installation
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Generate Data and Train ML Models
**Note:** The crop and price training data in this MVP is entirely synthetic and algorithmically generated for demonstration purposes. The price predictions are demo model predictions and do not represent live market data.

To generate the datasets and train the `scikit-learn` models:
```bash
python -m backend.ml.train_models
```

## Running the Application
To start the FastAPI server with auto-reload:
```bash
uvicorn backend.app.main:app --reload
```

## Swagger API Documentation
Once the server is running, the interactive API documentation will be available at:
- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Demo Credentials
### 1. Farmer
Farmers use a specific ID to register and login instead of passwords. The database seeds with the following IDs:
- `FARM1001`
- `FARM1002`
- `FARM1003`
- `FARM1004`
- `FARM1005`

*Registration requires Name, Phone, and Farmer ID. Login uses Phone and Farmer ID.*

### 2. Buyer
You can register a new buyer, or you can run `python backend/seed_demo_data.py` to seed several demo buyers:
- **Email:** `freshmart@example.com`
- **Password:** `buyer123`

### 3. Admin
An admin is automatically seeded on startup:
- **Email:** `admin@farmtomarket.com`
- **Password:** `Admin@123`
