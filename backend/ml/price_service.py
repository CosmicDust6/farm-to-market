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

def normalize_crop(crop):
    c = str(crop).lower().strip()
    return c if c else 'wheat'

def normalize_location(loc):
    l = str(loc).strip().title()
    return l if l else 'Hyderabad'

def predict_price(crop, location):
    model = get_price_model()
    if not model:
        raise Exception("Price model not loaded. Please train the model first.")
        
    clean_crop = normalize_crop(crop)
    clean_loc = normalize_location(location)
    
    now = datetime.now()
    
    current_data = pd.DataFrame([{
        'crop': clean_crop,
        'location': clean_loc,
        'year': now.year,
        'month': now.month,
        'day_of_year': now.timetuple().tm_yday
    }])
    
    future_date = now + pd.Timedelta(days=30)
    future_data = pd.DataFrame([{
        'crop': clean_crop,
        'location': clean_loc,
        'year': future_date.year,
        'month': future_date.month,
        'day_of_year': future_date.timetuple().tm_yday
    }])
    
    current_price = float(model.predict(current_data)[0])
    predicted_price = float(model.predict(future_data)[0])
    
    # Generate 6-point trend series
    history_and_forecast = []
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for offset in range(-2, 4):
        p_date = now + pd.DateOffset(months=offset)
        p_data = pd.DataFrame([{
            'crop': clean_crop,
            'location': clean_loc,
            'year': p_date.year,
            'month': p_date.month,
            'day_of_year': p_date.timetuple().tm_yday
        }])
        val = float(model.predict(p_data)[0])
        history_and_forecast.append({
            "month": month_names[p_date.month - 1],
            "price": round(val, 0),
            "is_future": offset > 0
        })

    change = predicted_price - current_price
    change_percentage = (change / current_price) * 100 if current_price > 0 else 0
    
    trend = "stable"
    if change_percentage > 2:
        trend = "up"
    elif change_percentage < -2:
        trend = "down"
        
    return {
        "crop": clean_crop.capitalize(),
        "location": clean_loc,
        "current_price": round(current_price, 2),
        "predicted_price": round(predicted_price, 2),
        "trend": trend,
        "change_percentage": round(change_percentage, 2),
        "history": history_and_forecast
    }

