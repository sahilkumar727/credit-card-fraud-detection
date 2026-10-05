from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Fraud Detection ML Service")

# Load saved model and scaler
model = joblib.load("fraud_model.pkl")
scaler_amount = joblib.load("scaler_amount.pkl")
scaler_time = joblib.load("scaler_time.pkl")


# Define input schema (same columns as your training data, minus 'Class')
class Transaction(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float

@app.get("/")
def home():
    return {"message": "Fraud Detection ML Service is running"}

@app.post("/predict")
def predict(transaction: Transaction):
    data = pd.DataFrame([transaction.dict()])

    # Scale Amount and Time same way as training
    data["Amount"] = scaler_amount.transform(data[["Amount"]])
    data["Time"] = scaler_time.transform(data[["Time"]])

    fraud_prob = model.predict_proba(data)[0][1]
    is_fraud = fraud_prob > 0.5

    return {
        "fraud_probability": round(float(fraud_prob), 4),
        "is_fraud": bool(is_fraud),
        "risk_label": "High Risk" if fraud_prob > 0.7 else ("Medium Risk" if fraud_prob > 0.3 else "Low Risk")
    }