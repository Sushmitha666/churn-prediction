"""Churn model: clean -> split -> baseline -> XGBoost -> evaluate -> SHAP -> export results.json
Run from the churn-project folder:  python src/train.py
"""
import glob, json, os, re
import numpy as np, pandas as pd, shap
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (precision_score, recall_score, f1_score,
                             roc_auc_score, average_precision_score, roc_curve)
from xgboost import XGBClassifier

SEED, THRESH = 42, 0.5
OUT = os.path.join("frontend", "public", "data", "results.json")

# ---------- load + clean ----------
csv = sorted(glob.glob("data/*.csv"))[0]
print("Using", csv)
df = pd.read_csv(csv)
df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce").fillna(0)
raw = df.copy()                       # untouched copy for segments + customer table
y = (df.pop("Churn") == "Yes").astype(int)
ids = df.pop("customerID")
X = pd.get_dummies(df, drop_first=True, dtype=int)

# ---------- split first ----------
X_tr, X_te, y_tr, y_te, _, id_te = train_test_split(
    X, y, ids, test_size=0.2, stratify=y, random_state=SEED)


def score(name, p, thr=THRESH):
    pred = (p >= thr).astype(int)
    return {"model": name,
            "precision": round(precision_score(y_te, pred), 3),
            "recall": round(recall_score(y_te, pred), 3),
            "f1": round(f1_score(y_te, pred), 3),
            "roc_auc": round(roc_auc_score(y_te, p), 3),
            "pr_auc": round(average_precision_score(y_te, p), 3)}


# ---------- baseline ----------
lr = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000, class_weight="balanced"))
lr.fit(X_tr, y_tr)
p_lr = lr.predict_proba(X_te)[:, 1]

# ---------- XGBoost ----------
xgb = XGBClassifier(n_estimators=300, max_depth=4, learning_rate=0.05,
                    scale_pos_weight=(y_tr == 0).sum() / (y_tr == 1).sum(),
                    random_state=SEED)
xgb.fit(X_tr, y_tr)
proba = xgb.predict_proba(X_te)[:, 1]

results = [score("Logistic Regression", p_lr), score("XGBoost", proba)]
print(pd.DataFrame(results))

# ---------- lift curve + deciles ----------
order = np.argsort(-proba)
yt = y_te.values
n, pos = len(order), int(yt.sum())
captured = np.cumsum(yt[order]) / pos
lift = [{"contacted": round(i / 100, 2),
         "captured": round(float(captured[max(int(n * i / 100) - 1, 0)]), 3)} for i in range(101)]

deciles = []
for d in range(10):
    chunk = yt[order][int(n * d / 10): int(n * (d + 1) / 10)]
    deciles.append({"decile": d + 1, "churn_rate": round(float(chunk.mean()), 3), "customers": int(len(chunk))})

# ---------- ROC curves (shared grid so the UI can draw both) ----------
grid = np.linspace(0, 1, 51)
def roc_on_grid(p):
    fpr, tpr, _ = roc_curve(y_te, p)
    return [round(float(v), 3) for v in np.interp(grid, fpr, tpr)]
roc = {"grid": [round(float(g), 2) for g in grid], "xgb": roc_on_grid(proba), "lr": roc_on_grid(p_lr)}

# ---------- threshold table for the ROI simulator ----------
thresholds = []
for t in np.round(np.arange(0.05, 0.951, 0.01), 2):
    pred = proba >= t
    tp = int((pred & (yt == 1)).sum()); fp = int((pred & (yt == 0)).sum()); fn = pos - tp
    thresholds.append({"t": float(t), "tp": tp, "fp": fp, "fn": fn,
                       "precision": round(tp / (tp + fp), 3) if tp + fp else 0.0,
                       "recall": round(tp / pos, 3)})

# ---------- segments (whole dataset) ----------
raw["is_churn"] = (raw["Churn"] == "Yes").astype(int)
raw["TenureBand"] = pd.cut(raw["tenure"], [-1, 12, 24, 48, 100],
                           labels=["0-12 months", "13-24 months", "25-48 months", "49+ months"]).astype(str)
def seg(col):
    g = raw.groupby(col)["is_churn"].agg(["mean", "count"]).reset_index()
    return [{"label": str(r[col]), "churn_rate": round(float(r["mean"]), 3), "count": int(r["count"])}
            for _, r in g.iterrows()]
segments = {"Contract": seg("Contract"), "Tenure": seg("TenureBand"),
            "Internet": seg("InternetService"), "Payment": seg("PaymentMethod")}

# ---------- SHAP ----------
def pretty(f):
    if "_" in f:
        a, b = f.split("_", 1)
        return re.sub(r"(?<=[a-z])(?=[A-Z])", " ", a) + ": " + b
    return re.sub(r"(?<=[a-z])(?=[A-Z])", " ", f)

sv = shap.TreeExplainer(xgb).shap_values(X_te)
cols = list(X.columns)
imp = np.abs(sv).mean(0)
drivers = []
for j in np.argsort(-imp)[:10]:
    x = X_te.iloc[:, j].values.astype(float)
    c = np.corrcoef(x, sv[:, j])[0, 1] if x.std() > 0 else 0.0
    drivers.append({"feature": pretty(cols[j]), "value": round(float(imp[j]), 3),
                    "direction": "up" if (np.nan_to_num(c) >= 0) else "down"})

te_raw = raw.loc[X_te.index]
customers = []
for idx in order[:100]:
    row = te_raw.iloc[idx]
    top3 = np.argsort(-np.abs(sv[idx]))[:3]
    customers.append({
        "id": str(id_te.iloc[idx]), "risk": round(float(proba[idx]), 3),
        "contract": str(row["Contract"]), "tenure": int(row["tenure"]),
        "monthly": round(float(row["MonthlyCharges"]), 2),
        "reasons": [{"feature": pretty(cols[j]), "impact": round(float(sv[idx][j]), 2)} for j in top3]})

out = {
    "meta": {"n_customers": int(len(df)), "n_test": int(n), "n_churners_test": pos, "threshold": THRESH},
    "models": results, "churn_rate": round(float(y.mean()), 3),
    "top10_capture": lift[10]["captured"], "lift": lift, "deciles": deciles, "roc": roc,
    "thresholds": thresholds, "segments": segments, "drivers": drivers, "customers": customers,
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w") as f:
    json.dump(out, f)
print(f"Saved {OUT}  |  top-10% capture = {out['top10_capture']:.1%}")
