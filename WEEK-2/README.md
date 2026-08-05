# Week 2: Linear Regression Model

Hey! Here are my personal notes & takeaways from Week 2 of the EDP Internship working with Scikit-Learn to build a Linear Regression model.

### Things I Learned

1. **Loading Data (`pd.read_csv`)** - Importing our cleaned diamonds dataset to train a machine learning model.
2. **Encoding Categorical Features (`LabelEncoder`)** - Converting text columns like `cut`, `color`, and `clarity` into numbers so regression algorithms can process them.
3. **Setting Up Features & Target ($X$ and $y$)** - Isolating the target column (`price` as $y$) from our input predictors ($X$).
4. **Train-Test Splitting (`train_test_split`)** - Splitting data into 80% training (`43,152` rows) and 20% testing (`10,788` rows) to evaluate model performance properly.
5. **Building the Model (`LinearRegression`)** - Initializing and fitting a Multiple Linear Regression model using Scikit-Learn.
6. **Making Predictions (`model.predict`)** - Generating predicted diamond prices for unseen test data.
7. **Comparing Actual vs Predicted** - Structuring test outputs into a side-by-side comparison table to visually check model accuracy.
8. **Evaluating Mean Absolute Error (`MAE`)** - Calculating the average dollar difference between actual and predicted prices (~$858).
9. **Calculating R-Squared Score (`R2 Score`)** - Evaluating overall model fit—our model achieved an R² score of 0.885 (explaining ~88.5% of price variance).
10. **Predicting New Custom Samples** - Passing custom diamond specs into the trained model to estimate market prices in real-time.
