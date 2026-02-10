from fastapi import FastAPI, UploadFile, File
import numpy as np
from PIL import Image
import tensorflow as tf
import io

app = FastAPI()

# Load model 
MODEL = tf.keras.layers.TFSMLayer("../models/1", call_endpoint='serving_default')

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
    
    # 1. Resizing
    image = image.resize((256, 256))
    
    # 2. convert to Array
    img_array = np.array(image).astype(np.float32)

    #img_array = img_array / 255.0 
    img_array = img_array

    # img_array = img_array 

    img_array = np.expand_dims(img_array, 0)

    # get Prediction 
    predictions_dict = MODEL(img_array, training=False)
    predictions = list(predictions_dict.values())[0]
    
    raw_results = predictions.numpy()[0]
    print(f"Raw Prediction Values: {raw_results}")
    
    #  np.argmax() use to find the class with the highest probability.
    predicted_class = CLASS_NAMES[np.argmax(raw_results)]

    # calculate confidence level
    confidence = float(np.max(raw_results))

    return {
        'class': predicted_class,
        'confidence': confidence
    }