import joblib
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
