# EDP Internship Journal

My weekly learning log for the EDP Internship.

---

## Week 1: Data Cleaning with Pandas

Check out the full notes: [WEEK-1/README.md](file:///j:/EDP%20INTERNSHIP/WEEK-1/README.md)

### Quick Summary
- Loaded `diamonds.csv` and `Mall_Customers.csv`.
- Checked data shapes, data types, missing values, and summary stats.
- Renamed messy column names to clean formats (`Annual_Income`, `Spending_Score`).
- Saved clean output to `clean_mall_customers.csv`.

---

## Week 2: Linear Regression Model

Check out the full notes: [WEEK-2/README.md](file:///j:/EDP%20INTERNSHIP/WEEK-2/README.md)

### Quick Summary
- Encoded categorical variables (`cut`, `color`, `clarity`) using `LabelEncoder`.
- Split dataset into 80% training and 20% testing sets using `train_test_split`.
- Trained a Multiple Linear Regression model to predict diamond prices.
- Evaluated performance achieving an R² score of 0.885 (~88.5% accuracy).
- Tested predictions on new custom diamond data points.

---

## Week 3: SMS Spam Classification Model

Check out the full notes: [WEEK-3/README.md](file:///j:/EDP%20INTERNSHIP/WEEK%20-3/README.md)

### Quick Summary
- Loaded `SMSSpamCollection` dataset, cleaned text, and dropped duplicate entries.
- Applied regex text cleaning (lowercasing, punctuation removal, whitespace trimming).
- Converted text into numerical features using `TfidfVectorizer`.
- Trained a `MultinomialNB` (Multinomial Naive Bayes) classification model.
- Evaluated model achieving an accuracy of **95.55%** on test messages.
- Created a custom inference function `predict_message()` for real-time spam detection.

