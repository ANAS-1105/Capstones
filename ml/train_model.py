import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, "dataset", "emotion_data.csv")
    
    if not os.path.exists(csv_path):
        print(f"Error: Dataset not found at {csv_path}. Please run dataset_generator.py first.")
        return

    print("Loading dataset...")
    df = pd.read_csv(csv_path)
    
    X = df["text"]
    y = df["label"]
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Vectorizing text using TF-IDF...")
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english", min_df=1)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    print("Training Logistic Regression model...")
    model = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
    model.fit(X_train_vec, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model and vectorizer
    ml_dir = os.path.join(base_dir, "ml")
    model_path = os.path.join(ml_dir, "model.pkl")
    vectorizer_path = os.path.join(ml_dir, "vectorizer.pkl")
    
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
        
    with open(vectorizer_path, "wb") as f:
        pickle.dump(vectorizer, f)
        
    print(f"Model saved to: {model_path}")
    print(f"Vectorizer saved to: {vectorizer_path}")

if __name__ == "__main__":
    main()
