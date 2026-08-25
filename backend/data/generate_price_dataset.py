import pandas as pd
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
