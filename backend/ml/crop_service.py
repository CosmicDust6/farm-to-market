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
