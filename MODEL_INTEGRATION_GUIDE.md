# Medical Report Analysis - Model Integration Guide

This guide explains how to integrate your 5 ML models and CSV files with the updated upload system.

## Overview

The system has been updated to:
- ✅ Remove X-ray reports and replace with Thyroid reports
- ✅ Convert from file uploads to form-based data entry
- ✅ Support 5 report types: Blood, Kidney, Liver, Diabetes, Thyroid
- ✅ Prepare structure for ML model integration

## File Structure

```
SIH_frontend/
├── models/                    # Your ML models go here
│   ├── blood_model.pkl
│   ├── kidney_model.pkl
│   ├── liver_model.pkl
│   ├── diabetes_model.pkl
│   └── thyroid_model.pkl
├── data/                      # Your CSV training data
│   ├── blood_data.csv
│   ├── kidney_data.csv
│   ├── liver_data.csv
│   ├── diabetes_data.csv
│   └── thyroid_data.csv
├── model-integration.js       # Integration logic
├── src/components/Upload.js   # Updated React component
├── upload.html               # Updated HTML page
├── js/upload.js             # Updated JavaScript
└── css/upload.css           # Updated styles
```

## Model Integration Options

### Option 1: Python Backend (Recommended)
Create a Python Flask/FastAPI backend to serve your models:

```python
# backend/app.py
from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load your models
models = {
    'blood': pickle.load(open('models/blood_model.pkl', 'rb')),
    'kidney': pickle.load(open('models/kidney_model.pkl', 'rb')),
    'liver': pickle.load(open('models/liver_model.pkl', 'rb')),
    'diabetes': pickle.load(open('models/diabetes_model.pkl', 'rb')),
    'thyroid': pickle.load(open('models/thyroid_model.pkl', 'rb'))
}

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    report_type = data['reportType']
    input_data = np.array([data['data']])
    
    model = models[report_type]
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0]
    
    return jsonify({
        'class': int(prediction),
        'confidence': float(max(probability)),
        'probabilities': probability.tolist()
    })

if __name__ == '__main__':
    app.run(debug=True)
```

### Option 2: TensorFlow.js (For JavaScript Models)
If your models are in TensorFlow.js format:

```javascript
// Load and use TensorFlow.js models
async function loadTensorFlowModel(reportType) {
    const model = await tf.loadLayersModel(`./models/${reportType}_model.json`);
    return model;
}

async function predictWithTensorFlow(model, data) {
    const prediction = model.predict(tf.tensor2d([data]));
    return prediction.dataSync();
}
```

### Option 3: ONNX Runtime (For ONNX Models)
If your models are in ONNX format:

```javascript
import * as ort from 'onnxruntime-web';

async function loadONNXModel(reportType) {
    const session = await ort.InferenceSession.create(`./models/${reportType}_model.onnx`);
    return session;
}

async function predictWithONNX(session, data) {
    const feeds = { 
        input: new ort.Tensor('float32', data, [1, data.length]) 
    };
    const results = await session.run(feeds);
    return results.output.data;
}
```

## Data Format

### Input Data Structure
The form data is automatically converted to the format expected by your models:

```javascript
// Example input for blood model
{
    "hemoglobin": 14.5,
    "rbc": 4.8,
    "wbc": 7.2,
    "platelets": 280,
    "cholesterol": 180,
    "glucose": 95
}
```

### Model Output Format
Your models should return results in this format:

```javascript
{
    "class": 0,                    // Predicted class (0=Normal, 1=Mild, etc.)
    "confidence": 0.85,            // Confidence score
    "probabilities": [0.85, 0.10, 0.04, 0.01]  // Class probabilities
}
```

## Integration Steps

### 1. Prepare Your Models
- Ensure your models are in the correct format (pickle, TensorFlow.js, ONNX)
- Place them in the `models/` directory
- Verify they accept the expected input features

### 2. Update Model Paths
Edit `model-integration.js` and update the model paths:

```javascript
const modelConfigs = {
    blood: {
        modelPath: './models/your_blood_model.pkl',  // Update this
        csvPath: './data/your_blood_data.csv',       // Update this
        // ... rest of config
    },
    // ... other models
};
```

### 3. Choose Integration Method
Select one of the integration options above and implement the `predictWithModel` function in `model-integration.js`.

### 4. Test Integration
1. Start your backend server (if using Option 1)
2. Open `upload.html` in your browser
3. Select a report type and enter test data
4. Click "Analyze Reports"
5. Check the browser console for any errors

## Form Fields for Each Report Type

### Blood Report
- Hemoglobin (g/dL)
- Red Blood Cells (million/μL)
- White Blood Cells (thousand/μL)
- Platelets (thousand/μL)
- Total Cholesterol (mg/dL)
- Blood Glucose (mg/dL)

### Kidney Report
- Creatinine (mg/dL)
- Blood Urea Nitrogen (mg/dL)
- eGFR (mL/min/1.73m²)
- Urine Albumin (mg/g)

### Liver Report
- ALT (U/L)
- AST (U/L)
- Total Bilirubin (mg/dL)
- Direct Bilirubin (mg/dL)
- Albumin (g/dL)
- Alkaline Phosphatase (U/L)

### Diabetes Report
- HbA1c (%)
- Fasting Glucose (mg/dL)
- Random Glucose (mg/dL)
- OGTT 2-hour (mg/dL)

### Thyroid Report
- TSH (mIU/L)
- Total T3 (ng/dL)
- Total T4 (μg/dL)
- Free T3 (pg/mL)
- Free T4 (ng/dL)

## Normal Ranges

The system includes normal ranges for each parameter to help with interpretation:

```javascript
const normalRanges = {
    blood: {
        hemoglobin: '12-16 g/dL (women), 14-18 g/dL (men)',
        // ... other ranges
    },
    // ... other report types
};
```

## Error Handling

The system includes comprehensive error handling:

```javascript
try {
    const results = await analyzeAllReports(reportData);
    // Process results
} catch (error) {
    console.error('Analysis failed:', error);
    // Handle error appropriately
}
```

## Customization

You can customize:
- Output labels for each model
- Risk factor identification logic
- Recommendation generation
- Normal ranges
- Severity levels

## Next Steps

1. **Share your models**: Please share your 5 models and CSV files so I can help you integrate them properly.
2. **Choose integration method**: Decide whether to use Python backend, TensorFlow.js, or ONNX Runtime.
3. **Test with sample data**: Use the form interface to test with sample medical data.
4. **Customize output**: Adjust the interpretation and recommendation logic based on your specific use case.

## Support

If you need help with:
- Converting models to different formats
- Setting up the backend server
- Customizing the analysis logic
- Integrating with your specific models

Please share your models and CSV files, and I'll help you complete the integration!
