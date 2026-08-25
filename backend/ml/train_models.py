from .train_crop_model import train_crop_model
from .train_price_model import train_price_model
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data.generate_crop_dataset import generate_crop_dataset
from data.generate_price_dataset import generate_price_dataset

def main():
    print("Step 1: Generating crop dataset...")
    generate_crop_dataset()
    
    print("\nStep 2: Training crop model...")
    train_crop_model()
    
    print("\nStep 3: Generating price dataset...")
    generate_price_dataset()
    
    print("\nStep 4: Training price model...")
    train_price_model()
    
    print("\nAll models trained and saved successfully.")

if __name__ == '__main__':
    main()
