import joblib
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

def normalize_soil(soil):
    s = str(soil).lower().replace("soil", "").strip()
    for v in ['sandy', 'loamy', 'clay', 'black', 'red']:
        if v in s:
            return v
    return 'loamy'

def normalize_water(water):
    w = str(water).lower().strip()
    for v in ['low', 'medium', 'high']:
        if v in w:
            return v
    return 'medium'

def normalize_location(loc):
    l = str(loc).strip().title()
    return l if l else 'Hyderabad'

def recommend_crop(soil_type, land_area, location, budget, water_availability):
    model = get_crop_model()
    if not model:
        raise Exception("Crop model not loaded. Please train the model first.")
        
    clean_soil = normalize_soil(soil_type)
    clean_water = normalize_water(water_availability)
    clean_loc = normalize_location(location)
    clean_land = float(land_area) if land_area else 2.0
    clean_budget = float(budget) if budget else 30000.0

    input_data = pd.DataFrame([{
        'soil_type': clean_soil,
        'land_area': clean_land,
        'location': clean_loc,
        'budget': clean_budget,
        'water_availability': clean_water
    }])
    
    probs = model.predict_proba(input_data)[0]
    classes = model.classes_
    
    predictions = [{'crop': str(classes[i]).capitalize(), 'confidence': round(float(probs[i]) * 100, 1)} for i in range(len(classes))]
    predictions = sorted(predictions, key=lambda x: x['confidence'], reverse=True)
    
    top_recommendations = predictions[:3]
    
    return {
        "recommended_crop": top_recommendations[0]['crop'],
        "confidence": top_recommendations[0]['confidence'],
        "top_recommendations": top_recommendations
    }

