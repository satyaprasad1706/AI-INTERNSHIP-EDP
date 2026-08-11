# Week 2: Linear Regression Model - Student Performance Dataset

Hey! Here are my personal notes & takeaways from Week 2 of the EDP Internship working with Scikit-Learn to build a Linear Regression model for predicting Student Performance.

### Things I Learned

1. **Loading Data (`pd.read_csv`)** - Importing our student performance dataset into a Pandas DataFrame to train a machine learning model.
2. **Encoding Categorical Features (`LabelEncoder`)** - Converting text/categorical columns like `Parental_Involvement`, `Access_to_Resources`, `Extracurricular_Activities`, `Motivation_Level`, and `Internet_Access` into numbers so regression algorithms can process them.
3. **Setting Up Features & Target ($X$ and $y$)** - Isolating the target column (`Performance_Index` as $y$) from our input predictors (`Hours_Studied`, `Attendance`, `Sleep_Hours`, `Previous_Scores`, etc. as $X$).
4. **Train-Test Splitting (`train_test_split`)** - Splitting data into 80% training set and 20% testing set to evaluate model performance properly on unseen student records.
5. **Building the Model (`LinearRegression`)** - Initializing and fitting a Multiple Linear Regression model using Scikit-Learn.
6. **Making Predictions (`model.predict`)** - Generating predicted performance scores for unseen test data.
7. **Comparing Actual vs Predicted** - Structuring test outputs into a side-by-side comparison table (`Actual Score` vs `Predicted Score`) to visually check model accuracy.
8. **Evaluating Mean Absolute Error (`MAE`)** - Calculating the average point difference between actual and predicted student scores.
9. **Calculating R-Squared Score (`R2 Score`)** - Evaluating overall model fit to determine how much variance in student grades is explained by study hours, attendance, and background factors.
10. **Predicting New Custom Samples** - Passing custom student specs (e.g., study hours, attendance rate, previous scores) into the trained model to estimate academic performance in real-time.
