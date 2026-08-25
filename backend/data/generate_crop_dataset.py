import pandas as pd
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
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(BASE_DIR, 'data', 'crop_recommendation.csv')
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    df.to_csv(target_path, index=False)
    print(f"Generated {num_records} records for crop recommendation at {target_path}")

if __name__ == '__main__':
    generate_crop_dataset()

