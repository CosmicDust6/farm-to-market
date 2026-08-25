import pandas as pd
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
