# Data Directory

Place your training CSV files here:

- `blood_data.csv` - Blood report training data
- `kidney_data.csv` - Kidney function training data
- `liver_data.csv` - Liver function training data  
- `diabetes_data.csv` - Diabetes training data
- `thyroid_data.csv` - Thyroid function training data

## Expected CSV Format

Each CSV should have:
1. **Feature columns** - Numerical values for each parameter
2. **Target column** - Classification labels (0=Normal, 1=Mild, 2=Moderate, 3=Severe)
3. **Header row** - Column names matching the feature names

## Example CSV Structure

### Blood Data (`blood_data.csv`)
```csv
hemoglobin,rbc,wbc,platelets,cholesterol,glucose,target
14.5,4.8,7.2,280,180,95,0
12.1,4.2,6.8,250,220,105,1
16.2,5.1,8.1,320,160,88,0
...
```

### Kidney Data (`kidney_data.csv`)
```csv
creatinine,urea,egfr,urine_albumin,target
0.9,15,95,25,0
1.2,25,78,45,1
1.8,35,55,120,2
...
```

## Data Requirements

- **Minimum samples**: At least 100 samples per class for reliable training
- **Balanced classes**: Try to have roughly equal samples per class
- **Clean data**: Remove outliers and handle missing values
- **Normalized**: Consider normalizing numerical features

## Feature Names

Ensure your CSV column names match exactly:

### Blood Features
- `hemoglobin`, `rbc`, `wbc`, `platelets`, `cholesterol`, `glucose`

### Kidney Features  
- `creatinine`, `urea`, `egfr`, `urine_albumin`

### Liver Features
- `alt`, `ast`, `bilirubin_total`, `bilirubin_direct`, `albumin`, `alkaline_phosphatase`

### Diabetes Features
- `hba1c`, `fasting_glucose`, `random_glucose`, `ogtt_2h`

### Thyroid Features
- `tsh`, `t3_total`, `t4_total`, `free_t3`, `free_t4`
