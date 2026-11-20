import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Fraud Detection ML Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load saved model and scalers with reliable path resolution
model = joblib.load(os.path.join(BASE_DIR, "fraud_model.pkl"))
scaler_amount = joblib.load(os.path.join(BASE_DIR, "scaler_amount.pkl"))
scaler_time = joblib.load(os.path.join(BASE_DIR, "scaler_time.pkl"))

# Define input schema
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
    return {"status": "ok", "message": "Fraud Detection ML Service is running"}

@app.post("/predict")
def predict(transaction: Transaction):
    data_dict = transaction.model_dump() if hasattr(transaction, "model_dump") else transaction.dict()
    data = pd.DataFrame([data_dict])

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
