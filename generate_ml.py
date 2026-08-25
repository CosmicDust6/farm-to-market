import os

# Create directories
os.makedirs("backend/data", exist_ok=True)
os.makedirs("backend/ml", exist_ok=True)
os.makedirs("backend/model", exist_ok=True)

files = {
    "backend/data/generate_crop_dataset.py": """import pandas as pd
import numpy as np
import random
import os

def generate_crop_dataset(num_records=5000):
    np.random.seed(42)
    random.seed(42)
    
    soil_types = ['sandy', 'loamy', 'clay', 'black', 'red']
    water_availability = ['low', 'medium', 'high']
    locations = ['Hyderabad', 'Warangal', 'Vijayawada', 'Bengaluru', 'Pune', 'Nashik', 'Delhi', 'Jaipur', 'Lucknow']
    
    crops = {
        'rice': {'soil': ['loamy', 'clay'], 'water': ['high', 'medium'], 'budget': (30000, 80000), 'locations': ['Hyderabad', 'Vijayawada', 'Bengaluru']},
        'wheat': {'soil': ['loamy'], 'water': ['medium'], 'budget': (25000, 60000), 'locations': ['Delhi', 'Jaipur', 'Lucknow', 'Pune']},
        'maize': {'soil': ['loamy', 'black'], 'water': ['medium', 'high'], 'budget': (20000, 50000), 'locations': ['Warangal', 'Pune', 'Hyderabad', 'Bengaluru']},
        'cotton': {'soil': ['black', 'red'], 'water': ['medium'], 'budget': (40000, 90000), 'locations': ['Warangal', 'Pune', 'Nashik', 'Hyderabad']},
        'groundnut': {'soil': ['sandy', 'red'], 'water': ['low', 'medium'], 'budget': (15000, 40000), 'locations': ['Jaipur', 'Warangal', 'Nashik']},
        'millet': {'soil': ['sandy', 'red'], 'water': ['low', 'medium'], 'budget': (10000, 30000), 'locations': ['Jaipur', 'Delhi', 'Pune']},
        'tomato': {'soil': ['loamy'], 'water': ['medium', 'high'], 'budget': (35000, 75000), 'locations': ['Nashik', 'Bengaluru', 'Vijayawada']},
        'potato': {'soil': ['loamy'], 'water': ['medium'], 'budget': (30000, 65000), 'locations': ['Lucknow', 'Delhi', 'Pune']},
        'onion': {'soil': ['loamy', 'sandy'], 'water': ['medium'], 'budget': (25000, 60000), 'locations': ['Nashik', 'Pune', 'Vijayawada']},
        'soybean': {'soil': ['black', 'loamy'], 'water': ['medium'], 'budget': (25000, 55000), 'locations': ['Pune', 'Nashik', 'Hyderabad']},
        'chilli': {'soil': ['loamy', 'red'], 'water': ['medium'], 'budget': (40000, 85000), 'locations': ['Warangal', 'Vijayawada', 'Bengaluru']}
    }
    
    data = []
    
    for _ in range(num_records):
        crop = random.choice(list(crops.keys()))
        profile = crops[crop]
        
        # 80% chance to follow profile exactly, 20% noise
        if random.random() < 0.8:
            soil = random.choice(profile['soil'])
            water = random.choice(profile['water'])
            loc = random.choice(profile['locations'])
        else:
            soil = random.choice(soil_types)
            water = random.choice(water_availability)
            loc = random.choice(locations)
            
        min_b, max_b = profile['budget']
        budget = random.randint(min_b, max_b)
        if random.random() > 0.8:
            budget += random.randint(-10000, 10000)
            
        land_area = round(random.uniform(1.0, 20.0), 1)
        # Budget scales roughly with land area
        final_budget = max(5000, int(budget * (land_area / 5.0)))
        
        data.append({
            'soil_type': soil,
            'land_area': land_area,
            'location': loc,
            'budget': final_budget,
            'water_availability': water,
            'crop': crop
        })
        
    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname('backend/data/crop_recommendation.csv'), exist_ok=True)
    df.to_csv('backend/data/crop_recommendation.csv', index=False)
    print(f"Generated {num_records} records for crop recommendation.")

if __name__ == '__main__':
    generate_crop_dataset()
""",

    "backend/data/generate_price_dataset.py": """import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_price_dataset():
    np.random.seed(42)
    
    crops = ['rice', 'wheat', 'maize', 'cotton', 'groundnut', 'millet', 'tomato', 'potato', 'onion', 'soybean', 'chilli']
    locations = ['Hyderabad', 'Warangal', 'Vijayawada', 'Bengaluru', 'Pune', 'Nashik', 'Delhi', 'Jaipur', 'Lucknow']
    
    base_prices = {
        'rice': 2500, 'wheat': 2200, 'maize': 1800, 'cotton': 6000, 'groundnut': 5000,
        'millet': 1500, 'tomato': 2000, 'potato': 1200, 'onion': 1800, 'soybean': 4000, 'chilli': 15000
    }
    
    volatilities = {
        'tomato': 0.3, 'onion': 0.25, 'chilli': 0.2, 'potato': 0.15,
        'cotton': 0.1, 'groundnut': 0.08, 'soybean': 0.08,
        'rice': 0.05, 'wheat': 0.05, 'maize': 0.06, 'millet': 0.04
    }
    
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2025, 12, 31)
    date_range = pd.date_range(start_date, end_date, freq='D')
    
    data = []
    
    for crop in crops:
        for loc in locations:
            # Base price adjustment for location
            loc_modifier = np.random.uniform(0.9, 1.1)
            crop_base = base_prices[crop] * loc_modifier
            volatility = volatilities[crop]
            
            # Random walk with seasonal component
            price = crop_base
            for date in date_range:
                # Seasonality (yearly cycle)
                day_of_year = date.timetuple().tm_yday
                season_effect = np.sin(day_of_year * 2 * np.pi / 365) * (volatility * 0.5 * crop_base)
                
                # Daily random walk
                change = np.random.normal(0, volatility * 0.1 * crop_base)
                price = max(crop_base * 0.5, price + change) 
                
                # Gradual trend
                trend = (date - start_date).days * (crop_base * 0.0001)
                
                final_price = max(100, int(price + season_effect + trend))
                
                data.append({
                    'date': date,
                    'crop': crop,
                    'location': loc,
                    'market_price': final_price
                })
                
    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname('backend/data/price_history.csv'), exist_ok=True)
    df.to_csv('backend/data/price_history.csv', index=False)
    print(f"Generated {len(df)} records for price history.")

if __name__ == '__main__':
    generate_price_dataset()
""",

    "backend/ml/__init__.py": "",

    "backend/ml/train_crop_model.py": """import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train_crop_model():
    print("Training Crop Recommendation Model...")
    df = pd.read_csv('backend/data/crop_recommendation.csv')
    
    X = df[['soil_type', 'land_area', 'location', 'budget', 'water_availability']]
    y = df['crop']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    categorical_features = ['soil_type', 'location', 'water_availability']
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Crop Model Accuracy: {acc:.4f}")
    print("\\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    os.makedirs('backend/model', exist_ok=True)
    joblib.dump(pipeline, 'backend/model/crop_recommendation.pkl')
    print("Saved model to backend/model/crop_recommendation.pkl")

if __name__ == '__main__':
    train_crop_model()
""",

    "backend/ml/train_price_model.py": """import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, root_mean_squared_error
import joblib
import os

def train_price_model():
    print("Training Price Prediction Model...")
    df = pd.read_csv('backend/data/price_history.csv')
    df['date'] = pd.to_datetime(df['date'])
    
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day_of_year'] = df['date'].dt.dayofyear
    
    X = df[['crop', 'location', 'year', 'month', 'day_of_year']]
    y = df['market_price']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    categorical_features = ['crop', 'location']
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1))
    ])
    
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = root_mean_squared_error(y_test, y_pred)
    
    print(f"Price Model MAE: {mae:.2f}")
    print(f"Price Model RMSE: {rmse:.2f}")
    
    os.makedirs('backend/model', exist_ok=True)
    joblib.dump(pipeline, 'backend/model/price_prediction.pkl')
    print("Saved model to backend/model/price_prediction.pkl")

if __name__ == '__main__':
    train_price_model()
""",

    "backend/ml/train_models.py": """from .train_crop_model import train_crop_model
from .train_price_model import train_price_model
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data.generate_crop_dataset import generate_crop_dataset
from data.generate_price_dataset import generate_price_dataset

def main():
    print("Step 1: Generating crop dataset...")
    generate_crop_dataset()
    
    print("\\nStep 2: Training crop model...")
    train_crop_model()
    
    print("\\nStep 3: Generating price dataset...")
    generate_price_dataset()
    
    print("\\nStep 4: Training price model...")
    train_price_model()
    
    print("\\nAll models trained and saved successfully.")

if __name__ == '__main__':
    main()
""",

    "backend/ml/crop_service.py": """import joblib
import pandas as pd
import os

_model = None

def get_crop_model():
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'crop_recommendation.pkl')
        if os.path.exists(model_path):
            _model = joblib.load(model_path)
    return _model

def recommend_crop(soil_type, land_area, location, budget, water_availability):
    model = get_crop_model()
    if not model:
        raise Exception("Crop model not loaded. Please train the model first.")
        
    input_data = pd.DataFrame([{
        'soil_type': soil_type,
        'land_area': land_area,
        'location': location,
        'budget': budget,
        'water_availability': water_availability
    }])
    
    probs = model.predict_proba(input_data)[0]
    classes = model.classes_
    
    predictions = [{'crop': str(classes[i]), 'confidence': float(probs[i])} for i in range(len(classes))]
    predictions = sorted(predictions, key=lambda x: x['confidence'], reverse=True)
    
    top_recommendations = predictions[:3]
    
    return {
        "recommended_crop": top_recommendations[0]['crop'],
        "confidence": top_recommendations[0]['confidence'],
        "top_recommendations": top_recommendations
    }
""",

    "backend/ml/price_service.py": """import joblib
import pandas as pd
import os
from datetime import datetime

_model = None

def get_price_model():
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'price_prediction.pkl')
        if os.path.exists(model_path):
            _model = joblib.load(model_path)
    return _model

def predict_price(crop, location):
    model = get_price_model()
    if not model:
        raise Exception("Price model not loaded. Please train the model first.")
        
    now = datetime.now()
    
    current_data = pd.DataFrame([{
        'crop': crop,
        'location': location,
        'year': now.year,
        'month': now.month,
        'day_of_year': now.timetuple().tm_yday
    }])
    
    future_date = now + pd.Timedelta(days=30)
    future_data = pd.DataFrame([{
        'crop': crop,
        'location': location,
        'year': future_date.year,
        'month': future_date.month,
        'day_of_year': future_date.timetuple().tm_yday
    }])
    
    current_price = float(model.predict(current_data)[0])
    predicted_price = float(model.predict(future_data)[0])
    
    change = predicted_price - current_price
    change_percentage = (change / current_price) * 100 if current_price > 0 else 0
    
    trend = "stable"
    if change_percentage > 2:
        trend = "increasing"
    elif change_percentage < -2:
        trend = "decreasing"
        
    return {
        "crop": crop,
        "location": location,
        "current_price": round(current_price, 2),
        "predicted_price": round(predicted_price, 2),
        "trend": trend,
        "change_percentage": round(change_percentage, 2)
    }
""",

    "backend/app/routes/predictions.py": """from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...ml.crop_service import recommend_crop
from ...ml.price_service import predict_price

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

class CropPredictionRequest(BaseModel):
    soil_type: str
    land_area: float
    location: str
    budget: float
    water_availability: str

class PricePredictionRequest(BaseModel):
    crop: str
    location: str

@router.post("/crop-recommendation")
def predict_crop(request: CropPredictionRequest):
    try:
        return recommend_crop(
            soil_type=request.soil_type,
            land_area=request.land_area,
            location=request.location,
            budget=request.budget,
            water_availability=request.water_availability
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/price")
def predict_market_price(request: PricePredictionRequest):
    try:
        return predict_price(
            crop=request.crop,
            location=request.location
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""
}

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)
