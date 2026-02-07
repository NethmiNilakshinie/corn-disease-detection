# corn-disease-detection

# AI CornCare 🌽
An AI-powered Mobile Application for Corn Leaf Disease Detection.

AI CornCare is a specialized mobile solution designed to help farmers identify corn leaf diseases instantly using Artificial Intelligence. By simply taking a photo, the app analyzes the leaf, identifies the disease, provides management advice, and shows the nearest agricultural service centers.

## Key Features
* AI-Powered Analysis: Instantly detects diseases like Blight, Common Rust, and Gray Leaf Spot.
* Confidence Scoring: Provides an accuracy percentage (e.g., Reliable - 90%) for every prediction.
* Multilingual Support: Fully accessible in **English, Sinhala (සිංහල), and Tamil (தமிழ்)**.
* Treatment Advice: Offers detailed information on symptoms, conditions, and management for each disease.
* Scan History: Automatically saves previous scans locally for future reference.
* Location Services: Integrated with Google Maps to find the nearest Agriculture Service Centers.

## Tech Stack
* Frontend: React Native (Expo)
* Backend: Python (FastAPI) 
* AI Model: Convolutional Neural Network (CNN)
* Data Handling: Axios for API requests, AsyncStorage for local history.
* UI/UX: React Native Paper, Lucide/Ionicons, Linear Gradient.

## How It Works
* Capture: Take a photo of a corn leaf using the in-app camera or select one from the gallery.
* Analyze: The image is sent to the AI backend via an API.
* Result: The app displays the disease name, confidence level, and detailed management tips.
* Support: Farmers can locate nearby experts via the integrated map feature.

## 📂 Project Structure
```text
├── assets/             # Icons, Splash screens and Images
├── components/         # Reusable UI components
├── screens/            # Main screen logic (Home, History, etc.)
├── app.json            # Expo configuration (Icons, Package name)
└── README.md           # Project documentation
