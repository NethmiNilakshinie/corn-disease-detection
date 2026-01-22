from fastapi import FastAPI, UploadFile, File
import numpy as np
from PIL import Image
import tensorflow as tf
import io

app = FastAPI()

# 1. Load the model you saved
MODEL = tf.keras.layers.TFSMLayer("../models/1", call_endpoint='serving_default')

# 2. Your Class Names (Update these to match your dataset)
CLASS_NAMES = ["Blight", "Common Rust", "Gray Leaf Spot", "Healthy"]

# 3. Farming Solutions
SOLUTIONS = {
    "Common Rust": "Apply fungicide containing strobilurins. Rotate crops next season.",
    "Gray Leaf Spot": "Improve air circulation. Use tillage to bury infected residue.",
    "Blight": "Apply fungicide early. Use resistant hybrids.",
    "Healthy": "Your corn is looking great! Continue regular watering."
}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    data = await file.read()
    image = Image.open(io.BytesIO(data)).convert('RGB')
    
    # 1. Resize කිරීම (ඔයාගේ model එක train කරපු size එකම දෙන්න - උදා: 256)
    image = image.resize((256, 256))
    
    # 2. Array එකක් බවට පත් කිරීම
    img_array = np.array(image).astype(np.float32)

    # --- උත්සාහය A: 255න් බෙදා පරීක්ෂා කිරීම ---
    #img_array = img_array / 255.0 
    img_array = img_array

    # --- උත්සාහය B: (A වැඩ නොකරයි නම් ඉහත පේළිය මකා මෙය පාවිච්චි කරන්න) ---
    # img_array = img_array 

    img_array = np.expand_dims(img_array, 0)

    # 3. Prediction ලබාගැනීම
    predictions_dict = MODEL(img_array, training=False)
    predictions = list(predictions_dict.values())[0]
    
    # Terminal එකේ බලන්න values මාරු වෙනවාද කියලා
    raw_results = predictions.numpy()[0]
    print(f"Raw Prediction Values: {raw_results}")

    predicted_class = CLASS_NAMES[np.argmax(raw_results)]
    confidence = float(np.max(raw_results))

    return {
        'class': predicted_class,
        'confidence': confidence
    }