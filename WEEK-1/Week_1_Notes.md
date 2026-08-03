# Week 1 Study Notes: Data Cleaning and Exploration with Pandas

## 1. Introduction

Data cleaning and exploratory data analysis (EDA) form the foundation of any data science project. Raw real-world data is almost always messy, containing missing values, inconsistent column names, duplicate rows, and invalid data types. 

Pandas is the primary Python library used to clean, inspect, and transform tabular data into a structured format (DataFrames) suitable for statistical analysis and machine learning models.

---

## 2. Key Concepts & Step-by-Step Commands

### Step 1: Importing Pandas
Import Pandas using the standard alias `pd`.
```python
import pandas as pd
```

### Step 2: Loading Data (`read_csv`)
Load a CSV file from disk into a Pandas DataFrame.
```python
df = pd.read_csv("Mall_Customers.csv")
```

### Step 3: Inspecting Samples (`head` and `tail`)
Peeking at the top and bottom rows helps verify that data headers and values loaded correctly.
- `df.head(n)`: Returns the first `n` rows (default is 5).
- `df.tail(n)`: Returns the last `n` rows (default is 5).
```python
print(df.head())
print(df.tail())
```

### Step 4: Dimensions and Schema (`shape`, `dtypes`, `info`)
- `df.shape`: Returns a tuple `(rows, columns)`.
- `df.columns`: Lists all column header names.
- `df.dtypes`: Shows the data type of each column (`int64`, `float64`, `object`/string).
- `df.info()`: Summarizes total rows, non-null counts per column, data types, and memory consumption.
```python
print("Shape:", df.shape)
print("Columns:", df.columns)
df.info()
```

### Step 5: Statistical Summary (`describe`)
`df.describe()` calculates key descriptive statistics for numerical columns: count, mean, standard deviation, min, 25th percentile, median (50th percentile), 75th percentile, and max.
```python
print(df.describe())
```

### Step 6: Auditing and Handling Missing Data (`isnull`, `fillna`)
- `df.isnull().sum()`: Counts the number of missing (`NaN`) values in each column.
- `df.fillna(value)`: Replaces missing values with a specified default (e.g., `0` or column mean).
```python
# Check missing values
print(df.isnull().sum())

# Fill missing values with 0
df = df.fillna(0)
```

### Step 7: Managing Duplicates (`duplicated`, `drop_duplicates`)
- `df.duplicated().sum()`: Counts identical rows in the dataset.
- `df.drop_duplicates()`: Removes duplicate rows to prevent biased model training.
```python
print("Duplicates:", df.duplicated().sum())
df = df.drop_duplicates()
```

### Step 8: Renaming Columns (`rename`)
Column headers with spaces or special characters (like `Annual Income (k$)`) should be renamed to clean identifiers without spaces for easier access.
```python
df = df.rename(columns={
    "Annual Income (k$)": "Annual_Income",
    "Spending Score (1-100)": "Spending_Score"
})
```

### Step 9: Feature and Target Separation
In machine learning, input attributes ($X$) must be separated from the target label ($Y$).
```python
# Assuming 'Spending_Score' is our target label Y
X = df.drop(columns=["Spending_Score"])
Y = df["Spending_Score"]
```

### Step 10: Exporting Clean Data (`to_csv`)
Save the cleaned DataFrame to a new CSV file. Setting `index=False` prevents Pandas from writing an extra un-named index column.
```python
df.to_csv("clean_mall_customers.csv", index=False)
```

---

## 3. Best Practices Summary

1. Always run `df.info()` first to check column data types and null counts.
2. Use `index=False` when running `to_csv()` to prevent duplicate index columns.
3. Rename messy column names early in your workflow to avoid syntax errors.
4. Always re-load exported CSV files to verify that saving succeeded without issues.
