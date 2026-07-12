# Models Directory

Place your trained ML models here:

- `blood_model.pkl` - Blood report analysis model
- `kidney_model.pkl` - Kidney function analysis model  
- `liver_model.pkl` - Liver function analysis model
- `diabetes_model.pkl` - Diabetes analysis model
- `thyroid_model.pkl` - Thyroid function analysis model

## Supported Formats

- **Pickle (.pkl)** - For scikit-learn models
- **TensorFlow.js (.json)** - For TensorFlow.js models
- **ONNX (.onnx)** - For ONNX Runtime models
- **Joblib (.joblib)** - Alternative to pickle

## Model Requirements

Each model should:
1. Accept numerical input features in the specified order
2. Return predictions with confidence scores
3. Support the feature set defined in `model-integration.js`

## Example Model Structure

```python
# Example for blood model
features = ['hemoglobin', 'rbc', 'wbc', 'platelets', 'cholesterol', 'glucose']
output_classes = ['Normal', 'Anemia', 'High Cholesterol', 'High Glucose']

# Model should accept input shape: (n_samples, 6)
# Model should return: prediction class and probabilities
```
