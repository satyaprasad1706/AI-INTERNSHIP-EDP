# Week 3: SMS Spam Classifier (Naive Bayes & TF-IDF)

Hey! Here are my personal notes & takeaways from Week 3 of the EDP Internship, where I built an SMS Spam Classification model using Natural Language Processing (NLP) techniques and Naive Bayes in Scikit-Learn.

### Things I Learned

1. **Loading Tab-Separated Data (`pd.read_csv`)** - Importing text datasets with custom separators (`sep='\t'`) and assigning column headers (`label` and `message`).
2. **Data Cleaning & Deduplication** - Checking missing values and dropping `403` duplicate rows to prevent data leakage and ensure balanced evaluation.
3. **Text Preprocessing with Regex (`re`)** - Creating a custom text-cleaning pipeline to convert text to lowercase, strip punctuation (`re.sub(r"[^a-zA-Z\s]", "", text)`), and normalize extra spaces.
4. **Target & Feature Separation** - Defining clean text messages as features ($X$) and target labels ($y$) containing `ham` (legitimate) and `spam`.
5. **Train-Test Splitting (`train_test_split`)** - Splitting data into 80% training (`4,135` rows) and 20% testing (`1,034` rows) with a fixed `random_state`.
6. **Text Vectorization (`TfidfVectorizer`)** - Converting raw text into numerical feature matrices using Term Frequency-Inverse Document Frequency (TF-IDF), generating `7,477` vocabulary features.
7. **Building Naive Bayes Classifier (`MultinomialNB`)** - Training a Multinomial Naive Bayes model suitable for word-count and TF-IDF text classification tasks.
8. **Evaluating Accuracy (`accuracy_score`)** - Achieving an overall classification accuracy of **95.55%** on unseen test messages.
9. **Analyzing Performance Metrics (`classification_report` & `confusion_matrix`)** - Reviewing precision, recall, F1-score, and confusion matrix (`894` True Negatives, `94` True Positives).
10. **Real-Time Text Prediction (`predict_message`)** - Writing an end-to-end prediction pipeline to classify custom user-entered SMS messages into `ham` or `spam`.
