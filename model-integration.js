// Model Integration Structure for Medical Report Analysis
// This file shows how to integrate your 5 models and CSV files

// Model configurations for each report type
const modelConfigs = {
    blood: {
        modelPath: './models/blood_model.pkl',
        csvPath: './data/blood_data.csv',
        features: ['WBC', 'LYMp', 'MIDp', 'NEUTp', 'LYMn', 'MIDn', 'NEUTn', 
                  'RBC', 'HGB', 'HCT', 'MCV', 'MCH', 'MCHC', 'RDWSD', 'RDWCV', 
                  'PLT', 'MPV', 'PDW', 'PCT', 'PLCR', 'Cholesterol'],
        outputLabels: ['Healthy', 'Unhealthy'],
        displayFeatures: {
            'WBC': 'White Blood Cells (thousand/μL)',
            'LYMp': 'Lymphocytes %',
            'MIDp': 'Mid %',
            'NEUTp': 'Neutrophils %',
            'LYMn': 'Lymphocytes Count',
            'MIDn': 'Mid Count',
            'NEUTn': 'Neutrophils Count',
            'RBC': 'Red Blood Cells (million/μL)',
            'HGB': 'Hemoglobin (g/dL)',
            'HCT': 'Hematocrit (%)',
            'MCV': 'Mean Cell Volume (fL)',
            'MCH': 'Mean Cell Hemoglobin (pg)',
            'MCHC': 'Mean Cell Hemoglobin Concentration (g/dL)',
            'RDWSD': 'RDW Standard Deviation',
            'RDWCV': 'RDW Coefficient of Variation (%)',
            'PLT': 'Platelets (thousand/μL)',
            'MPV': 'Mean Platelet Volume (fL)',
            'PDW': 'Platelet Distribution Width',
            'PCT': 'Plateletcrit (%)',
            'PLCR': 'Platelet Large Cell Ratio (%)',
            'Cholesterol': 'Cholesterol (mg/dL)'
        }
    },
    kidney: {
        modelPath: './models/kidney_model.pkl',
        csvPath: './data/kidney_data.csv',
        features: ['Age', 'Sex', 'Serum_Creatinine', 'BUN', 'eGFR', 
                  'Sodium', 'Potassium', 'Calcium', 'Phosphorus'],
        outputLabels: ['Normal', 'Mid', 'High'],
        displayFeatures: {
            'Age': 'Age (years)',
            'Sex': 'Sex (M/F)',
            'Serum_Creatinine': 'Serum Creatinine (mg/dL)',
            'BUN': 'Blood Urea Nitrogen (mg/dL)',
            'eGFR': 'eGFR (mL/min/1.73m²)',
            'Sodium': 'Sodium (mEq/L)',
            'Potassium': 'Potassium (mEq/L)',
            'Calcium': 'Calcium (mg/dL)',
            'Phosphorus': 'Phosphorus (mg/dL)'
        }
    },
    liver: {
        modelPath: './models/liver_model.pkl',
        csvPath: './data/liver_data.csv',
        features: ['Age', 'Sex', 'ALT', 'AST', 'ALP', 'GGT', 'Albumin', 
                  'Total_Protein', 'Total_Bilirubin', 'Direct_Bilirubin'],
        outputLabels: ['Normal', 'Mid', 'High'],
        displayFeatures: {
            'Age': 'Age (years)',
            'Sex': 'Sex (M/F)',
            'ALT': 'ALT (U/L)',
            'AST': 'AST (U/L)',
            'ALP': 'Alkaline Phosphatase (U/L)',
            'GGT': 'GGT (U/L)',
            'Albumin': 'Albumin (g/dL)',
            'Total_Protein': 'Total Protein (g/dL)',
            'Total_Bilirubin': 'Total Bilirubin (mg/dL)',
            'Direct_Bilirubin': 'Direct Bilirubin (mg/dL)'
        }
    },
    diabetes: {
        modelPath: './models/diabetes_model.pkl',
        csvPath: './data/diabetes_data.csv',
        features: ['Fasting_Blood_Glucose', 'Postprandial_Glucose', 'OGTT_2hr', 
                  'HbA1c', 'Insulin_Fasting', 'Insulin_2hr', 'C_Peptide'],
        outputLabels: ['Normal', 'Mid', 'High'],
        displayFeatures: {
            'Fasting_Blood_Glucose': 'Fasting Blood Glucose (mg/dL)',
            'Postprandial_Glucose': 'Postprandial Glucose (mg/dL)',
            'OGTT_2hr': 'OGTT 2-hour (mg/dL)',
            'HbA1c': 'HbA1c (%)',
            'Insulin_Fasting': 'Fasting Insulin (μU/mL)',
            'Insulin_2hr': '2-hour Insulin (μU/mL)',
            'C_Peptide': 'C-Peptide (ng/mL)'
        }
    },
    thyroid: {
        modelPath: './models/thyroid_model.pkl',
        csvPath: './data/thyroid_data.csv',
        features: ['TSH', 'Free_T4', 'Free_T3'],
        outputLabels: ['Low Risk', 'Mid Risk', 'High Risk'],
        displayFeatures: {
            'TSH': 'TSH (mIU/L)',
            'Free_T4': 'Free T4 (ng/dL)',
            'Free_T3': 'Free T3 (pg/mL)'
        }
    }
};

// Function to prepare data for model prediction
function prepareDataForModel(reportType, formData) {
    const config = modelConfigs[reportType];
    if (!config) {
        throw new Error(`Unknown report type: ${reportType}`);
    }

    // Convert form data to model input format
    const modelInput = config.features.map(feature => {
        let value = formData[feature];
        
        // Handle special cases
        if (feature === 'Sex') {
            // Convert M/F to 0/1
            value = (value === 'M' || value === 'Male') ? 0 : 1;
        } else {
            value = parseFloat(value) || 0;
        }
        
        return value;
    });

    return {
        input: modelInput,
        features: config.features,
        config: config
    };
}

// Function to call ML model via Flask backend
async function predictWithModel(reportType, preparedData) {
    try {
        // Call the Flask backend API
        const response = await fetch('http://localhost:5000/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reportType: reportType,
                data: preparedData.input,
                features: preparedData.features
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const result = await response.json();
        
        // Handle backend errors
        if (result.error) {
            throw new Error(result.error);
        }
        
        return result;

    } catch (error) {
        console.error('Model prediction error:', error);
        
        // If backend is not available, return a mock prediction for testing
        if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
            console.warn('Backend not available, using mock prediction');
            return {
                class: 0,
                predicted_class: 'Normal',
                confidence: 0.75,
                probabilities: {
                    'Normal': 0.75,
                    'Abnormal': 0.25
                },
                features_used: preparedData.features
            };
        }
        
        throw error;
    }
}

// Function to process multiple reports
async function analyzeAllReports(reportData) {
    const results = {};
    const errors = {};

    for (const [reportType, formData] of Object.entries(reportData)) {
        try {
            // Check if report has any data
            const hasData = Object.values(formData).some(value => value !== '');
            if (!hasData) continue;

            // Prepare data for model
            const preparedData = prepareDataForModel(reportType, formData);
            
            // Get prediction from model
            const prediction = await predictWithModel(reportType, preparedData);
            
            // Process results
            results[reportType] = {
                prediction: prediction,
                confidence: prediction.confidence || 0.85, // Default confidence
                interpretation: interpretResults(reportType, prediction, formData),
                recommendations: generateRecommendations(reportType, prediction, formData),
                normalRanges: getNormalRanges(reportType)
            };

        } catch (error) {
            errors[reportType] = error.message;
        }
    }

    return { results, errors };
}

// Function to interpret model results
function interpretResults(reportType, prediction, formData) {
    const config = modelConfigs[reportType];
    const predictedClass = prediction.class || prediction.prediction || 0;
    const predictedLabel = prediction.predicted_class || config.outputLabels[predictedClass] || 'Unknown';
    
    return {
        diagnosis: predictedLabel,
        severity: getSeverityLevel(predictedClass, reportType),
        description: getDescription(reportType, predictedClass),
        riskFactors: identifyRiskFactors(reportType, formData),
        confidence: prediction.confidence || 0.5
    };
}

// Function to generate recommendations based on results
function generateRecommendations(reportType, prediction, formData) {
    const recommendations = [];
    const config = modelConfigs[reportType];
    const predictedClass = prediction.class || prediction.prediction || 0;
    
    // General recommendations based on report type and prediction
    switch (reportType) {
        case 'blood':
            recommendations.push('Consult with a hematologist for detailed analysis');
            if (predictedClass > 0) {
                recommendations.push('Consider dietary modifications');
                recommendations.push('Regular monitoring recommended');
            }
            break;
            
        case 'kidney':
            recommendations.push('Consult with a nephrologist');
            if (predictedClass > 1) {
                recommendations.push('Monitor blood pressure regularly');
                recommendations.push('Consider kidney function monitoring');
            }
            break;
            
        case 'liver':
            recommendations.push('Consult with a hepatologist');
            if (predictedClass > 0) {
                recommendations.push('Avoid alcohol consumption');
                recommendations.push('Monitor liver function regularly');
            }
            break;
            
        case 'diabetes':
            recommendations.push('Consult with an endocrinologist');
            if (predictedClass > 0) {
                recommendations.push('Monitor blood glucose levels');
                recommendations.push('Consider lifestyle modifications');
            }
            break;
            
        case 'thyroid':
            recommendations.push('Consult with an endocrinologist');
            if (predictedClass > 0) {
                recommendations.push('Regular thyroid function monitoring');
                recommendations.push('Consider medication if needed');
            }
            break;
    }
    
    return recommendations;
}

// Helper functions
function getSeverityLevel(classIndex, reportType) {
    const severityMaps = {
        blood: ['Healthy', 'Unhealthy'],
        kidney: ['Normal', 'Mid', 'High'],
        liver: ['Normal', 'Mid', 'High'],
        diabetes: ['Normal', 'Mid', 'High'],
        thyroid: ['Low Risk', 'Mid Risk', 'High Risk']
    };
    
    const levels = severityMaps[reportType] || ['Normal', 'Mild', 'Moderate', 'Severe'];
    return levels[classIndex] || 'Unknown';
}

function getDescription(reportType, classIndex) {
    const descriptions = {
        blood: ['Normal blood parameters', 'Abnormal blood parameters detected'],
        kidney: ['Normal kidney function', 'Moderate kidney dysfunction', 'High risk kidney disease'],
        liver: ['Normal liver function', 'Moderate liver dysfunction', 'High risk liver disease'],
        diabetes: ['Normal glucose metabolism', 'Moderate diabetes risk', 'High diabetes risk'],
        thyroid: ['Low thyroid risk', 'Moderate thyroid risk', 'High thyroid risk']
    };
    
    return descriptions[reportType]?.[classIndex] || 'Unknown condition';
}

function identifyRiskFactors(reportType, formData) {
    const riskFactors = [];
    
    // Add logic to identify risk factors based on values
    // This would be customized based on your specific criteria
    
    return riskFactors;
}

function getNormalRanges(reportType) {
    const normalRanges = {
        blood: {
            WBC: '4.5-11.0 thousand/μL',
            HGB: '12-16 g/dL (women), 14-18 g/dL (men)',
            RBC: '4.2-5.4 million/μL (women), 4.7-6.1 million/μL (men)',
            PLT: '150-450 thousand/μL',
            Cholesterol: '<200 mg/dL',
            HCT: '36-46% (women), 41-53% (men)',
            MCV: '80-100 fL',
            MCH: '27-33 pg',
            MCHC: '32-36 g/dL'
        },
        kidney: {
            Serum_Creatinine: '0.6-1.2 mg/dL (women), 0.8-1.3 mg/dL (men)',
            BUN: '7-20 mg/dL',
            eGFR: '>90 mL/min/1.73m²',
            Sodium: '136-145 mEq/L',
            Potassium: '3.5-5.0 mEq/L',
            Calcium: '8.5-10.5 mg/dL',
            Phosphorus: '2.5-4.5 mg/dL'
        },
        liver: {
            ALT: '7-56 U/L',
            AST: '10-40 U/L',
            ALP: '44-147 U/L',
            GGT: '9-48 U/L (women), 12-58 U/L (men)',
            Albumin: '3.5-5.0 g/dL',
            Total_Protein: '6.0-8.3 g/dL',
            Total_Bilirubin: '0.1-1.2 mg/dL',
            Direct_Bilirubin: '0.0-0.3 mg/dL'
        },
        diabetes: {
            Fasting_Blood_Glucose: '70-100 mg/dL',
            Postprandial_Glucose: '<140 mg/dL',
            OGTT_2hr: '<140 mg/dL',
            HbA1c: '<5.7%',
            Insulin_Fasting: '2-25 μU/mL',
            Insulin_2hr: '<30 μU/mL',
            C_Peptide: '0.5-2.0 ng/mL'
        },
        thyroid: {
            TSH: '0.4-4.0 mIU/L',
            Free_T4: '0.8-1.8 ng/dL',
            Free_T3: '2.3-4.2 pg/mL'
        }
    };
    
    return normalRanges[reportType] || {};
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        prepareDataForModel,
        predictWithModel,
        analyzeAllReports,
        interpretResults,
        generateRecommendations,
        modelConfigs
    };
}

// Integration with the upload page
function integrateWithUploadPage() {
    // This function shows how to integrate with the existing upload page
    window.analyzeReportsWithML = async function(reportData) {
        try {
            const results = await analyzeAllReports(reportData);
            return results;
        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        }
    };
}

// Initialize integration when script loads
if (typeof window !== 'undefined') {
    integrateWithUploadPage();
}
