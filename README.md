# Customer Churn Prediction & Retention Dashboard

An end-to-end Machine Learning project that predicts telecom customer churn, explains the factors influencing predictions using SHAP, and helps retention teams identify high-risk customers through an interactive dashboard.

<p align="center">
  <a href="https://churn-prediction-nine-psi.vercel.app">
    <strong>🌐 View Live Dashboard</strong>
  </a>
</p>
---

## 📌 Project Overview

Customer churn is a major challenge for subscription-based businesses. Identifying customers who are likely to leave allows businesses to prioritize retention efforts.

This project builds a complete churn prediction pipeline using Logistic Regression and XGBoost, applies SHAP for model explainability, and presents actionable insights through a React-based dashboard.

**Key highlights:**
- Predicts customer churn using Machine Learning.
- Explains individual predictions using SHAP.
- Ranks customers according to their predicted churn risk.
- Identifies important churn patterns and customer segments.
- Provides an interactive retention ROI and risk-threshold simulator.
- Deploys the dashboard online using Vercel.

## 📊 Model Performance

Evaluated on a held-out test set of 1,409 customers.

| Model | Precision | Recall | F1-Score | ROC-AUC | PR-AUC |
|---|---:|---:|---:|---:|---:|
| Logistic Regression | 0.507 | 0.786 | 0.616 | 0.841 | 0.631 |
| XGBoost | 0.521 | 0.786 | 0.627 | 0.839 | 0.653 |

### Key Findings

- **29% churner capture:** Contacting the riskiest 10% of customers reaches approximately 29% of all churners.
- **2.9× better targeting:** This is approximately 2.9 times the capture expected from random targeting.
- **Competitive baseline:** Logistic Regression achieves nearly the same ROC-AUC as XGBoost.
- **XGBoost advantage:** XGBoost achieves slightly better F1-score and PR-AUC.

Accuracy is not emphasized because the dataset has an imbalanced churn distribution.

## 🖥️ Dashboard Features

### 1. Overview Dashboard

- Overall churn prediction KPIs.
- Customer risk distribution.
- Interactive lift curve.
- ROC curves and model comparison.
- Churn distribution by risk decile.
- Top 10% customer targeting insights.

### 2. Customer Drivers

- Global feature importance using SHAP.
- Positive and negative feature contributions.
- Customer segmentation by:
  - Contract type
  - Tenure
  - Internet service
  - Payment method
- Interactive exploration of churn patterns.

### 3. Customer Analysis

- Ranked list of the top 100 high-risk customers.
- Individual customer churn-risk explanations.
- SHAP-based prediction insights.
- Retention threshold simulator.
- Interactive offer-cost, customer-value and success-rate assumptions to explore potential retention ROI.

## ⚙️ Machine Learning Workflow

1. **Data Collection:** Used the Telco Customer Churn dataset.
2. **Data Preprocessing:** Cleaned missing values and converted `TotalCharges` from text to numeric.
3. **Data Splitting:** Applied a stratified 80/20 train-test split before model training.
4. **Baseline Model:** Trained Logistic Regression.
5. **Advanced Model:** Trained class-weighted XGBoost using `scale_pos_weight`.
6. **Model Evaluation:** Compared Precision, Recall, F1-score, ROC-AUC and PR-AUC.
7. **Explainability:** Used SHAP TreeExplainer to interpret model predictions.
8. **Customer Ranking:** Ranked customers based on predicted churn risk.
9. **Results Export:** Exported model metrics, customer rankings and explanations into `results.json`.
10. **Dashboard Deployment:** Integrated the generated results into a React frontend and deployed it using Vercel.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Programming | Python |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn, XGBoost |
| Explainable AI | SHAP |
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Deployment | Vercel |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
churn-project/
│
├── data/
│   └── Telco.csv
│
├── src/
│   └── train.py
│
├── frontend/
│   ├── public/
│   │   └── data/
│   │       └── results.json
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🚀 Run Locally

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Sushmitha666/churn-prediction.git
cd churn-prediction
```

### 2. Create and activate a virtual environment

**Windows PowerShell:**

```powershell
python -m venv venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

### 3. Install Python dependencies

```powershell
pip install pandas scikit-learn xgboost shap
```

### 4. Add the dataset

Download the Telco Customer Churn dataset from Kaggle:

[Telco Customer Churn Dataset](https://www.kaggle.com/datasets/blastchar/telco-customer-churn)

Place the CSV file inside the `data/` directory as `Telco.csv`.

### 5. Train the models and generate results

Run from the project root:

```powershell
python src/train.py
```

This generates:

```text
frontend/public/data/results.json
```

### 6. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

## ⚠️ Limitations

- SHAP explains the features used by the model; it does not establish causal relationships.
- The retention simulator uses illustrative assumptions for offer costs, customer value and success rates.
- The project uses one public telecom churn dataset.
- Evaluation uses a single stratified train-test split; performance may vary across different datasets and splits.
- Model predictions should support, not replace, business decisions.

## 🔗 Project Links

- **Live Dashboard:** https://churn-prediction-nine-psi.vercel.app
- **GitHub Repository:** https://github.com/Sushmitha666/churn-prediction

---

<p align="center">
  <strong>Built with Python, Machine Learning, Explainable AI and React.</strong>
</p>
