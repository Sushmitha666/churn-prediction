# Customer Churn Prediction & Retention Dashboard

Predict which telecom customers are about to cancel, explain why with SHAP, and turn the model into a ranked contact list a retention team can act on.

**Live demo:** TODO-your-vercel-link

![Dashboard overview](TODO-screenshot.png)

## Results (held-out test set, 1,409 customers)

| Model | Precision | Recall | F1 | ROC-AUC | PR-AUC |
|---|---|---|---|---|---|
| Logistic Regression (baseline) | 0.507 | 0.786 | 0.616 | 0.841 | 0.631 |
| XGBoost (class-weighted) | 0.521 | 0.786 | 0.627 | 0.839 | 0.653 |

- **Contacting the riskiest 10% of customers reaches 29% of all churners**, about 2.9x better than random targeting.
- ROC-AUC is effectively tied between the two models, so the simple baseline is competitive on this dataset. XGBoost leads slightly on PR-AUC.
- Accuracy is not reported because the classes are imbalanced (about 27% churn). Predicting "no churn" for everyone already scores about 73%.

## What the dashboard shows

- **Overview:** headline lift number, KPIs, interactive lift curve, churn by risk decile, ROC curves, model comparison.
- **Drivers:** top SHAP features (coloured by direction) and a segment explorer by contract, tenure, internet service and payment method.
- **Customers:** top 100 at-risk customers with per-customer SHAP reasons, plus a simulator that finds the best risk threshold for a given offer cost, customer value and success rate.

## How it works

1. Clean the data (`TotalCharges` is text, with blanks for new customers).
2. Stratified 80/20 train/test split **before** any modeling.
3. Logistic regression baseline.
4. XGBoost with `scale_pos_weight` for class imbalance.
5. Evaluate with precision, recall, ROC-AUC and PR-AUC.
6. Explain with SHAP (`TreeExplainer`).
7. Rank test customers by risk and export everything to `results.json`, which the React app reads.

## Tech stack

Python, pandas, scikit-learn, XGBoost, SHAP | React, Vite, Tailwind CSS, Framer Motion

## Run it locally

Dataset: [Telco Customer Churn on Kaggle](https://www.kaggle.com/datasets/blastchar/telco-customer-churn). Put the CSV in `data/` (it is git-ignored).

```bash
python -m venv venv
venv\Scripts\activate
pip install pandas scikit-learn xgboost shap
python src/train.py

cd frontend
npm install
npm run dev
```

## Limitations

- SHAP shows what the model relies on, not what causes churn.
- The simulator's costs and success rate are illustrative assumptions, not measured values.
- One public dataset and a single train/test split. A production version would need validation on fresh data.

## Author

TODO-your-name · TODO-linkedin-or-email