from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from imblearn.over_sampling import SMOTE
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Global variables to store models and preprocessors
models = {}
scalers = {}
label_encoders = {}

# Reference ranges for medical parameters
REFERENCE_RANGES = {
    'blood': {
        # Basic CBC Parameters
        'WBC': {'normal': (4.0, 11.0), 'unit': '×10³/μL', 'description': 'White Blood Cell count'},
        'RBC': {'normal': (4.0, 5.5), 'unit': '×10⁶/μL', 'description': 'Red Blood Cell count'},
        'HGB': {'normal': (12.0, 16.0), 'unit': 'g/dL', 'description': 'Hemoglobin'},
        'HCT': {'normal': (36.0, 46.0), 'unit': '%', 'description': 'Hematocrit'},
        'PLT': {'normal': (150.0, 450.0), 'unit': '×10³/μL', 'description': 'Platelet count'},
        
        # Red Blood Cell Indices
        'MCV': {'normal': (80.0, 100.0), 'unit': 'fL', 'description': 'Mean Corpuscular Volume'},
        'MCH': {'normal': (27.0, 33.0), 'unit': 'pg', 'description': 'Mean Corpuscular Hemoglobin'},
        'MCHC': {'normal': (32.0, 36.0), 'unit': 'g/dL', 'description': 'Mean Corpuscular Hemoglobin Concentration'},
        'RDWSD': {'normal': (35.0, 45.0), 'unit': 'fL', 'description': 'Red Cell Distribution Width - Standard Deviation'},
        'RDWCV': {'normal': (11.0, 15.0), 'unit': '%', 'description': 'Red Cell Distribution Width - Coefficient of Variation'},
        
        # Platelet Indices
        'MPV': {'normal': (7.0, 12.0), 'unit': 'fL', 'description': 'Mean Platelet Volume'},
        'PDW': {'normal': (10.0, 18.0), 'unit': 'fL', 'description': 'Platelet Distribution Width'},
        'PCT': {'normal': (0.1, 0.3), 'unit': '%', 'description': 'Plateletcrit'},
        'PLCR': {'normal': (15.0, 35.0), 'unit': '%', 'description': 'Platelet Large Cell Ratio'},
        
        # Differential Counts (Percentages)
        'LYMp': {'normal': (20.0, 40.0), 'unit': '%', 'description': 'Lymphocyte percentage'},
        'MIDp': {'normal': (1.0, 6.0), 'unit': '%', 'description': 'Monocyte percentage'},
        'NEUTp': {'normal': (50.0, 70.0), 'unit': '%', 'description': 'Neutrophil percentage'},
        
        # Differential Counts (Absolute)
        'LYMn': {'normal': (1.0, 4.0), 'unit': '×10³/μL', 'description': 'Lymphocyte count'},
        'MIDn': {'normal': (0.1, 0.8), 'unit': '×10³/μL', 'description': 'Monocyte count'},
        'NEUTn': {'normal': (2.0, 7.0), 'unit': '×10³/μL', 'description': 'Neutrophil count'},
        
        # Additional Parameters
        'Cholesterol': {'normal': (0, 200), 'unit': 'mg/dL', 'description': 'Total Cholesterol'},
        'Glucose': {'normal': (70, 100), 'unit': 'mg/dL', 'description': 'Blood Glucose'}
    },
    'diabetes': {
        'Age': {'normal': (18, 100), 'unit': 'years', 'description': 'Age'},
        'Gender': {'normal': (0, 1), 'unit': 'M/F', 'description': 'Gender (0=Male, 1=Female)'},
        'Polyuria': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Excessive urination'},
        'Polydipsia': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Excessive thirst'},
        'sudden weight loss': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Sudden weight loss'},
        'weakness': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Weakness'},
        'Polyphagia': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Excessive hunger'},
        'Genital thrush': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Genital thrush'},
        'visual blurring': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Visual blurring'},
        'Itching': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Itching'},
        'Irritability': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Irritability'},
        'delayed healing': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Delayed healing'},
        'partial paresis': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Partial paresis'},
        'muscle stiffness': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Muscle stiffness'},
        'Alopecia': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Hair loss'},
        'Obesity': {'normal': (0, 1), 'unit': 'Yes/No', 'description': 'Obesity'},
        'Fasting_Blood_Glucose': {'normal': (70, 100), 'unit': 'mg/dL', 'description': 'Fasting Blood Glucose'},
        'Postprandial_Glucose': {'normal': (70, 140), 'unit': 'mg/dL', 'description': 'Postprandial Glucose'},
        'OGTT_2hr': {'normal': (70, 140), 'unit': 'mg/dL', 'description': 'Oral Glucose Tolerance Test 2-hour'},
        'HbA1c': {'normal': (4.0, 5.6), 'unit': '%', 'description': 'Hemoglobin A1c'},
        'Insulin_Fasting': {'normal': (2, 25), 'unit': 'μU/mL', 'description': 'Fasting Insulin'},
        'Insulin_2hr': {'normal': (10, 100), 'unit': 'μU/mL', 'description': '2-hour Insulin'},
        'C_Peptide': {'normal': (0.5, 3.0), 'unit': 'ng/mL', 'description': 'C-Peptide'}
    },
    'kidney': {
        'Age': {'normal': (18, 100), 'unit': 'years', 'description': 'Age'},
        'Sex': {'normal': (0, 1), 'unit': 'M/F', 'description': 'Sex (M=0, F=1)'},
        'Serum_Creatinine': {'normal': (0.6, 1.2), 'unit': 'mg/dL', 'description': 'Serum Creatinine'},
        'BUN': {'normal': (7, 20), 'unit': 'mg/dL', 'description': 'Blood Urea Nitrogen'},
        'eGFR': {'normal': (90, 120), 'unit': 'mL/min/1.73m²', 'description': 'Estimated Glomerular Filtration Rate'},
        'Sodium': {'normal': (136, 145), 'unit': 'mEq/L', 'description': 'Sodium'},
        'Potassium': {'normal': (3.5, 5.0), 'unit': 'mEq/L', 'description': 'Potassium'},
        'Calcium': {'normal': (8.5, 10.5), 'unit': 'mg/dL', 'description': 'Calcium'},
        'Phosphorus': {'normal': (2.5, 4.5), 'unit': 'mg/dL', 'description': 'Phosphorus'}
    },
    'liver': {
        'Age': {'normal': (18, 100), 'unit': 'years', 'description': 'Age'},
        'Sex': {'normal': (0, 1), 'unit': 'M/F', 'description': 'Sex (0=Male, 1=Female)'},
        'ALT': {'normal': (7, 56), 'unit': 'U/L', 'description': 'Alanine Aminotransferase'},
        'AST': {'normal': (10, 40), 'unit': 'U/L', 'description': 'Aspartate Aminotransferase'},
        'ALP': {'normal': (44, 147), 'unit': 'U/L', 'description': 'Alkaline Phosphatase'},
        'GGT': {'normal': (8, 61), 'unit': 'U/L', 'description': 'Gamma-Glutamyl Transferase'},
        'Albumin': {'normal': (3.5, 5.0), 'unit': 'g/dL', 'description': 'Albumin'},
        'Total_Protein': {'normal': (6.0, 8.3), 'unit': 'g/dL', 'description': 'Total Protein'},
        'Total_Bilirubin': {'normal': (0.1, 1.2), 'unit': 'mg/dL', 'description': 'Total Bilirubin'},
        'Direct_Bilirubin': {'normal': (0.0, 0.3), 'unit': 'mg/dL', 'description': 'Direct Bilirubin'}
    },
    'thyroid': {
        'TSH': {'normal': (0.4, 4.0), 'unit': 'mIU/L', 'description': 'Thyroid Stimulating Hormone'},
        'Free_T3': {'normal': (2.3, 4.2), 'unit': 'pg/mL', 'description': 'Free Triiodothyronine'},
        'Free_T4': {'normal': (0.8, 1.8), 'unit': 'ng/dL', 'description': 'Free Thyroxine'}
    }
}

def analyze_parameter_value(param_name, value, report_type):
    """Analyze individual parameter values against reference ranges"""
    if report_type not in REFERENCE_RANGES or param_name not in REFERENCE_RANGES[report_type]:
        return {
            'status': 'unknown',
            'message': 'No reference range available',
            'normal_range': 'N/A',
            'unit': 'N/A',
            'description': 'Unknown parameter'
        }
    
    ref_data = REFERENCE_RANGES[report_type][param_name]
    normal_min, normal_max = ref_data['normal']
    unit = ref_data['unit']
    description = ref_data['description']
    
    # Handle binary parameters (0/1)
    if unit in ['Yes/No', 'M/F', 'Good/Poor']:
        if value == 0:
            return {
                'status': 'normal',
                'message': f'Normal: {description} is negative',
                'normal_range': f'0 (No)',
                'unit': unit,
                'description': description,
                'value_status': 'Normal'
            }
        else:
            return {
                'status': 'abnormal',
                'message': f'Abnormal: {description} is positive',
                'normal_range': f'0 (No)',
                'unit': unit,
                'description': description,
                'value_status': 'Abnormal'
            }
    
    # Handle continuous parameters
    if value < normal_min:
        return {
            'status': 'low',
            'message': f'Low: {description} is below normal range',
            'normal_range': f'{normal_min}-{normal_max}',
            'unit': unit,
            'description': description,
            'value_status': 'Low',
            'explanation': get_low_explanation(param_name, report_type)
        }
    elif value > normal_max:
        return {
            'status': 'high',
            'message': f'High: {description} is above normal range',
            'normal_range': f'{normal_min}-{normal_max}',
            'unit': unit,
            'description': description,
            'value_status': 'High',
            'explanation': get_high_explanation(param_name, report_type)
        }
    else:
        return {
            'status': 'normal',
            'message': f'Normal: {description} is within normal range',
            'normal_range': f'{normal_min}-{normal_max}',
            'unit': unit,
            'description': description,
            'value_status': 'Normal'
        }

def get_low_explanation(param_name, report_type):
    """Get explanation for low values"""
    explanations = {
        'blood': {
            'WBC': 'White Blood Cells are low, which weakens the body\'s defense against infections. It may result from viral infections, autoimmune disease, or bone marrow problems. Low WBC increases vulnerability to illness.',
            'RBC': 'Red Blood Cells are below normal, a hallmark of anemia. This leads to fatigue, weakness, and poor oxygen delivery. Causes include nutritional deficiencies or chronic disease.',
            'HGB': 'Hemoglobin is low, confirming anemia. It reduces oxygen transport capacity, causing pallor and breathlessness.',
            'HCT': 'Hematocrit is low, reflecting anemia or blood loss. It shows reduced red blood cell concentration.',
            'PLT': 'Platelets are low (thrombocytopenia), increasing bleeding risk. It may result from viral infection or marrow suppression.',
            'MCV': 'MCV is low, showing microcytic red cells, often due to iron deficiency. It is linked to anemia of chronic disease or thalassemia.',
            'MCH': 'MCH is low, showing reduced hemoglobin per cell. This suggests iron deficiency anemia.',
            'MCHC': 'MCHC is low, meaning hypochromic cells, common in iron deficiency anemia.',
            'RDWSD': 'RDW-SD is high, indicating red cell size variation (anisocytosis). Often caused by iron, folate, or vitamin B12 deficiency. It may point toward nutritional anemia.',
            'RDWCV': 'RDW is high, indicating variable RBC size. This suggests iron, folate, or B12 deficiency.',
            'MPV': 'Mean Platelet Volume is low, suggesting smaller, older platelets. This can be seen in bone marrow suppression or aplastic anemia.',
            'PDW': 'PDW is low, showing uniform platelet size. Usually not concerning, but may reflect low platelet turnover.',
            'PCT': 'Plateletcrit is low, indicating low total platelet volume in blood. This suggests thrombocytopenia, increasing bleeding risk.',
            'PLCR': 'PLCR is low, meaning fewer large platelets. This can happen with bone marrow suppression or reduced platelet turnover.',
            'LYMp': 'Lymphocytes are low, suggesting immune suppression or stress response.',
            'MIDp': 'MID% is low, meaning fewer mid-sized immune cells (monocytes, eosinophils, basophils). This may weaken certain immune defenses. Often seen in bone marrow suppression or immune compromise.',
            'NEUTp': 'Neutrophils are low, linked to viral infections or immune suppression.',
            'LYMn': 'Absolute lymphocyte count is low (lymphopenia). This may result from viral infections, stress, or immune suppression. It can weaken the body\'s ability to fight infections.',
            'MIDn': 'Absolute MID cell count is low, suggesting fewer monocytes, eosinophils, or basophils. This may indicate suppressed immune activity or bone marrow issues.',
            'NEUTn': 'Absolute neutrophil count is low (neutropenia). This increases risk of bacterial and fungal infections. Common causes include chemotherapy, viral infections, or autoimmune disease.',
            'Cholesterol': 'Cholesterol is normal, supporting cardiovascular health.',
            'Glucose': 'Glucose provides energy to cells. Low glucose may indicate hypoglycemia, which can cause dizziness, confusion, and in severe cases, unconsciousness. Immediate treatment is needed.'
        },
        'diabetes': {
            'Fasting_Blood_Glucose': 'Fasting glucose measures blood sugar after 8+ hours without food. Low fasting glucose may indicate hypoglycemia, which requires immediate attention to prevent serious complications.',
            'Postprandial_Glucose': 'Postprandial glucose measures blood sugar 2 hours after eating. Low postprandial glucose may indicate reactive hypoglycemia or overmedication, requiring dietary adjustments.',
            'OGTT_2hr': 'Oral Glucose Tolerance Test measures how well your body processes sugar. Low OGTT 2-hour glucose may indicate reactive hypoglycemia, suggesting insulin overproduction.',
            'HbA1c': 'HbA1c reflects average blood sugar over 2-3 months. Low HbA1c may indicate frequent hypoglycemic episodes or overmedication, requiring treatment adjustment.',
            'Insulin_Fasting': 'Fasting insulin measures baseline insulin production. Low fasting insulin may indicate insulin deficiency or beta-cell dysfunction, requiring medical evaluation.',
            'Insulin_2hr': '2-hour insulin measures insulin response to glucose challenge. Low 2-hour insulin may indicate impaired insulin secretion or beta-cell dysfunction.',
            'C_Peptide': 'C-Peptide reflects endogenous insulin production. Low C-Peptide may indicate insulin deficiency or beta-cell dysfunction, suggesting type 1 diabetes.'
        },
        'kidney': {
            'Age': 'Age is a demographic factor. Low age values are not clinically relevant for kidney function assessment.',
            'Sex': 'Sex is a demographic factor. Low sex values (0) indicate male gender (M), which is normal and not concerning.',
            'Serum_Creatinine': 'Creatinine is a waste product filtered by kidneys. Low levels may indicate muscle wasting, malnutrition, or liver disease. While low creatinine itself is not harmful, it may suggest underlying health issues that need attention.',
            'BUN': 'Blood Urea Nitrogen shows protein waste in blood. Low levels may suggest liver disease, malnutrition, or overhydration. This indicates kidneys are working well, but the underlying cause should be investigated.',
            'eGFR': 'eGFR estimates overall kidney function. Low eGFR indicates reduced kidney function and may suggest chronic kidney disease. Values below 60 are concerning and require medical attention.',
            'Sodium': 'Sodium controls fluid balance and blood pressure. Low sodium may indicate overhydration, kidney dysfunction, or hormonal imbalances, potentially causing confusion or weakness.',
            'Potassium': 'Potassium is vital for heart and muscle function. Low potassium may cause muscle weakness and heart rhythm problems, often due to diuretics or excessive fluid loss.',
            'Calcium': 'Calcium is essential for bone health and muscle function. Low calcium may indicate vitamin D deficiency, kidney dysfunction, or parathyroid issues, potentially causing muscle cramps or bone problems.',
            'Phosphorus': 'Phosphorus works with calcium for bone health. Low phosphorus may indicate malnutrition, vitamin D deficiency, or kidney dysfunction, potentially affecting bone strength and energy metabolism.'
        },
        'liver': {
            'ALT': 'ALT is a liver enzyme. Low ALT levels are generally normal and not concerning, indicating healthy liver function with no major liver cell damage.',
            'AST': 'AST is a liver and heart enzyme. Low AST levels are generally normal and not concerning, indicating minimal liver cell stress and stable liver health.',
            'ALP': 'ALP is linked to bile ducts and bones. Low ALP levels are generally normal and not concerning, indicating stable liver and bile duct function.',
            'GGT': 'GGT is a sensitive liver enzyme. Low GGT levels are generally normal and not concerning, indicating minimal bile duct stress and healthy liver detox function.',
            'Albumin': 'Albumin is a key protein made by the liver. Low albumin suggests reduced liver synthetic function, common in cirrhosis or chronic liver disease, and may cause swelling or fluid accumulation.',
            'Total_Protein': 'Total Protein includes albumin and globulins. Low levels suggest poor nutrition or chronic liver disease, which may weaken immunity and healing ability.',
            'Total_Bilirubin': 'Total Bilirubin reflects breakdown of red blood cells. Low bilirubin levels are generally normal and not concerning, indicating effective clearance and good detox function.',
            'Direct_Bilirubin': 'Direct Bilirubin indicates conjugated bilirubin. Low direct bilirubin levels are generally normal and not concerning, indicating healthy bile flow and effective waste clearance.'
        },
        'thyroid': {
            'TSH': 'TSH is low, which often indicates hyperthyroid states, where the pituitary reduces stimulation of the thyroid. Persistently low TSH may suggest risk of hyperthyroidism. This can cause symptoms like weight loss, anxiety, or palpitations. It is important to confirm with Free T4/Free T3 before diagnosis.',
            'Free_T3': 'Free T3 is low, which can occur in hypothyroidism or during illness (sick euthyroid syndrome). It indicates reduced availability of active thyroid hormone. Symptoms may include low energy, constipation, and weight gain. When accompanied by low T4 and high TSH, it strongly indicates hypothyroidism.',
            'Free_T4': 'Free T4 is low, which indicates reduced thyroxine hormone production by the thyroid gland. When combined with high TSH, this confirms hypothyroidism. Low T4 with normal TSH may suggest central hypothyroidism (pituitary-related). Symptoms of low T4 include fatigue, weight gain, and slow metabolism.'
        }
    }
    return explanations.get(report_type, {}).get(param_name, 'Low value may indicate an underlying condition.')

def get_high_explanation(param_name, report_type):
    """Get explanation for high values"""
    explanations = {
        'blood': {
            'WBC': 'White Blood Cells are high, suggesting infection, inflammation, or stress response. Extremely high WBC may indicate leukemia or severe bacterial infection. Monitoring and clinical review are required.',
            'RBC': 'Red Blood Cells are elevated, possibly from dehydration or polycythemia. This increases blood thickness and clotting risks.',
            'HGB': 'Hemoglobin is high, suggesting polycythemia, chronic lung disease, or smoking effects. This raises clotting risk.',
            'HCT': 'Hematocrit is high, suggesting dehydration, polycythemia, or chronic hypoxia. This thickens the blood and strains the heart.',
            'PLT': 'Platelets are high (thrombocytosis), often seen in inflammation or myeloproliferative disorders. This may raise clot risk.',
            'MCV': 'MCV is high, showing macrocytic cells, often caused by vitamin B12 or folate deficiency. Chronic alcohol use can also elevate MCV.',
            'MCH': 'MCH is high, often due to vitamin B12 or folate deficiency. Cells are larger and carry more hemoglobin than normal.',
            'MCHC': 'MCHC is high, seen in spherocytosis or severe dehydration.',
            'RDWSD': 'RDW-SD is normal, showing uniform red cell size and stable blood health.',
            'RDWCV': 'RDW is normal, suggesting uniform red cell size.',
            'MPV': 'Mean Platelet Volume is high, indicating larger, younger platelets. This often occurs after platelet destruction or in immune thrombocytopenia.',
            'PDW': 'PDW is high, suggesting varied platelet sizes. This often occurs in inflammation, cardiovascular disease, or marrow disorders.',
            'PCT': 'Plateletcrit is high, showing increased platelet mass. This may raise the risk of thrombosis and clotting disorders.',
            'PLCR': 'PLCR is high, suggesting more large, immature platelets in circulation. This may indicate active platelet regeneration or immune thrombocytopenia.',
            'LYMp': 'Lymphocytes are high, often seen in viral infections or autoimmune conditions.',
            'MIDp': 'MID% is high, suggesting chronic infection, inflammation, or allergic response. It indicates an active immune system reaction that may need further investigation.',
            'NEUTp': 'Neutrophils are high, indicating bacterial infection or inflammation.',
            'LYMn': 'Absolute lymphocyte count is high (lymphocytosis). This often occurs in viral infections, leukemia, or autoimmune disorders. Persistent elevation requires further evaluation.',
            'MIDn': 'Absolute MID cell count is high, linked to chronic infection, parasitic infestations, or allergic disorders. Elevated levels may require additional testing.',
            'NEUTn': 'Absolute neutrophil count is high (neutrophilia). This usually indicates bacterial infection, inflammation, or stress response. Further medical evaluation may be needed.',
            'Cholesterol': 'Cholesterol is high, increasing risk of heart attack and stroke. Diet and medication may be necessary.',
            'Glucose': 'Glucose provides energy to cells. High glucose may indicate diabetes or prediabetes, requiring medical evaluation and lifestyle changes to prevent complications.'
        },
        'diabetes': {
            'Fasting_Blood_Glucose': 'Fasting glucose measures blood sugar after 8+ hours without food. High fasting glucose may indicate diabetes or prediabetes, requiring lifestyle changes and medical management.',
            'Postprandial_Glucose': 'Postprandial glucose measures blood sugar 2 hours after eating. High postprandial glucose may indicate diabetes or impaired glucose tolerance, suggesting insulin resistance.',
            'OGTT_2hr': 'Oral Glucose Tolerance Test measures how well your body processes sugar. High OGTT 2-hour glucose may indicate diabetes or impaired glucose tolerance, requiring dietary and lifestyle modifications.',
            'HbA1c': 'HbA1c reflects average blood sugar over 2-3 months. High HbA1c indicates poor long-term blood sugar control and increased diabetes risk, requiring comprehensive diabetes management.',
            'Insulin_Fasting': 'Fasting insulin measures baseline insulin production. High fasting insulin may indicate insulin resistance or metabolic syndrome, requiring lifestyle interventions.',
            'Insulin_2hr': '2-hour insulin measures insulin response to glucose challenge. High 2-hour insulin may indicate insulin resistance or metabolic syndrome, suggesting impaired glucose metabolism.',
            'C_Peptide': 'C-Peptide reflects endogenous insulin production. High C-Peptide may indicate insulin resistance or metabolic syndrome, requiring comprehensive metabolic evaluation.'
        },
        'kidney': {
            'Age': 'Age is a demographic factor. High age values may indicate increased risk of kidney disease, but age itself is not a pathological condition.',
            'Sex': 'Sex is a demographic factor. High sex values (1) indicate female gender (F), which is normal and not concerning.',
            'Serum_Creatinine': 'Creatinine is a waste product filtered by kidneys. High levels indicate kidney dysfunction or dehydration. This is one of the most reliable markers of chronic kidney disease and requires medical attention.',
            'BUN': 'Blood Urea Nitrogen shows protein waste in blood. High levels may indicate kidney dysfunction or dehydration. When combined with high creatinine, it usually signals chronic kidney disease requiring long-term monitoring.',
            'eGFR': 'eGFR estimates overall kidney function. High eGFR is generally normal and indicates good kidney function. Values above 90 are considered excellent and show healthy kidney performance.',
            'Sodium': 'Sodium controls fluid balance and blood pressure. High sodium may indicate dehydration or kidney dysfunction, potentially causing high blood pressure and kidney stress.',
            'Potassium': 'Potassium is vital for heart and muscle function. High potassium can cause dangerous heart rhythm problems, especially in kidney disease when filtering fails. Emergency treatment may be needed if very high.',
            'Calcium': 'Calcium is essential for bone health and muscle function. High calcium may indicate hyperparathyroidism, kidney dysfunction, or bone disorders, potentially causing kidney stones or bone problems.',
            'Phosphorus': 'Phosphorus works with calcium for bone health. High phosphorus may indicate kidney dysfunction or bone disorders, potentially causing bone weakness and cardiovascular complications in kidney disease.'
        },
        'liver': {
            'ALT': 'ALT is a liver enzyme. High ALT indicates liver injury or inflammation. It often rises in hepatitis, fatty liver, or alcohol-related damage. Persistent elevation requires medical evaluation and monitoring helps track disease progression.',
            'AST': 'AST is a liver and heart enzyme. High AST suggests liver inflammation or heart issues. In combination with high ALT, it confirms liver damage. Elevated AST is seen in hepatitis, cirrhosis, or alcohol damage, and regular testing helps monitor severity.',
            'ALP': 'ALP is linked to bile ducts and bones. High ALP often signals bile obstruction, gallstones, or liver disease. It may also rise in bone disorders. Very high ALP needs further imaging studies and monitoring trend is important.',
            'GGT': 'GGT is a sensitive liver enzyme. High GGT is linked to alcohol use, fatty liver, or bile duct disease. When combined with ALP, it suggests bile obstruction. Elevated GGT is a warning sign of chronic liver stress, and reducing alcohol and toxins may help.',
            'Albumin': 'Albumin is a key protein made by the liver. High albumin levels are generally normal and not concerning, indicating good liver protein production and healthy nutritional status.',
            'Total_Protein': 'Total Protein includes albumin and globulins. High total protein may indicate dehydration or blood disorders, requiring further evaluation to determine the underlying cause.',
            'Total_Bilirubin': 'Total Bilirubin reflects breakdown of red blood cells. High levels cause jaundice and indicate poor liver clearance. This may occur in hepatitis, cirrhosis, or bile blockage, and severe cases cause yellow eyes and dark urine.',
            'Direct_Bilirubin': 'Direct Bilirubin indicates conjugated bilirubin. High levels mean liver can process but not excrete properly. This happens in bile duct blockage or liver injury, and elevated direct bilirubin often signals cholestasis.'
        },
        'thyroid': {
            'TSH': 'TSH is high, which usually indicates hypothyroid states, as the pituitary increases stimulation to compensate for a weak thyroid. Persistently high TSH may indicate risk of hypothyroidism. Symptoms can include fatigue, weight gain, and cold intolerance. If T4/T3 are still normal, this suggests a mid-risk (subclinical) condition.',
            'Free_T3': 'Free T3 is high, which suggests hyperthyroid activity, often seen in Graves\' disease or toxic nodules. This causes symptoms like palpitations, anxiety, diarrhea, and weight loss. T3-toxicosis (high T3, normal T4) is also possible. High T3 with suppressed TSH confirms overt hyperthyroidism.',
            'Free_T4': 'Free T4 is high, which suggests excess thyroid hormone production. If TSH is suppressed, this indicates hyperthyroidism. High T4 levels cause symptoms like weight loss, anxiety, tremors, and heat intolerance. Occasionally, high T4 can occur from medication or iodine excess.'
        }
    }
    return explanations.get(report_type, {}).get(param_name, 'High value may indicate an underlying condition.')

def load_blood_model():
    """Load and prepare the blood report model"""
    try:
        # Load the dataset
        df = pd.read_csv('../data/blood_data.csv', encoding='utf-8')
        
        # Prepare features (excluding ID, Health_Status, Disease_Label, Cholesterol_Risk)
        feature_cols = ['WBC', 'LYMp', 'MIDp', 'NEUTp', 'LYMn', 'MIDn', 'NEUTn', 
                       'RBC', 'HGB', 'HCT', 'MCV', 'MCH', 'MCHC', 'RDWSD', 'RDWCV', 
                       'PLT', 'MPV', 'PDW', 'PCT', 'PLCR', 'Cholesterol']
        
        X = df[feature_cols]
        y = df['Disease_Label']
        
        # Create a simple binary classifier for disease detection
        # Convert multi-label to binary (Healthy vs Unhealthy)
        y_binary = (y != 'Healthy').astype(int)
        
        # Train a simple model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y_binary)
        
        # Store model and feature names
        models['blood'] = {
            'model': model,
            'features': feature_cols,
            'label_encoder': None
        }
        
        print("Blood model loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading blood model: {e}")
        return False

def load_diabetes_model():
    """Load and prepare the diabetes model"""
    try:
        df = pd.read_csv('../data/diabetes_data.csv', encoding='utf-8')
        
        feature_cols = ['Fasting_Blood_Glucose', 'Postprandial_Glucose', 'OGTT_2hr', 
                       'HbA1c', 'Insulin_Fasting', 'Insulin_2hr', 'C_Peptide']
        X = df[feature_cols]
        y = df['Risk_Class']
        
        # Encode labels
        le = LabelEncoder()
        y_enc = le.fit_transform(y)
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y_enc)
        
        models['diabetes'] = {
            'model': model,
            'features': feature_cols,
            'label_encoder': le
        }
        
        print("Diabetes model loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading diabetes model: {e}")
        return False

def load_kidney_model():
    """Load and prepare the kidney model"""
    try:
        df = pd.read_csv('../data/kidney_data.csv', encoding='utf-8')
        
        feature_cols = ['Age', 'Sex', 'Serum_Creatinine', 'BUN', 'eGFR', 
                       'Sodium', 'Potassium', 'Calcium', 'Phosphorus']
        X = df[feature_cols].copy()
        
        # Encode Sex column
        X['Sex'] = X['Sex'].map({'M': 0, 'F': 1})
        
        y = df['Risk_Class']
        
        # Encode labels
        le = LabelEncoder()
        y_enc = le.fit_transform(y)
        
        # Apply SMOTE for balancing
        smote = SMOTE(random_state=42)
        X_res, y_res = smote.fit_resample(X, y_enc)
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_res, y_res)
        
        models['kidney'] = {
            'model': model,
            'features': feature_cols,
            'label_encoder': le
        }
        
        print("Kidney model loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading kidney model: {e}")
        return False

def load_liver_model():
    """Load and prepare the liver model"""
    try:
        df = pd.read_csv('../data/liver_data.csv', encoding='utf-8')
        
        feature_cols = ['Age', 'Sex', 'ALT', 'AST', 'ALP', 'GGT', 'Albumin', 
                       'Total_Protein', 'Total_Bilirubin', 'Direct_Bilirubin']
        X = df[feature_cols].copy()
        
        # Encode Sex column
        X['Sex'] = X['Sex'].map({'M': 0, 'F': 1})
        
        y = df['Risk_Class']
        
        # Encode labels
        le = LabelEncoder()
        y_enc = le.fit_transform(y)
        
        # Apply SMOTE for balancing
        smote = SMOTE(random_state=42)
        X_res, y_res = smote.fit_resample(X, y_enc)
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_res, y_res)
        
        models['liver'] = {
            'model': model,
            'features': feature_cols,
            'label_encoder': le
        }
        
        print("Liver model loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading liver model: {e}")
        return False

def load_thyroid_model():
    """Load and prepare the thyroid model"""
    try:
        df = pd.read_csv('../data/thyroid_data.csv', encoding='utf-8')
        
        feature_cols = ['TSH', 'Free_T4', 'Free_T3']
        X = df[feature_cols]
        y = df['Risk_Level']
        
        # Encode labels
        le = LabelEncoder()
        y_enc = le.fit_transform(y)
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y_enc)
        
        models['thyroid'] = {
            'model': model,
            'features': feature_cols,
            'label_encoder': le
        }
        
        print("Thyroid model loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading thyroid model: {e}")
        return False

def load_all_models():
    """Load all models"""
    print("Loading all models...")
    success = True
    
    success &= load_blood_model()
    success &= load_diabetes_model()
    success &= load_kidney_model()
    success &= load_liver_model()
    success &= load_thyroid_model()
    
    if success:
        print("All models loaded successfully!")
    else:
        print("Some models failed to load!")
    
    return success

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': list(models.keys())
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        data = request.json
        report_type = data.get('reportType')
        input_data = data.get('data', [])
        features = data.get('features', [])
        provided_features = data.get('providedFeatures', [])
        provided_data = data.get('providedData', [])
        
        if report_type not in models:
            return jsonify({'error': f'Unknown report type: {report_type}'}), 400
        
        model_info = models[report_type]
        model = model_info['model']
        expected_features = model_info['features']
        label_encoder = model_info['label_encoder']
        
        # Validate input data
        if len(input_data) != len(expected_features):
            return jsonify({
                'error': f'Expected {len(expected_features)} features, got {len(input_data)}'
            }), 400
        
        # Convert sex field from M/F to 0/1 for kidney reports
        if report_type in ['kidney', 'liver']:
            for i, feature in enumerate(expected_features):
                if feature == 'Sex' and i < len(input_data):
                    if input_data[i] == 'M' or input_data[i] == 'm':
                        input_data[i] = 0
                    elif input_data[i] == 'F' or input_data[i] == 'f':
                        input_data[i] = 1
                    else:
                        return jsonify({'error': 'Sex field must be M or F'}), 400
            
            # Also convert provided_data for parameter analysis
            if provided_features and provided_data:
                for i, feature in enumerate(provided_features):
                    if feature == 'Sex' and i < len(provided_data):
                        if provided_data[i] == 'M' or provided_data[i] == 'm':
                            provided_data[i] = 0
                        elif provided_data[i] == 'F' or provided_data[i] == 'f':
                            provided_data[i] = 1
        
        # Prepare input data
        input_array = np.array([input_data])
        
        # Make prediction
        prediction = model.predict(input_array)[0]
        probabilities = model.predict_proba(input_array)[0]
        
        # Get class labels if encoder exists
        if label_encoder:
            predicted_class = label_encoder.inverse_transform([prediction])[0]
            class_labels = label_encoder.classes_
        else:
            # Define correct class labels for each model
            class_labels_map = {
                'blood': ['Healthy', 'Unhealthy'],
                'kidney': ['Normal', 'Mid', 'High'],
                'liver': ['Normal', 'Mid', 'High'],
                'diabetes': ['Normal', 'Mid', 'High'],
                'thyroid': ['Low Risk', 'Mid Risk', 'High Risk']
            }
            class_labels = class_labels_map.get(report_type, ['Normal', 'Abnormal'])
            predicted_class = class_labels[prediction] if prediction < len(class_labels) else f'Class_{prediction}'
        
        # Get confidence score
        confidence = float(max(probabilities))
        
        # Prepare probabilities with labels
        prob_dict = {}
        for i, prob in enumerate(probabilities):
            if label_encoder:
                label = label_encoder.inverse_transform([i])[0]
            else:
                label = class_labels[i] if i < len(class_labels) else f'Class_{i}'
            prob_dict[label] = float(prob)
        
        # Analyze only the parameters that were actually provided by the user
        # This ensures we only show analysis for parameters the user actually entered
        parameter_analysis = []
        if provided_features and provided_data:
            # Use the provided features and data for analysis
            for feature_name, value in zip(provided_features, provided_data):
                analysis = analyze_parameter_value(feature_name, value, report_type)
                parameter_analysis.append({
                    'parameter': feature_name,
                    'value': float(value),
                    'analysis': analysis
                })
        else:
            for i, (feature_name, value) in enumerate(zip(expected_features, input_data)):
                if value != 0:
                    analysis = analyze_parameter_value(feature_name, value, report_type)
                    parameter_analysis.append({
                        'parameter': feature_name,
                        'value': float(value),
                        'analysis': analysis
                    })
        
        return jsonify({
            'class': int(prediction),
            'predicted_class': predicted_class,
            'confidence': confidence,
            'probabilities': prob_dict,
            'features_used': expected_features,
            'parameter_analysis': parameter_analysis
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get information about loaded models"""
    model_info = {}
    for name, info in models.items():
        model_info[name] = {
            'features': info['features'],
            'num_features': len(info['features'])
        }
    return jsonify(model_info)

# GARUN.ai Chat functionality
DEMO_RESPONSES = {
    "hello": "Hello! I'm GARUN.ai, your AI health assistant. I can help you with health questions, symptom analysis, and medical advice. How can I assist you today?",
    "hi": "Hi there! I'm GARUN.ai, your personal health companion. I'm here to help with your health concerns and questions. What would you like to know?",
    "symptoms": "I can help analyze symptoms and provide general health guidance. Please describe your symptoms in detail, and I'll do my best to help. Remember, this is for informational purposes only - always consult a healthcare professional for medical advice.",
    "health": "I'm designed to provide health information and medical advice. I can help with symptom analysis, general health questions, and wellness tips. What specific health topic would you like to discuss?",
    "diabetes": "Diabetes is a chronic condition that affects how your body processes blood sugar. There are two main types: Type 1 (autoimmune) and Type 2 (lifestyle-related). Key management includes monitoring blood sugar, maintaining a healthy diet, regular exercise, and medication as prescribed. Always work with your healthcare team for proper management.",
    "blood pressure": "Blood pressure is the force of blood against your artery walls. Normal blood pressure is typically around 120/80 mmHg. High blood pressure (hypertension) can lead to serious health problems like heart disease and stroke. Lifestyle changes like reducing salt, regular exercise, and maintaining a healthy weight can help manage it.",
    "fever": "A fever is a body temperature above 100.4°F (38°C). It's usually a sign that your body is fighting an infection. For adults, rest, stay hydrated, and use fever-reducing medication if needed. If fever persists for more than 3 days, is very high (over 103°F), or you have other concerning symptoms, consult a healthcare professional immediately.",
    "headache": "Headaches can have many causes including tension, migraines, dehydration, stress, or lack of sleep. For mild headaches, try rest, hydration, and over-the-counter pain relievers. If you have severe, sudden, or persistent headaches, especially with other symptoms like vision changes or neck stiffness, seek medical attention immediately.",
            "emergency": "If you're experiencing a medical emergency, call your local emergency number (112) immediately. Signs of emergency include severe chest pain, difficulty breathing, severe bleeding, loss of consciousness, or signs of stroke. For non-emergency concerns, I'm here to help with general health questions.",
    "fatty liver": "Fatty liver disease occurs when fat builds up in the liver. It can be caused by alcohol consumption or non-alcoholic factors (NAFLD). Management includes: maintaining a healthy weight, eating a balanced diet low in processed foods, regular exercise, avoiding alcohol, and controlling diabetes/cholesterol if present. Regular monitoring with your doctor is important.",
    "eat": "For general health, focus on a balanced diet with plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated with water, limit processed foods, and control portion sizes. For specific dietary needs related to medical conditions, it's best to consult with a registered dietitian or your healthcare provider.",
    "diet": "A healthy diet includes: colorful fruits and vegetables, whole grains, lean proteins (fish, poultry, beans), healthy fats (nuts, olive oil), and plenty of water. Limit added sugars, sodium, and processed foods. For personalized dietary advice, especially with medical conditions, consult a healthcare professional or registered dietitian.",
    "exercise": "Regular exercise is crucial for health. Aim for at least 150 minutes of moderate-intensity exercise per week, plus strength training twice a week. Start slowly if you're new to exercise, and always consult your doctor before beginning a new exercise program, especially if you have health conditions.",
    "sleep": "Good sleep is essential for health. Adults need 7-9 hours per night. Maintain a regular sleep schedule, create a comfortable sleep environment, avoid screens before bed, and limit caffeine and alcohol. If you have persistent sleep problems, consult a healthcare provider.",
    "stress": "Chronic stress can affect your health. Manage stress through regular exercise, relaxation techniques (meditation, deep breathing), adequate sleep, social connections, and time management. If stress is overwhelming or affecting your daily life, consider speaking with a mental health professional.",
    "default": "I'm GARUN.ai, your AI health assistant. I can help with health questions, symptom analysis, dietary advice, and general wellness tips. Please describe your health concern or question, and I'll do my best to provide helpful information. Remember, this is for educational purposes only - always consult healthcare professionals for medical advice."
}

@app.route('/api/chat', methods=['POST'])
def chat():
    """GARUN.ai chat endpoint"""
    try:
        data = request.json
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        print(f"User Input: {user_message}")

        # Demo mode responses
        user_lower = user_message.lower()
        
        # Check for keywords in the message
        response_text = DEMO_RESPONSES["default"]
        for keyword, response in DEMO_RESPONSES.items():
            if keyword in user_lower:
                response_text = response
                break
        
        return jsonify({
            "response": response_text,
            "ai_enabled": False,
            "status": "demo_mode"
        })

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            "error": "Sorry, I encountered an error processing your request.",
            "ai_enabled": False,
            "status": "error"
        }), 500

@app.route('/api/clear-history', methods=['POST'])
def clear_chat_history():
    """Clear chat history endpoint"""
    try:
        return jsonify({"status": "success", "message": "Chat history cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/nearby-hospitals', methods=['POST'])
def get_nearby_hospitals():
    """Get nearby hospitals using OpenStreetMap Overpass API"""
    try:
        data = request.json
        lat = data.get('latitude')
        lng = data.get('longitude')
        radius = data.get('radius', 10)  # radius in km
        
        if not lat or not lng:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Convert km to meters for Overpass API
        radius_meters = radius * 1000
        
        # Overpass API query to find hospitals with English names
        overpass_url = "http://overpass-api.de/api/interpreter"
        overpass_query = f"""
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:{radius_meters},{lat},{lng});
          way["amenity"="hospital"](around:{radius_meters},{lat},{lng});
          relation["amenity"="hospital"](around:{radius_meters},{lat},{lng});
        );
        out center tags;
        """
        
        import requests
        
        response = requests.get(overpass_url, params={'data': overpass_query})
        response.raise_for_status()
        
        data = response.json()
        hospitals = []
        
        for element in data.get('elements', []):
            if 'tags' in element:
                tags = element['tags']
                # Try to get English name first, then check for alternative names, fallback to default name
                hospital_name = (tags.get('name:en', '').strip() or 
                               tags.get('name', '').strip() or 
                               tags.get('alt_name', '').strip() or
                               tags.get('official_name', '').strip())
                
                # Skip hospitals without proper names or with generic names
                if not hospital_name or len(hospital_name) < 3 or hospital_name.lower() in [
                    '', 'unnamed', 'hospital', 'medical center', 'clinic', 'health center', 
                    'healthcare', 'medical', 'center', 'facility', 'building', 'unknown'
                ]:
                    continue
                
                # Filter out non-English names (basic check for common non-English characters)
                # This is a simple heuristic - you might want to adjust based on your needs
                non_english_chars = ['ñ', 'á', 'é', 'í', 'ó', 'ú', 'ü', 'ç', 'à', 'è', 'ì', 'ò', 'ù', 
                                   'â', 'ê', 'î', 'ô', 'û', 'ä', 'ë', 'ï', 'ö', 'ü', 'ÿ', 'ß', 'æ', 'œ',
                                   'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
                                   'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я',
                                   'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
                                   '中', '国', '医', '院', '大', '学', '附', '属', '第', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
                                   '病', '院', '医', '療', '中', '心', '診', '所', '保', '健', '所', '衛', '生', '院']
                
                # Check if name contains non-English characters
                if any(char in hospital_name.lower() for char in non_english_chars):
                    continue
                
                # Clean up the hospital name (remove extra spaces, standardize formatting)
                hospital_name = ' '.join(hospital_name.split())
                
                # Skip if name is too short after cleaning
                if len(hospital_name) < 3:
                    continue
                
                hospital = {
                    'id': element.get('id'),
                    'name': hospital_name,
                    'type': tags.get('amenity', 'hospital'),
                    'lat': element.get('lat') or element.get('center', {}).get('lat'),
                    'lng': element.get('lon') or element.get('center', {}).get('lon'),
                    'address': tags.get('addr:full') or f"{tags.get('addr:street', '')} {tags.get('addr:city', '')}".strip(),
                    'phone': tags.get('phone', ''),
                    'website': tags.get('website', ''),
                    'emergency': tags.get('emergency', 'no'),
                    'wheelchair': tags.get('wheelchair', 'unknown'),
                    'operator': tags.get('operator', ''),
                    'specialties': []
                }
                
                # Add specialties based on tags
                if tags.get('emergency') == 'yes':
                    hospital['specialties'].append('Emergency')
                if tags.get('healthcare:speciality'):
                    specialties = tags.get('healthcare:speciality', '').split(';')
                    hospital['specialties'].extend([s.strip() for s in specialties if s.strip()])
                
                # Calculate distance (simple approximation) and validate coordinates
                if hospital['lat'] and hospital['lng'] and hospital['lat'] != 0 and hospital['lng'] != 0:
                    import math
                    R = 6371  # Earth's radius in km
                    dlat = math.radians(hospital['lat'] - lat)
                    dlon = math.radians(hospital['lng'] - lng)
                    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat)) * math.cos(math.radians(hospital['lat'])) * math.sin(dlon/2) * math.sin(dlon/2)
                    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
                    hospital['distance'] = round(R * c, 2)
                    
                    # Only add hospitals within the specified radius
                    if hospital['distance'] <= radius:
                        hospitals.append(hospital)
        
        # Sort by distance
        hospitals.sort(key=lambda x: x.get('distance', float('inf')))
        
        return jsonify({
            'hospitals': hospitals,
            'count': len(hospitals),
            'search_center': {'lat': lat, 'lng': lng},
            'radius_km': radius
        })
        
    except Exception as e:
        print(f"Error fetching hospitals: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Load all models on startup
    if load_all_models():
        print("Starting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5000, load_dotenv=False)
    else:
        print("Failed to load models. Exiting...")
