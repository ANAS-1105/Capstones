import os
import pickle

def predict_emotion(text):
    base_dir = "d:\\PROJECT capstone\\MindMentor-AI"
    model_path = os.path.join(base_dir, "ml", "model.pkl")
    vectorizer_path = os.path.join(base_dir, "ml", "vectorizer.pkl")
    
    if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
        return "Model files not found. Please train the model first."
        
    with open(model_path, "rb") as f:
        model = pickle.load(f)
        
    with open(vectorizer_path, "rb") as f:
        vectorizer = pickle.load(f)
        
    # Transform and predict
    vec = vectorizer.transform([text])
    prediction = model.predict(vec)[0]
    probs = model.predict_proba(vec)[0]
    classes = model.classes_
    
    prob_dict = {cls: float(p) for cls, p in zip(classes, probs)}
    return prediction, prob_dict

if __name__ == "__main__":
    test_phrases = [
        "I have three assignments due this week. I keep trying to study, but I can't focus and I feel overwhelmed.",
        "I am so tired. I have no energy to study and I just want to sleep for days.",
        "I don't understand this physics chapter at all. The formulas make no sense.",
        "I feel peaceful and relaxed today. I'm ready to study at a steady pace.",
        "I am feeling really excited to study today. I'm ready to crush my goals!",
        "I am so worried about my final grades. I can't stop thinking about failing."
    ]
    
    print("Testing ML Model Predictions:\n" + "="*40)
    for phrase in test_phrases:
        result = predict_emotion(phrase)
        if isinstance(result, str):
            print(result)
            break
        pred, probs = result
        print(f"Text: '{phrase}'")
        print(f"Predicted Emotion: {pred}")
        print(f"Confidence: {probs[pred]:.4f}")
        print("-"*40)
