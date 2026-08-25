import pandas as pd
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
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    os.makedirs('backend/model', exist_ok=True)
    joblib.dump(pipeline, 'backend/model/crop_recommendation.pkl')
    print("Saved model to backend/model/crop_recommendation.pkl")

if __name__ == '__main__':
    train_crop_model()
