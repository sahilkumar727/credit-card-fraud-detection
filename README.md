# credit-card-fraud-detection
A full-stack-Fraud Detection System built with Java, Machine Learning models, and  web dashboard identify and analyze  fraudulent transections in real-time.


Dataset link:- https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud/data?select=creditcard.csv

# 🛡️️ Credit Card Fraud Detection System

An end-to-end Machine Learning project designed to detect fraudulent credit card transactions in real-time.  

---

## 📁 Repository Structure

```text
credit-card-fraud-detection/
├── frontend/          # Web application UI
├── ml-service/        # Machine Learning model scripts & API
└── README.md          # Project documentation

📊 Dataset Information
​Due to file size limits on GitHub (>25MB), the dataset is not included in this repository.
​Dataset Name: Credit Card Fraud Detection Dataset
​Source: Kaggle
​Download Link: Download Dataset from Kaggle
​🚀 How to Run the Project Locally
​1. Prerequisites
​Make sure you have installed:
​Python (v3.8 or higher)
​Node.js & npm (v16 or higher)
​2. Dataset Setup
​Download creditcard.csv from the Kaggle link provided above.
​Move the downloaded creditcard.csv file into the ml-service/ folder.
​3. Setup & Run ML Service (Backend)
​Open your terminal and execute:

# Navigate to ml-service folder
cd ml-service

# Install required Python dependencies
pip install -r requirements.txt

# Run the ML App
python app.py

4. Setup & Run Frontend
​Open a new terminal window and execute:
Frontend folder open in IntelliJ IDEA.

# Navigate to frontend folder
cd frontend

# Install dependencies (restores node_modules)
npm install

# Start the frontend application
npm start

​🔹5. Start Backend Service (Java / Spring Boot)
​Open IntelliJ IDEA.
​Click Open and select the backend/ folder.
​Wait for Maven/Gradle dependencies to build.
​Click the Run ▶ button on the main Application file (BackendApplication.java).

🌐 Application URL
​Frontend UI: Open http://localhost:3000
​ML API: Running at http://localhost:5000
