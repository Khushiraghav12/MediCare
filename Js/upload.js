// Upload page JavaScript

let selectedReportType = null;
let reportData = {};

// Form field configurations for each report type (matching actual model features)
const formFields = {
    blood: [
        { name: 'WBC', label: 'White Blood Cells (thousand/μL)', type: 'number', step: '0.1', min: '0', max: '50' },
        { name: 'LYMp', label: 'Lymphocytes %', type: 'number', step: '0.1', min: '0', max: '100' },
        { name: 'MIDp', label: 'Mid %', type: 'number', step: '0.1', min: '0', max: '100' },
        { name: 'NEUTp', label: 'Neutrophils %', type: 'number', step: '0.1', min: '0', max: '100' },
        { name: 'LYMn', label: 'Lymphocytes Count', type: 'number', step: '0.1', min: '0', max: '20' },
        { name: 'MIDn', label: 'Mid Count', type: 'number', step: '0.1', min: '0', max: '5' },
        { name: 'NEUTn', label: 'Neutrophils Count', type: 'number', step: '0.1', min: '0', max: '20' },
        { name: 'RBC', label: 'Red Blood Cells (million/μL)', type: 'number', step: '0.1', min: '0', max: '10' },
        { name: 'HGB', label: 'Hemoglobin (g/dL)', type: 'number', step: '0.1', min: '0', max: '20' },
        { name: 'HCT', label: 'Hematocrit (%)', type: 'number', step: '0.1', min: '0', max: '60' },
        { name: 'MCV', label: 'Mean Cell Volume (fL)', type: 'number', step: '0.1', min: '50', max: '120' },
        { name: 'MCH', label: 'Mean Cell Hemoglobin (pg)', type: 'number', step: '0.1', min: '15', max: '40' },
        { name: 'MCHC', label: 'Mean Cell Hemoglobin Concentration (g/dL)', type: 'number', step: '0.1', min: '20', max: '40' },
        { name: 'RDWSD', label: 'RDW Standard Deviation', type: 'number', step: '0.1', min: '0', max: '100' },
        { name: 'RDWCV', label: 'RDW Coefficient of Variation (%)', type: 'number', step: '0.1', min: '0', max: '30' },
        { name: 'PLT', label: 'Platelets (thousand/μL)', type: 'number', step: '1', min: '0', max: '1000' },
        { name: 'MPV', label: 'Mean Platelet Volume (fL)', type: 'number', step: '0.1', min: '5', max: '20' },
        { name: 'PDW', label: 'Platelet Distribution Width', type: 'number', step: '0.1', min: '5', max: '25' },
        { name: 'PCT', label: 'Plateletcrit (%)', type: 'number', step: '0.01', min: '0', max: '1' },
        { name: 'PLCR', label: 'Platelet Large Cell Ratio (%)', type: 'number', step: '0.1', min: '0', max: '50' },
        { name: 'Cholesterol', label: 'Cholesterol (mg/dL)', type: 'number', step: '1', min: '0', max: '500' }
    ],
    kidney: [
        { name: 'Age', label: 'Age (years)', type: 'number', step: '1', min: '0', max: '120' },
        { name: 'Sex', label: 'Sex', type: 'select', options: ['M', 'F'] },
        { name: 'Serum_Creatinine', label: 'Serum Creatinine (mg/dL)', type: 'number', step: '0.01', min: '0', max: '10' },
        { name: 'BUN', label: 'Blood Urea Nitrogen (mg/dL)', type: 'number', step: '1', min: '0', max: '100' },
        { name: 'eGFR', label: 'eGFR (mL/min/1.73m²)', type: 'number', step: '1', min: '0', max: '200' },
        { name: 'Sodium', label: 'Sodium (mEq/L)', type: 'number', step: '1', min: '120', max: '160' },
        { name: 'Potassium', label: 'Potassium (mEq/L)', type: 'number', step: '0.1', min: '2', max: '8' },
        { name: 'Calcium', label: 'Calcium (mg/dL)', type: 'number', step: '0.1', min: '6', max: '12' },
        { name: 'Phosphorus', label: 'Phosphorus (mg/dL)', type: 'number', step: '0.1', min: '1', max: '8' }
    ],
    liver: [
        { name: 'Age', label: 'Age (years)', type: 'number', step: '1', min: '0', max: '120' },
        { name: 'Sex', label: 'Sex', type: 'select', options: ['M', 'F'] },
        { name: 'ALT', label: 'ALT (U/L)', type: 'number', step: '1', min: '0', max: '500' },
        { name: 'AST', label: 'AST (U/L)', type: 'number', step: '1', min: '0', max: '500' },
        { name: 'ALP', label: 'Alkaline Phosphatase (U/L)', type: 'number', step: '1', min: '0', max: '1000' },
        { name: 'GGT', label: 'GGT (U/L)', type: 'number', step: '1', min: '0', max: '500' },
        { name: 'Albumin', label: 'Albumin (g/dL)', type: 'number', step: '0.1', min: '0', max: '10' },
        { name: 'Total_Protein', label: 'Total Protein (g/dL)', type: 'number', step: '0.1', min: '0', max: '15' },
        { name: 'Total_Bilirubin', label: 'Total Bilirubin (mg/dL)', type: 'number', step: '0.1', min: '0', max: '20' },
        { name: 'Direct_Bilirubin', label: 'Direct Bilirubin (mg/dL)', type: 'number', step: '0.1', min: '0', max: '10' }
    ],
    diabetes: [
        { name: 'Fasting_Blood_Glucose', label: 'Fasting Blood Glucose (mg/dL)', type: 'number', step: '1', min: '0', max: '500' },
        { name: 'Postprandial_Glucose', label: 'Postprandial Glucose (mg/dL)', type: 'number', step: '1', min: '0', max: '500' },
        { name: 'OGTT_2hr', label: 'OGTT 2-hour (mg/dL)', type: 'number', step: '1', min: '0', max: '500' },
        { name: 'HbA1c', label: 'HbA1c (%)', type: 'number', step: '0.1', min: '0', max: '20' },
        { name: 'Insulin_Fasting', label: 'Fasting Insulin (μU/mL)', type: 'number', step: '0.1', min: '0', max: '100' },
        { name: 'Insulin_2hr', label: '2-hour Insulin (μU/mL)', type: 'number', step: '0.1', min: '0', max: '200' },
        { name: 'C_Peptide', label: 'C-Peptide (ng/mL)', type: 'number', step: '0.1', min: '0', max: '10' }
    ],
    thyroid: [
        { name: 'TSH', label: 'TSH (mIU/L)', type: 'number', step: '0.01', min: '0', max: '100' },
        { name: 'Free_T4', label: 'Free T4 (ng/dL)', type: 'number', step: '0.1', min: '0', max: '10' },
        { name: 'Free_T3', label: 'Free T3 (pg/mL)', type: 'number', step: '0.1', min: '0', max: '20' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Page initialized - event listeners are handled by onclick attributes in HTML
});

function generateFormFields(reportType) {
    const formGrid = document.getElementById('formGrid');
    const fields = formFields[reportType];
    
    if (!fields) return;
    
    // Clear existing fields
    formGrid.innerHTML = '';
    
    // Initialize report data if not exists
    if (!reportData[reportType]) {
        reportData[reportType] = {};
        fields.forEach(field => {
            reportData[reportType][field.name] = '';
        });
    }
    
    // Generate form fields
    fields.forEach(field => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'form-field';
        
        let inputHTML = '';
        if (field.type === 'select') {
            inputHTML = `
                <label for="${field.name}" class="form-label">${field.label}</label>
                <select id="${field.name}" name="${field.name}" class="form-input">
                    <option value="">Select ${field.label.split(' (')[0]}</option>
                    ${field.options.map(option => 
                        `<option value="${option}" ${reportData[reportType][field.name] === option ? 'selected' : ''}>${option}</option>`
                    ).join('')}
                </select>
            `;
        } else {
            inputHTML = `
            <label for="${field.name}" class="form-label">${field.label}</label>
            <input 
                type="${field.type}" 
                id="${field.name}" 
                name="${field.name}"
                step="${field.step}"
                min="${field.min}"
                max="${field.max}"
                value="${reportData[reportType][field.name] || ''}"
                class="form-input"
                placeholder="Enter ${field.label.split(' (')[0].toLowerCase()}"
            />
        `;
        }
        
        fieldDiv.innerHTML = inputHTML;
        formGrid.appendChild(fieldDiv);
        
        // Add input event listener
        const input = fieldDiv.querySelector('input, select');
        input.addEventListener('input', function() {
            reportData[reportType][field.name] = this.value;
            updateReportCardStatus(reportType);
        });
    });
}

function handleInputChange(reportType, fieldName, value) {
    if (!reportData[reportType]) {
        reportData[reportType] = {};
    }
    reportData[reportType][fieldName] = value;
    updateReportCardStatus(reportType);
}

function updateReportCardStatus(type) {
    const reportCards = document.querySelectorAll('.report-card');
    reportCards.forEach(card => {
        if (card.dataset.type === type) {
            const hasData = reportData[type] && Object.values(reportData[type]).some(value => value !== '');
            if (hasData) {
                card.classList.add('uploaded');
            } else {
                card.classList.remove('uploaded');
            }
        }
    });
}

async function analyzeReports() {
    const reportsWithData = Object.entries(reportData).filter(([type, data]) => 
        Object.values(data).some(value => value !== '')
    );
    
    if (reportsWithData.length === 0) {
        alert('Please enter data for at least one report to analyze');
        return;
    }
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalText = analyzeBtn.innerHTML;
    
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    analyzeBtn.disabled = true;
    
    try {
        // Check if model integration is available
        if (typeof window.analyzeReportsWithML === 'function') {
            // Use ML models for analysis
            const results = await window.analyzeReportsWithML(reportData);
            displayAnalysisResults(results);
            alert('Analysis completed with ML models!');
        } else {
            // Fallback to simulation
    setTimeout(() => {
                alert('Analysis completed! ML models not yet integrated.');
                analyzeBtn.innerHTML = originalText;
                analyzeBtn.disabled = false;
            }, 3000);
        }
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Analysis failed. Please try again.');
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
    }
}

function displayAnalysisResults(results) {
    const analyzeBtn2 = document.getElementById('analyzeBtn');
    const originalText2 = analyzeBtn2.innerHTML;
        
        analyzeBtn2.innerHTML = originalText2;
        analyzeBtn2.disabled = false;
        
    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    
    // Clear previous results
    resultsContent.innerHTML = '';
    
    // Display results
    if (results.results && Object.keys(results.results).length > 0) {
        let resultsHTML = '<div class="results-summary">';
        
        // Add summary
        resultsHTML += `
            <div class="summary-card">
                <h3><i class="fas fa-clipboard-check"></i> Analysis Summary</h3>
                <p>Successfully analyzed ${Object.keys(results.results).length} report(s)</p>
            </div>
        `;
        
        // Display each report result
        Object.entries(results.results).forEach(([reportType, result]) => {
            const reportNames = {
                blood: 'Blood Report',
                kidney: 'Kidney Report', 
                liver: 'Liver Report',
                diabetes: 'Diabetes Report',
                thyroid: 'Thyroid Report'
            };
            
            const reportName = reportNames[reportType] || reportType;
            const prediction = result.prediction;
            const interpretation = result.interpretation;
            const recommendations = result.recommendations;
            const normalRanges = result.normalRanges;
            
            // Get detailed explanations
            const explanations = generateDetailedExplanations(reportType, reportData[reportType], interpretation);
            
            // Get risk level from model prediction
            const riskLevel = prediction.predicted_class || interpretation.diagnosis;
            
            resultsHTML += `
                <div class="report-result">
                    <div class="report-result-header">
                        <h4><i class="fas fa-file-medical"></i> ${reportName}</h4>
                    </div>
                    
                    <div class="result-details">
                        <div class="diagnosis-section">
                            <h5><i class="fas fa-stethoscope"></i> Risk Assessment</h5>
                            <div class="risk-horizontal-box ${getRiskColorClass(riskLevel)}">
                                <span class="risk-label">Risk Level:</span>
                                <span class="risk-value">${riskLevel}</span>
                            </div>
                            <p class="diagnosis-description">${interpretation.description}</p>
                        </div>
                        
                        <div class="explanations-section">
                            <h5><i class="fas fa-microscope"></i> Detailed Analysis</h5>
                            <div class="explanations-content" id="explanations-${reportType}">
                                ${explanations}
                            </div>
                            <div class="explanation-navigation">
                                <button class="nav-btn prev-btn" onclick="previousExplanation('${reportType}')" disabled>
                                    <i class="fas fa-chevron-left"></i> Previous
                                </button>
                                <span class="explanation-counter">
                                    <span class="current-page">1</span> / <span class="total-pages">1</span>
                                </span>
                                <button class="nav-btn next-btn" onclick="nextExplanation('${reportType}')">
                                    Next <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Add errors if any
        if (results.errors && Object.keys(results.errors).length > 0) {
            resultsHTML += `
                <div class="errors-section">
                    <h5><i class="fas fa-exclamation-triangle"></i> Errors</h5>
                    <div class="error-list">
                        ${Object.entries(results.errors).map(([reportType, error]) => 
                            `<div class="error-item">
                                <span class="error-report">${reportType}</span>
                                <span class="error-message">${error}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        resultsHTML += '</div>';
        resultsContent.innerHTML = resultsHTML;
        
        // Setup pagination for each report type
        Object.keys(results.results).forEach(reportType => {
            setupExplanationPagination(reportType, '');
        });
        
    } else {
        resultsContent.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <h3>No Results Available</h3>
                <p>Please enter data for at least one report and try again.</p>
            </div>
        `;
    }
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Disable analyze button after analysis
    const analyzeBtn3 = document.getElementById('analyzeBtn');
    if (analyzeBtn3) {
        analyzeBtn3.disabled = true;
        analyzeBtn3.innerHTML = '<i class="fas fa-check"></i> Analysis Complete';
        analyzeBtn3.style.background = '#95a5a6';
        analyzeBtn3.style.cursor = 'not-allowed';
    }
}

function generateDetailedExplanations(reportType, formData, interpretation) {
    let explanations = '<div class="explanation-list">';
    
    switch(reportType) {
        case 'thyroid':
            explanations += generateThyroidExplanations(formData, interpretation);
            break;
        case 'blood':
            explanations += generateBloodExplanations(formData, interpretation);
            break;
        case 'kidney':
            explanations += generateKidneyExplanations(formData, interpretation);
            break;
        case 'liver':
            explanations += generateLiverExplanations(formData, interpretation);
            break;
        case 'diabetes':
            explanations += generateDiabetesExplanations(formData, interpretation);
            break;
        default:
            explanations += '<p>Detailed analysis not available for this report type.</p>';
    }
    
    explanations += '</div>';
    return explanations;
}

function generateThyroidExplanations(formData, interpretation) {
    const tsh = parseFloat(formData.TSH) || 0;
    const freeT4 = parseFloat(formData.Free_T4) || 0;
    const freeT3 = parseFloat(formData.Free_T3) || 0;
    
    let explanations = '';
    
    // TSH Analysis
    const tshStatus = tsh < 0.4 ? 'LOW' : (tsh > 4.0 ? 'HIGH' : 'NORMAL');
    const tshColor = tshStatus === 'NORMAL' ? 'green' : (tshStatus === 'LOW' ? 'blue' : 'red');
    const tshRisk = tshStatus === 'NORMAL' ? 'low' : (tshStatus === 'LOW' ? 'mid' : 'high');
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">TSH</span>
                <span class="param-value">${tsh} mIU/L</span>
                <span class="param-status ${tshColor}">${tshStatus}</span>
            </div>
            <div class="param-explanation">
                TSH is ${tsh} mIU/L, which is <strong>${tshStatus}</strong> (Normal: 0.4–4.0). 
                ${tshStatus === 'NORMAL' ? 
                    'This suggests that the pituitary-thyroid axis is balanced. Normal TSH usually rules out major thyroid dysfunction. However, rare cases exist where TSH is normal but T4/T3 abnormalities are present. In general, a normal TSH is considered low-risk. This is the most common finding in healthy individuals.' :
                    tshStatus === 'LOW' ?
                    'Low TSH typically indicates hyperthyroidism or overactive thyroid. This can cause symptoms like rapid heartbeat, weight loss, and anxiety. Low TSH with normal T4/T3 may indicate subclinical hyperthyroidism, which requires monitoring.' :
                    'High TSH typically indicates hypothyroidism or underactive thyroid. This can cause symptoms like fatigue, weight gain, and depression. High TSH with low T4/T3 confirms hypothyroidism requiring treatment.'
                }
            </div>
        </div>
    `;
    
    // Free T4 Analysis
    const t4Status = freeT4 < 0.8 ? 'LOW' : (freeT4 > 1.8 ? 'HIGH' : 'NORMAL');
    const t4Color = t4Status === 'NORMAL' ? 'green' : (t4Status === 'LOW' ? 'red' : 'red');
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Free T4</span>
                <span class="param-value">${freeT4} ng/dL</span>
                <span class="param-status ${t4Color}">${t4Status}</span>
            </div>
            <div class="param-explanation">
                Free T4 is ${freeT4} ng/dL, which is <strong>${t4Status}</strong> (Normal: 0.8–1.8). 
                ${t4Status === 'NORMAL' ? 
                    'This indicates normal thyroxine levels in circulation. When paired with normal TSH, this confirms euthyroid (healthy) state. Normal T4 suggests low risk of thyroid disease. Still, isolated T3 abnormalities can occasionally occur. Hence, a normal T4 should always be considered along with TSH and T3.' :
                    t4Status === 'LOW' ?
                    'Low Free T4 indicates hypothyroidism or reduced thyroid function. When combined with high TSH, this confirms primary hypothyroidism. Symptoms may include fatigue, weight gain, cold intolerance, and depression. Treatment with thyroid hormone replacement is typically required.' :
                    'High Free T4 indicates hyperthyroidism or overactive thyroid. When combined with low TSH, this confirms primary hyperthyroidism. Symptoms may include rapid heartbeat, weight loss, anxiety, and tremors. Treatment may include antithyroid medications or other interventions.'
                }
            </div>
        </div>
    `;
    
    // Free T3 Analysis
    const t3Status = freeT3 < 2.3 ? 'LOW' : (freeT3 > 4.2 ? 'HIGH' : 'NORMAL');
    const t3Color = t3Status === 'NORMAL' ? 'green' : (t3Status === 'LOW' ? 'red' : 'red');
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Free T3</span>
                <span class="param-value">${freeT3} pg/mL</span>
                <span class="param-status ${t3Color}">${t3Status}</span>
            </div>
            <div class="param-explanation">
                Free T3 is ${freeT3} pg/mL, which is <strong>${t3Status}</strong> (Normal: 2.3–4.2). 
                ${t3Status === 'NORMAL' ? 
                    'This indicates normal triiodothyronine levels, the most active thyroid hormone. Normal T3 with normal TSH and T4 confirms euthyroid state. T3 is the most metabolically active thyroid hormone and normal levels indicate proper thyroid function.' :
                    t3Status === 'LOW' ?
                    'Low Free T3 can occur in hypothyroidism or during illness (sick euthyroid syndrome). It indicates reduced availability of active thyroid hormone. Symptoms may include low energy, constipation, and weight gain. When accompanied by low T4 and high TSH, it strongly indicates hypothyroidism. Mild isolated low T3 is mid-risk, while combined with other abnormalities it is high-risk.' :
                    'High Free T3 indicates hyperthyroidism or overactive thyroid. This is the most active thyroid hormone and high levels can cause significant symptoms including rapid heartbeat, weight loss, anxiety, and tremors. When combined with low TSH and high T4, it confirms primary hyperthyroidism.'
                }
            </div>
        </div>
    `;
    
    return explanations;
}

function generateBloodExplanations(formData, interpretation) {
    let explanations = '';
    
    // Extract all blood parameters
    const wbc = parseFloat(formData.WBC) || 0;
    const lymp = parseFloat(formData.LYMp) || 0;
    const midp = parseFloat(formData.MIDp) || 0;
    const neutp = parseFloat(formData.NEUTp) || 0;
    const lymn = parseFloat(formData.LYMn) || 0;
    const midn = parseFloat(formData.MIDn) || 0;
    const neutn = parseFloat(formData.NEUTn) || 0;
    const rbc = parseFloat(formData.RBC) || 0;
    const hgb = parseFloat(formData.HGB) || 0;
    const hct = parseFloat(formData.HCT) || 0;
    const mcv = parseFloat(formData.MCV) || 0;
    const mch = parseFloat(formData.MCH) || 0;
    const mchc = parseFloat(formData.MCHC) || 0;
    const rdwsd = parseFloat(formData.RDWSD) || 0;
    const rdwcv = parseFloat(formData.RDWCV) || 0;
    const plt = parseFloat(formData.PLT) || 0;
    const mpv = parseFloat(formData.MPV) || 0;
    const pdw = parseFloat(formData.PDW) || 0;
    const pct = parseFloat(formData.PCT) || 0;
    const plcr = parseFloat(formData.PLCR) || 0;
    const cholesterol = parseFloat(formData.Cholesterol) || 0;
    
    // WBC Analysis
    const wbcStatus = wbc < 4.5 ? 'LOW' : (wbc > 11.0 ? 'HIGH' : 'NORMAL');
    const wbcColor = wbcStatus === 'NORMAL' ? 'green' : (wbcStatus === 'LOW' ? 'red' : 'red');
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">White Blood Cells</span>
                <span class="param-value">${wbc} thousand/μL</span>
                <span class="param-status ${wbcColor}">${wbcStatus}</span>
            </div>
            <div class="param-explanation">
                WBC count is ${wbc} thousand/μL, which is <strong>${wbcStatus}</strong> (Normal: 4.5–11.0). 
                ${wbcStatus === 'NORMAL' ? 
                    'This indicates normal immune system function. WBCs are crucial for fighting infections and maintaining immune health. Normal WBC count suggests low risk of infection or immune disorders.' :
                    wbcStatus === 'LOW' ?
                    'Low WBC count (leukopenia) can indicate bone marrow suppression, certain medications, or immune system disorders. This increases infection risk and may require medical evaluation.' :
                    'High WBC count (leukocytosis) often indicates infection, inflammation, or stress response. It can also occur in certain blood disorders and requires further investigation.'
                }
            </div>
        </div>
    `;
    
    // Hemoglobin Analysis
    const hgbStatus = hgb < 12 ? 'LOW' : (hgb > 16 ? 'HIGH' : 'NORMAL');
    const hgbColor = hgbStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Hemoglobin</span>
                <span class="param-value">${hgb} g/dL</span>
                <span class="param-status ${hgbColor}">${hgbStatus}</span>
            </div>
            <div class="param-explanation">
                Hemoglobin is ${hgb} g/dL, which is <strong>${hgbStatus}</strong> (Normal: 12–16 g/dL). 
                ${hgbStatus === 'NORMAL' ? 
                    'This indicates normal oxygen-carrying capacity of blood. Hemoglobin is essential for oxygen transport throughout the body.' :
                    hgbStatus === 'LOW' ?
                    'Low hemoglobin indicates anemia, which can cause fatigue, weakness, and shortness of breath. Treatment depends on the underlying cause.' :
                    'High hemoglobin can indicate dehydration, polycythemia, or chronic lung disease. It may increase blood viscosity and clotting risk.'
                }
            </div>
        </div>
    `;
    
    // Lymphocytes Percentage
    const lympStatus = lymp < 20 ? 'LOW' : (lymp > 40 ? 'HIGH' : 'NORMAL');
    const lympColor = lympStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Lymphocytes %</span>
                <span class="param-value">${lymp}%</span>
                <span class="param-status ${lympColor}">${lympStatus}</span>
            </div>
            <div class="param-explanation">
                Lymphocytes percentage is ${lymp}%, which is <strong>${lympStatus}</strong> (Normal: 20–40%). 
                ${lympStatus === 'NORMAL' ? 
                    'This indicates normal lymphocyte function. Lymphocytes are key immune cells that fight viral infections and produce antibodies.' :
                    lympStatus === 'LOW' ?
                    'Low lymphocyte count may indicate immune suppression, viral infections, or certain medications. This can increase susceptibility to infections.' :
                    'High lymphocyte count often indicates viral infections, chronic inflammatory conditions, or certain blood disorders.'
                }
            </div>
        </div>
    `;
    
    // Neutrophils Percentage
    const neutpStatus = neutp < 40 ? 'LOW' : (neutp > 70 ? 'HIGH' : 'NORMAL');
    const neutpColor = neutpStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Neutrophils %</span>
                <span class="param-value">${neutp}%</span>
                <span class="param-status ${neutpColor}">${neutpStatus}</span>
            </div>
            <div class="param-explanation">
                Neutrophils percentage is ${neutp}%, which is <strong>${neutpStatus}</strong> (Normal: 40–70%). 
                ${neutpStatus === 'NORMAL' ? 
                    'This indicates normal neutrophil function. Neutrophils are the first responders to bacterial infections.' :
                    neutpStatus === 'LOW' ?
                    'Low neutrophil count (neutropenia) increases infection risk, especially bacterial infections.' :
                    'High neutrophil count often indicates bacterial infections, stress, or inflammatory conditions.'
                }
            </div>
        </div>
    `;
    
    // Mid Percentage
    const midpStatus = midp < 1 ? 'LOW' : (midp > 5 ? 'HIGH' : 'NORMAL');
    const midpColor = midpStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Mid %</span>
                <span class="param-value">${midp}%</span>
                <span class="param-status ${midpColor}">${midpStatus}</span>
            </div>
            <div class="param-explanation">
                Mid percentage is ${midp}%, which is <strong>${midpStatus}</strong> (Normal: 1–5%). 
                ${midpStatus === 'NORMAL' ? 
                    'This indicates normal mid-cell count. Mid cells include monocytes, eosinophils, and basophils.' :
                    midpStatus === 'LOW' ?
                    'Low mid-cell count may indicate bone marrow suppression or certain medications.' :
                    'High mid-cell count may indicate infections, allergies, or inflammatory conditions.'
                }
            </div>
        </div>
    `;
    
    // Lymphocytes Count
    const lymnStatus = lymn < 1.0 ? 'LOW' : (lymn > 4.0 ? 'HIGH' : 'NORMAL');
    const lymnColor = lymnStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Lymphocytes Count</span>
                <span class="param-value">${lymn} thousand/μL</span>
                <span class="param-status ${lymnColor}">${lymnStatus}</span>
            </div>
            <div class="param-explanation">
                Lymphocytes count is ${lymn} thousand/μL, which is <strong>${lymnStatus}</strong> (Normal: 1.0–4.0). 
                ${lymnStatus === 'NORMAL' ? 
                    'This indicates adequate lymphocyte numbers for immune function. Absolute lymphocyte count is important for assessing immune capacity.' :
                    lymnStatus === 'LOW' ?
                    'Low absolute lymphocyte count increases infection risk, particularly viral infections.' :
                    'High absolute lymphocyte count may indicate viral infections, chronic inflammatory conditions, or certain blood disorders.'
                }
            </div>
        </div>
    `;
    
    // Mid Count
    const midnStatus = midn < 0.1 ? 'LOW' : (midn > 0.8 ? 'HIGH' : 'NORMAL');
    const midnColor = midnStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Mid Count</span>
                <span class="param-value">${midn} thousand/μL</span>
                <span class="param-status ${midnColor}">${midnStatus}</span>
            </div>
            <div class="param-explanation">
                Mid count is ${midn} thousand/μL, which is <strong>${midnStatus}</strong> (Normal: 0.1–0.8). 
                ${midnStatus === 'NORMAL' ? 
                    'This indicates normal mid-cell absolute count. These cells play important roles in immune defense and allergic responses.' :
                    midnStatus === 'LOW' ?
                    'Low mid-cell count may indicate bone marrow suppression or immune dysfunction.' :
                    'High mid-cell count may indicate infections, allergies, or inflammatory conditions.'
                }
            </div>
        </div>
    `;
    
    // Neutrophils Count
    const neutnStatus = neutn < 1.8 ? 'LOW' : (neutn > 7.7 ? 'HIGH' : 'NORMAL');
    const neutnColor = neutnStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Neutrophils Count</span>
                <span class="param-value">${neutn} thousand/μL</span>
                <span class="param-status ${neutnColor}">${neutnStatus}</span>
            </div>
            <div class="param-explanation">
                Neutrophils count is ${neutn} thousand/μL, which is <strong>${neutnStatus}</strong> (Normal: 1.8–7.7). 
                ${neutnStatus === 'NORMAL' ? 
                    'This indicates adequate neutrophil numbers for bacterial defense. Absolute neutrophil count is crucial for infection resistance.' :
                    neutnStatus === 'LOW' ?
                    'Low absolute neutrophil count significantly increases bacterial infection risk. This requires immediate medical attention.' :
                    'High absolute neutrophil count often indicates active bacterial infection or inflammatory response.'
                }
            </div>
        </div>
    `;
    
    // Red Blood Cells
    const rbcStatus = rbc < 4.0 ? 'LOW' : (rbc > 5.5 ? 'HIGH' : 'NORMAL');
    const rbcColor = rbcStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Red Blood Cells</span>
                <span class="param-value">${rbc} million/μL</span>
                <span class="param-status ${rbcColor}">${rbcStatus}</span>
            </div>
            <div class="param-explanation">
                RBC count is ${rbc} million/μL, which is <strong>${rbcStatus}</strong> (Normal: 4.0–5.5). 
                ${rbcStatus === 'NORMAL' ? 
                    'This indicates normal red blood cell production and oxygen transport capacity.' :
                    rbcStatus === 'LOW' ?
                    'Low RBC count indicates anemia, which can cause fatigue, weakness, and shortness of breath.' :
                    'High RBC count may indicate dehydration, polycythemia, or chronic lung disease.'
                }
            </div>
        </div>
    `;
    
    // Platelets
    const pltStatus = plt < 150 ? 'LOW' : (plt > 450 ? 'HIGH' : 'NORMAL');
    const pltColor = pltStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Platelets</span>
                <span class="param-value">${plt} thousand/μL</span>
                <span class="param-status ${pltColor}">${pltStatus}</span>
            </div>
            <div class="param-explanation">
                Platelet count is ${plt} thousand/μL, which is <strong>${pltStatus}</strong> (Normal: 150–450). 
                ${pltStatus === 'NORMAL' ? 
                    'This indicates normal platelet function for blood clotting. Platelets are essential for hemostasis and wound healing.' :
                    pltStatus === 'LOW' ?
                    'Low platelet count (thrombocytopenia) increases bleeding risk.' :
                    'High platelet count (thrombocytosis) may indicate inflammation, iron deficiency, or blood disorders.'
                }
            </div>
        </div>
    `;
    
    // Hematocrit
    const hctStatus = hct < 36 ? 'LOW' : (hct > 46 ? 'HIGH' : 'NORMAL');
    const hctColor = hctStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Hematocrit</span>
                <span class="param-value">${hct}%</span>
                <span class="param-status ${hctColor}">${hctStatus}</span>
            </div>
            <div class="param-explanation">
                Hematocrit is ${hct}%, which is <strong>${hctStatus}</strong> (Normal: 36–46%). 
                ${hctStatus === 'NORMAL' ? 
                    'This indicates normal blood volume occupied by red blood cells. Hematocrit reflects the oxygen-carrying capacity of blood.' :
                    hctStatus === 'LOW' ?
                    'Low hematocrit indicates anemia or blood loss. This reduces oxygen delivery to tissues and can cause fatigue and weakness.' :
                    'High hematocrit may indicate dehydration, polycythemia, or chronic lung disease. This can increase blood viscosity and clotting risk.'
                }
            </div>
        </div>
    `;
    
    // Mean Cell Volume
    const mcvStatus = mcv < 80 ? 'LOW' : (mcv > 100 ? 'HIGH' : 'NORMAL');
    const mcvColor = mcvStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Mean Cell Volume</span>
                <span class="param-value">${mcv} fL</span>
                <span class="param-status ${mcvColor}">${mcvStatus}</span>
            </div>
            <div class="param-explanation">
                MCV is ${mcv} fL, which is <strong>${mcvStatus}</strong> (Normal: 80–100 fL). 
                ${mcvStatus === 'NORMAL' ? 
                    'This indicates normal red blood cell size. MCV helps classify anemia types and assess red blood cell health.' :
                    mcvStatus === 'LOW' ?
                    'Low MCV indicates microcytic anemia, often caused by iron deficiency or thalassemia. This affects oxygen-carrying capacity.' :
                    'High MCV indicates macrocytic anemia, often caused by vitamin B12 or folate deficiency. This can affect red blood cell function.'
                }
            </div>
        </div>
    `;
    
    // Mean Cell Hemoglobin
    const mchStatus = mch < 27 ? 'LOW' : (mch > 33 ? 'HIGH' : 'NORMAL');
    const mchColor = mchStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Mean Cell Hemoglobin</span>
                <span class="param-value">${mch} pg</span>
                <span class="param-status ${mchColor}">${mchStatus}</span>
            </div>
            <div class="param-explanation">
                MCH is ${mch} pg, which is <strong>${mchStatus}</strong> (Normal: 27–33 pg). 
                ${mchStatus === 'NORMAL' ? 
                    'This indicates normal hemoglobin content per red blood cell. MCH helps assess red blood cell quality and oxygen-carrying efficiency.' :
                    mchStatus === 'LOW' ?
                    'Low MCH indicates hypochromic anemia, often caused by iron deficiency. This reduces oxygen-carrying capacity per cell.' :
                    'High MCH may indicate macrocytic anemia or certain blood disorders. This can affect red blood cell function.'
                }
            </div>
        </div>
    `;
    
    // Mean Cell Hemoglobin Concentration
    const mchcStatus = mchc < 32 ? 'LOW' : (mchc > 36 ? 'HIGH' : 'NORMAL');
    const mchcColor = mchcStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Mean Cell Hemoglobin Concentration</span>
                <span class="param-value">${mchc} g/dL</span>
                <span class="param-status ${mchcColor}">${mchcStatus}</span>
            </div>
            <div class="param-explanation">
                MCHC is ${mchc} g/dL, which is <strong>${mchcStatus}</strong> (Normal: 32–36 g/dL). 
                ${mchcStatus === 'NORMAL' ? 
                    'This indicates normal hemoglobin concentration in red blood cells. MCHC helps assess red blood cell quality and iron status.' :
                    mchcStatus === 'LOW' ?
                    'Low MCHC indicates hypochromic anemia, typically caused by iron deficiency. This reduces oxygen-carrying efficiency.' :
                    'High MCHC may indicate spherocytosis or dehydration. This can affect red blood cell stability and function.'
                }
            </div>
        </div>
    `;
    
    // RDW Standard Deviation
    const rdwsdStatus = rdwsd < 11.5 ? 'LOW' : (rdwsd > 14.5 ? 'HIGH' : 'NORMAL');
    const rdwsdColor = rdwsdStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">RDW Standard Deviation</span>
                <span class="param-value">${rdwsd} fL</span>
                <span class="param-status ${rdwsdColor}">${rdwsdStatus}</span>
            </div>
            <div class="param-explanation">
                RDW-SD is ${rdwsd} fL, which is <strong>${rdwsdStatus}</strong> (Normal: 11.5–14.5 fL). 
                ${rdwsdStatus === 'NORMAL' ? 
                    'This indicates normal variation in red blood cell size. RDW-SD helps assess red blood cell uniformity and quality.' :
                    rdwsdStatus === 'LOW' ?
                    'Low RDW-SD indicates very uniform red blood cell size, which may be normal or indicate certain blood disorders.' :
                    'High RDW-SD indicates increased variation in red blood cell size, often seen in iron deficiency anemia or mixed anemias.'
                }
            </div>
        </div>
    `;
    
    // RDW Coefficient of Variation
    const rdwcvStatus = rdwcv < 11.5 ? 'LOW' : (rdwcv > 14.5 ? 'HIGH' : 'NORMAL');
    const rdwcvColor = rdwcvStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">RDW Coefficient of Variation</span>
                <span class="param-value">${rdwcv}%</span>
                <span class="param-status ${rdwcvColor}">${rdwcvStatus}</span>
            </div>
            <div class="param-explanation">
                RDW-CV is ${rdwcv}%, which is <strong>${rdwcvStatus}</strong> (Normal: 11.5–14.5%). 
                ${rdwcvStatus === 'NORMAL' ? 
                    'This indicates normal variation in red blood cell size. RDW-CV helps assess red blood cell uniformity and anemia classification.' :
                    rdwcvStatus === 'LOW' ?
                    'Low RDW-CV indicates very uniform red blood cell size, which may be normal or indicate certain blood disorders.' :
                    'High RDW-CV indicates increased variation in red blood cell size, often seen in iron deficiency anemia or mixed anemias.'
                }
            </div>
        </div>
    `;
    
    // Mean Platelet Volume
    const mpvStatus = mpv < 7.4 ? 'LOW' : (mpv > 10.4 ? 'HIGH' : 'NORMAL');
    const mpvColor = mpvStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Mean Platelet Volume</span>
                <span class="param-value">${mpv} fL</span>
                <span class="param-status ${mpvColor}">${mpvStatus}</span>
            </div>
            <div class="param-explanation">
                MPV is ${mpv} fL, which is <strong>${mpvStatus}</strong> (Normal: 7.4–10.4 fL). 
                ${mpvStatus === 'NORMAL' ? 
                    'This indicates normal platelet size and function. MPV helps assess platelet quality and clotting efficiency.' :
                    mpvStatus === 'LOW' ?
                    'Low MPV may indicate smaller platelets with reduced function. This can affect clotting ability and wound healing.' :
                    'High MPV may indicate larger platelets with increased function. This can increase clotting risk and may indicate inflammation.'
                }
            </div>
        </div>
    `;
    
    // Platelet Distribution Width
    const pdwStatus = pdw < 9.0 ? 'LOW' : (pdw > 17.0 ? 'HIGH' : 'NORMAL');
    const pdwColor = pdwStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Platelet Distribution Width</span>
                <span class="param-value">${pdw} fL</span>
                <span class="param-status ${pdwColor}">${pdwStatus}</span>
            </div>
            <div class="param-explanation">
                PDW is ${pdw} fL, which is <strong>${pdwStatus}</strong> (Normal: 9.0–17.0 fL). 
                ${pdwStatus === 'NORMAL' ? 
                    'This indicates normal variation in platelet size. PDW helps assess platelet uniformity and quality.' :
                    pdwStatus === 'LOW' ?
                    'Low PDW indicates very uniform platelet size, which may be normal or indicate certain blood disorders.' :
                    'High PDW indicates increased variation in platelet size, often seen in inflammation or certain blood disorders.'
                }
            </div>
        </div>
    `;
    
    // Plateletcrit
    const pctStatus = pct < 0.15 ? 'LOW' : (pct > 0.35 ? 'HIGH' : 'NORMAL');
    const pctColor = pctStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Plateletcrit</span>
                <span class="param-value">${pct}%</span>
                <span class="param-status ${pctColor}">${pctStatus}</span>
            </div>
            <div class="param-explanation">
                PCT is ${pct}%, which is <strong>${pctStatus}</strong> (Normal: 0.15–0.35%). 
                ${pctStatus === 'NORMAL' ? 
                    'This indicates normal platelet mass in blood. PCT reflects the total platelet volume and clotting capacity.' :
                    pctStatus === 'LOW' ?
                    'Low PCT indicates reduced platelet mass, which can increase bleeding risk and affect clotting ability.' :
                    'High PCT indicates increased platelet mass, which can increase clotting risk and may indicate inflammation or blood disorders.'
                }
            </div>
        </div>
    `;
    
    // Platelet Large Cell Ratio
    const plcrStatus = plcr < 15 ? 'LOW' : (plcr > 35 ? 'HIGH' : 'NORMAL');
    const plcrColor = plcrStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Platelet Large Cell Ratio</span>
                <span class="param-value">${plcr}%</span>
                <span class="param-status ${plcrColor}">${plcrStatus}</span>
            </div>
            <div class="param-explanation">
                PLCR is ${plcr}%, which is <strong>${plcrStatus}</strong> (Normal: 15–35%). 
                ${plcrStatus === 'NORMAL' ? 
                    'This indicates normal proportion of large platelets. PLCR helps assess platelet quality and function.' :
                    plcrStatus === 'LOW' ?
                    'Low PLCR indicates fewer large platelets, which may affect clotting efficiency and wound healing.' :
                    'High PLCR indicates more large platelets, which can increase clotting risk and may indicate inflammation or blood disorders.'
                }
            </div>
        </div>
    `;
    
    // Cholesterol
    const cholesterolStatus = cholesterol < 200 ? 'NORMAL' : (cholesterol < 240 ? 'BORDERLINE' : 'HIGH');
    const cholesterolColor = cholesterolStatus === 'NORMAL' ? 'green' : (cholesterolStatus === 'BORDERLINE' ? 'yellow' : 'red');
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Cholesterol</span>
                <span class="param-value">${cholesterol} mg/dL</span>
                <span class="param-status ${cholesterolColor}">${cholesterolStatus}</span>
            </div>
            <div class="param-explanation">
                Cholesterol is ${cholesterol} mg/dL, which is <strong>${cholesterolStatus}</strong> (Normal: <200 mg/dL). 
                ${cholesterolStatus === 'NORMAL' ? 
                    'This indicates normal cholesterol levels. Healthy cholesterol levels reduce cardiovascular disease risk and support overall heart health.' :
                    cholesterolStatus === 'BORDERLINE' ?
                    'Borderline high cholesterol increases cardiovascular risk. Lifestyle modifications including diet and exercise are recommended.' :
                    'High cholesterol significantly increases cardiovascular disease risk. Medical intervention including statins may be necessary.'
                }
            </div>
        </div>
    `;
    
    return explanations;
}

function generateKidneyExplanations(formData, interpretation) {
    let explanations = '';
    const age = parseFloat(formData.Age) || 0;
    const sex = formData.Sex || '';
    const creatinine = parseFloat(formData.Serum_Creatinine) || 0;
    const bun = parseFloat(formData.BUN) || 0;
    const egfr = parseFloat(formData.eGFR) || 0;
    const sodium = parseFloat(formData.Sodium) || 0;
    const potassium = parseFloat(formData.Potassium) || 0;
    const calcium = parseFloat(formData.Calcium) || 0;
    const phosphorus = parseFloat(formData.Phosphorus) || 0;
    
    // Creatinine Analysis
    const creatStatus = creatinine > 1.2 ? 'HIGH' : 'NORMAL';
    const creatColor = creatStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Serum Creatinine</span>
                <span class="param-value">${creatinine} mg/dL</span>
                <span class="param-status ${creatColor}">${creatStatus}</span>
            </div>
            <div class="param-explanation">
                Creatinine is ${creatinine} mg/dL, which is <strong>${creatStatus}</strong> (Normal: 0.6–1.2 mg/dL). 
                ${creatStatus === 'NORMAL' ? 
                    'This indicates normal kidney function. Creatinine is a waste product filtered by the kidneys. Normal levels suggest healthy kidney filtration and low risk of kidney disease.' :
                    'High creatinine indicates reduced kidney function or kidney disease. This can be caused by dehydration, medications, or chronic kidney disease. Elevated creatinine requires medical evaluation and monitoring.'
                }
            </div>
        </div>
    `;
    
    // eGFR Analysis
    const egfrStatus = egfr < 60 ? 'LOW' : (egfr < 90 ? 'MILD' : 'NORMAL');
    const egfrColor = egfrStatus === 'NORMAL' ? 'green' : (egfrStatus === 'MILD' ? 'yellow' : 'red');
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">eGFR</span>
                <span class="param-value">${egfr} mL/min/1.73m²</span>
                <span class="param-status ${egfrColor}">${egfrStatus}</span>
            </div>
            <div class="param-explanation">
                eGFR is ${egfr} mL/min/1.73m², which is <strong>${egfrStatus}</strong> (Normal: >90). 
                ${egfrStatus === 'NORMAL' ? 
                    'This indicates excellent kidney function. eGFR measures how well kidneys filter waste from blood. Normal eGFR suggests low risk of kidney disease and good overall kidney health.' :
                    egfrStatus === 'MILD' ?
                    'Mildly reduced eGFR may indicate early kidney disease or age-related changes. This requires monitoring and lifestyle modifications to prevent further decline.' :
                    'Low eGFR indicates significant kidney dysfunction. This may require medical intervention, dietary modifications, and regular monitoring to prevent complications.'
                }
            </div>
        </div>
    `;
    
    // Age Analysis
    const ageStatus = age < 18 ? 'YOUNG' : (age > 65 ? 'ELDERLY' : 'NORMAL');
    const ageColor = ageStatus === 'NORMAL' ? 'green' : (ageStatus === 'YOUNG' ? 'blue' : 'yellow');
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Age</span>
                <span class="param-value">${age} years</span>
                <span class="param-status ${ageColor}">${ageStatus}</span>
            </div>
            <div class="param-explanation">
                Age is ${age} years, which is <strong>${ageStatus}</strong>. 
                ${ageStatus === 'NORMAL' ? 
                    'This indicates adult age range with normal kidney function expectations. Age is an important factor in kidney function assessment and eGFR calculation.' :
                    ageStatus === 'YOUNG' ?
                    'Young age typically indicates excellent kidney function potential. However, kidney disease can occur at any age and requires appropriate monitoring.' :
                    'Elderly age may be associated with age-related decline in kidney function. Regular monitoring and preventive care are important for maintaining kidney health.'
                }
            </div>
        </div>
    `;
    
    // Sex Analysis
    const sexStatus = sex === 'M' || sex === 'Male' ? 'MALE' : (sex === 'F' || sex === 'Female' ? 'FEMALE' : 'UNKNOWN');
    const sexColor = sexStatus === 'MALE' ? 'blue' : (sexStatus === 'FEMALE' ? 'pink' : 'gray');
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Sex</span>
                <span class="param-value">${sex}</span>
                <span class="param-status ${sexColor}">${sexStatus}</span>
            </div>
            <div class="param-explanation">
                Sex is <strong>${sexStatus}</strong>. 
                ${sexStatus === 'MALE' ? 
                    'Male sex may have different kidney function reference ranges. Men typically have higher muscle mass, which can affect creatinine levels and eGFR calculations.' :
                    sexStatus === 'FEMALE' ?
                    'Female sex may have different kidney function reference ranges. Women typically have lower muscle mass, which can affect creatinine levels and eGFR calculations.' :
                    'Sex information is important for accurate kidney function assessment and eGFR calculation.'
                }
            </div>
        </div>
    `;
    
    // Sodium Analysis
    const sodiumStatus = sodium < 136 ? 'LOW' : (sodium > 145 ? 'HIGH' : 'NORMAL');
    const sodiumColor = sodiumStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Sodium</span>
                <span class="param-value">${sodium} mEq/L</span>
                <span class="param-status ${sodiumColor}">${sodiumStatus}</span>
            </div>
            <div class="param-explanation">
                Sodium is ${sodium} mEq/L, which is <strong>${sodiumStatus}</strong> (Normal: 136–145 mEq/L). 
                ${sodiumStatus === 'NORMAL' ? 
                    'This indicates normal sodium levels, which are important for fluid balance and kidney function. Normal sodium levels support proper kidney filtration and overall health.' :
                    sodiumStatus === 'LOW' ?
                    'Low sodium (hyponatremia) can affect kidney function and fluid balance. This may be caused by medications, heart failure, or kidney disease. Medical evaluation is recommended.' :
                    'High sodium (hypernatremia) can indicate dehydration or kidney dysfunction. This can affect fluid balance and kidney function. Medical evaluation and fluid management may be needed.'
                }
            </div>
        </div>
    `;
    
    // Potassium Analysis
    const potassiumStatus = potassium < 3.5 ? 'LOW' : (potassium > 5.0 ? 'HIGH' : 'NORMAL');
    const potassiumColor = potassiumStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Potassium</span>
                <span class="param-value">${potassium} mEq/L</span>
                <span class="param-status ${potassiumColor}">${potassiumStatus}</span>
            </div>
            <div class="param-explanation">
                Potassium is ${potassium} mEq/L, which is <strong>${potassiumStatus}</strong> (Normal: 3.5–5.0 mEq/L). 
                ${potassiumStatus === 'NORMAL' ? 
                    'This indicates normal potassium levels, which are crucial for heart function and kidney health. Normal potassium supports proper kidney function and overall health.' :
                    potassiumStatus === 'LOW' ?
                    'Low potassium (hypokalemia) can affect heart function and kidney health. This may be caused by medications, kidney disease, or excessive loss. Medical evaluation is recommended.' :
                    'High potassium (hyperkalemia) can be dangerous and may indicate kidney dysfunction. This can affect heart rhythm and requires immediate medical attention.'
                }
            </div>
        </div>
    `;
    
    // Calcium Analysis
    const calciumStatus = calcium < 8.5 ? 'LOW' : (calcium > 10.5 ? 'HIGH' : 'NORMAL');
    const calciumColor = calciumStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Calcium</span>
                <span class="param-value">${calcium} mg/dL</span>
                <span class="param-status ${calciumColor}">${calciumStatus}</span>
            </div>
            <div class="param-explanation">
                Calcium is ${calcium} mg/dL, which is <strong>${calciumStatus}</strong> (Normal: 8.5–10.5 mg/dL). 
                ${calciumStatus === 'NORMAL' ? 
                    'This indicates normal calcium levels, which are important for bone health and kidney function. Normal calcium supports proper kidney function and overall health.' :
                    calciumStatus === 'LOW' ?
                    'Low calcium (hypocalcemia) can affect bone health and kidney function. This may be caused by kidney disease, vitamin D deficiency, or parathyroid disorders. Medical evaluation is recommended.' :
                    'High calcium (hypercalcemia) can indicate kidney dysfunction or parathyroid disorders. This can affect kidney function and bone health. Medical evaluation is recommended.'
                }
            </div>
        </div>
    `;
    
    // Phosphorus Analysis
    const phosphorusStatus = phosphorus < 2.5 ? 'LOW' : (phosphorus > 4.5 ? 'HIGH' : 'NORMAL');
    const phosphorusColor = phosphorusStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Phosphorus</span>
                <span class="param-value">${phosphorus} mg/dL</span>
                <span class="param-status ${phosphorusColor}">${phosphorusStatus}</span>
            </div>
            <div class="param-explanation">
                Phosphorus is ${phosphorus} mg/dL, which is <strong>${phosphorusStatus}</strong> (Normal: 2.5–4.5 mg/dL). 
                ${phosphorusStatus === 'NORMAL' ? 
                    'This indicates normal phosphorus levels, which are important for bone health and kidney function. Normal phosphorus supports proper kidney function and overall health.' :
                    phosphorusStatus === 'LOW' ?
                    'Low phosphorus (hypophosphatemia) can affect bone health and kidney function. This may be caused by kidney disease, malnutrition, or certain medications. Medical evaluation is recommended.' :
                    'High phosphorus (hyperphosphatemia) often indicates kidney dysfunction. This can affect bone health and cardiovascular health. Medical evaluation and dietary modifications may be needed.'
                }
            </div>
        </div>
    `;
    
    return explanations;
}

function generateLiverExplanations(formData, interpretation) {
    let explanations = '';
    const age = parseInt(formData.Age) || 0;
    const sex = formData.Sex || 'M';
    const alt = parseFloat(formData.ALT) || 0;
    const ast = parseFloat(formData.AST) || 0;
    const alp = parseFloat(formData.ALP) || 0;
    const ggt = parseFloat(formData.GGT) || 0;
    const albumin = parseFloat(formData.Albumin) || 0;
    const totalProtein = parseFloat(formData.Total_Protein) || 0;
    const totalBilirubin = parseFloat(formData.Total_Bilirubin) || 0;
    const directBilirubin = parseFloat(formData.Direct_Bilirubin) || 0;
    
    // Age Analysis
    const ageStatus = age >= 65 ? 'ELDERLY' : 'YOUNG';
    const ageColor = ageStatus === 'YOUNG' ? 'green' : 'yellow';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Age</span>
                <span class="param-value">${age} years</span>
                <span class="param-status ${ageColor}">${ageStatus}</span>
            </div>
            <div class="param-explanation">
                Age is ${age} years, which is <strong>${ageStatus}</strong> (Risk increases with age). 
                ${ageStatus === 'YOUNG' ? 
                    'This indicates lower risk for age-related liver disease. Liver function naturally declines with age. Younger age suggests better liver reserve and lower risk.' :
                    'This indicates higher risk for age-related liver conditions. Elderly patients are at higher risk for liver disease and complications. Regular monitoring is recommended.'
                }
            </div>
        </div>
    `;
    
    // Sex Analysis
    const sexStatus = sex === 'M' ? 'MALE' : 'FEMALE';
    const sexColor = 'blue';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Sex</span>
                <span class="param-value">${sex === 'M' ? 'Male' : 'Female'}</span>
                <span class="param-status ${sexColor}">${sexStatus}</span>
            </div>
            <div class="param-explanation">
                Sex is <strong>${sexStatus}</strong>. 
                ${sexStatus === 'MALE' ? 
                    'Males have higher rates of liver disease due to lifestyle factors and alcohol consumption patterns. This increases the risk for liver conditions.' :
                    'Females generally have lower rates of liver disease but may be more susceptible to certain conditions like autoimmune hepatitis. This provides some protection against liver disease.'
                }
            </div>
        </div>
    `;
    
    // ALT Analysis
    const altStatus = alt > 56 ? 'HIGH' : 'NORMAL';
    const altColor = altStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">ALT (Alanine Aminotransferase)</span>
                <span class="param-value">${alt} U/L</span>
                <span class="param-status ${altColor}">${altStatus}</span>
            </div>
            <div class="param-explanation">
                ALT is ${alt} U/L, which is <strong>${altStatus}</strong> (Normal: 7–56 U/L). 
                ${altStatus === 'NORMAL' ? 
                    'This indicates normal liver cell integrity. ALT is a liver-specific enzyme that rises when liver cells are damaged. Normal ALT suggests healthy liver function and low risk of liver disease.' :
                    'High ALT indicates liver cell damage or inflammation. This can be caused by viral hepatitis, fatty liver disease, medications, or alcohol. Elevated ALT requires medical evaluation to determine the cause.'
                }
            </div>
        </div>
    `;
    
    // AST Analysis
    const astStatus = ast > 40 ? 'HIGH' : 'NORMAL';
    const astColor = astStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">AST (Aspartate Aminotransferase)</span>
                <span class="param-value">${ast} U/L</span>
                <span class="param-status ${astColor}">${astStatus}</span>
            </div>
            <div class="param-explanation">
                AST is ${ast} U/L, which is <strong>${astStatus}</strong> (Normal: 10–40 U/L). 
                ${astStatus === 'NORMAL' ? 
                    'This indicates normal liver and heart function. AST is found in liver, heart, and muscle cells. Normal AST suggests healthy liver and heart function.' :
                    'High AST indicates liver or heart damage. This can be caused by liver disease, heart attack, or muscle damage. Elevated AST requires medical evaluation to determine the cause.'
                }
            </div>
        </div>
    `;
    
    // ALP Analysis
    const alpStatus = alp > 150 ? 'HIGH' : 'NORMAL';
    const alpColor = alpStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">ALP (Alkaline Phosphatase)</span>
                <span class="param-value">${alp} U/L</span>
                <span class="param-status ${alpColor}">${alpStatus}</span>
            </div>
            <div class="param-explanation">
                ALP is ${alp} U/L, which is <strong>${alpStatus}</strong> (Normal: 44–150 U/L). 
                ${alpStatus === 'NORMAL' ? 
                    'This indicates normal bone and liver function. ALP is found in liver, bile ducts, and bone. Normal ALP suggests healthy liver and bone metabolism.' :
                    'High ALP may indicate bile duct obstruction, liver disease, or bone disorders. This can be caused by gallstones, liver tumors, or bone diseases. Elevated ALP requires medical evaluation.'
                }
            </div>
        </div>
    `;
    
    // GGT Analysis
    const ggtStatus = ggt > 60 ? 'HIGH' : 'NORMAL';
    const ggtColor = ggtStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">GGT (Gamma-Glutamyl Transferase)</span>
                <span class="param-value">${ggt} U/L</span>
                <span class="param-status ${ggtColor}">${ggtStatus}</span>
            </div>
            <div class="param-explanation">
                GGT is ${ggt} U/L, which is <strong>${ggtStatus}</strong> (Normal: 8–60 U/L). 
                ${ggtStatus === 'NORMAL' ? 
                    'This indicates normal liver and bile duct function. GGT is sensitive to liver damage and alcohol consumption. Normal GGT suggests healthy liver function.' :
                    'High GGT indicates liver damage, bile duct problems, or alcohol abuse. This can be caused by hepatitis, cirrhosis, or excessive alcohol consumption. Elevated GGT requires medical evaluation.'
                }
            </div>
        </div>
    `;
    
    // Albumin Analysis
    const albuminStatus = albumin < 3.5 ? 'LOW' : 'NORMAL';
    const albuminColor = albuminStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Albumin</span>
                <span class="param-value">${albumin} g/dL</span>
                <span class="param-status ${albuminColor}">${albuminStatus}</span>
            </div>
            <div class="param-explanation">
                Albumin is ${albumin} g/dL, which is <strong>${albuminStatus}</strong> (Normal: 3.5–5.0 g/dL). 
                ${albuminStatus === 'NORMAL' ? 
                    'This indicates normal protein synthesis by the liver. Albumin is the main protein made by the liver. Normal albumin suggests healthy liver function and proper fluid balance.' :
                    'Low albumin indicates impaired liver protein production. This can be caused by liver disease, malnutrition, or kidney problems. Low albumin may lead to fluid retention and requires medical evaluation.'
                }
            </div>
        </div>
    `;
    
    // Total Protein Analysis
    const totalProteinStatus = totalProtein < 6.0 ? 'LOW' : (totalProtein > 8.3 ? 'HIGH' : 'NORMAL');
    const totalProteinColor = totalProteinStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Total Protein</span>
                <span class="param-value">${totalProtein} g/dL</span>
                <span class="param-status ${totalProteinColor}">${totalProteinStatus}</span>
            </div>
            <div class="param-explanation">
                Total Protein is ${totalProtein} g/dL, which is <strong>${totalProteinStatus}</strong> (Normal: 6.0–8.3 g/dL). 
                ${totalProteinStatus === 'NORMAL' ? 
                    'This indicates normal protein synthesis and nutrition. Total protein includes albumin and globulins. Normal levels suggest healthy liver function and adequate nutrition.' :
                    'Abnormal total protein may indicate liver disease, kidney problems, or nutritional issues. This can affect immune function and fluid balance. Medical evaluation is recommended.'
                }
            </div>
        </div>
    `;
    
    // Total Bilirubin Analysis
    const totalBilirubinStatus = totalBilirubin > 1.2 ? 'HIGH' : 'NORMAL';
    const totalBilirubinColor = totalBilirubinStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Total Bilirubin</span>
                <span class="param-value">${totalBilirubin} mg/dL</span>
                <span class="param-status ${totalBilirubinColor}">${totalBilirubinStatus}</span>
            </div>
            <div class="param-explanation">
                Total Bilirubin is ${totalBilirubin} mg/dL, which is <strong>${totalBilirubinStatus}</strong> (Normal: 0.1–1.2 mg/dL). 
                ${totalBilirubinStatus === 'NORMAL' ? 
                    'This indicates normal bile processing. Bilirubin is a waste product from red blood cell breakdown. Normal bilirubin suggests healthy liver and bile duct function.' :
                    'High bilirubin may cause jaundice and indicate liver disease or bile duct problems. This can be caused by hepatitis, cirrhosis, or bile duct obstruction. Elevated bilirubin requires medical evaluation.'
                }
            </div>
        </div>
    `;
    
    // Direct Bilirubin Analysis
    const directBilirubinStatus = directBilirubin > 0.3 ? 'HIGH' : 'NORMAL';
    const directBilirubinColor = directBilirubinStatus === 'NORMAL' ? 'green' : 'red';
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Direct Bilirubin</span>
                <span class="param-value">${directBilirubin} mg/dL</span>
                <span class="param-status ${directBilirubinColor}">${directBilirubinStatus}</span>
            </div>
            <div class="param-explanation">
                Direct Bilirubin is ${directBilirubin} mg/dL, which is <strong>${directBilirubinStatus}</strong> (Normal: 0.0–0.3 mg/dL). 
                ${directBilirubinStatus === 'NORMAL' ? 
                    'This indicates normal bile duct function. Direct bilirubin is the conjugated form processed by the liver. Normal levels suggest healthy bile duct and liver function.' :
                    'High direct bilirubin indicates bile duct obstruction or liver dysfunction. This can be caused by gallstones, tumors, or liver disease. Elevated direct bilirubin requires medical evaluation.'
                }
            </div>
        </div>
    `;
    
    return explanations;
}

function generateDiabetesExplanations(formData, interpretation) {
    let explanations = '';
    const fastingGlucose = parseFloat(formData.Fasting_Blood_Glucose) || 0;
    const postprandialGlucose = parseFloat(formData.Postprandial_Glucose) || 0;
    const ogtt2hr = parseFloat(formData.OGTT_2hr) || 0;
    const hba1c = parseFloat(formData.HbA1c) || 0;
    const insulinFasting = parseFloat(formData.Insulin_Fasting) || 0;
    const insulin2hr = parseFloat(formData.Insulin_2hr) || 0;
    const cPeptide = parseFloat(formData.C_Peptide) || 0;
    
    // Fasting Glucose Analysis
    const glucoseStatus = fastingGlucose < 100 ? 'NORMAL' : (fastingGlucose < 126 ? 'PREDIABETES' : 'DIABETES');
    const glucoseColor = glucoseStatus === 'NORMAL' ? 'green' : (glucoseStatus === 'PREDIABETES' ? 'yellow' : 'red');
    
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Fasting Glucose</span>
                <span class="param-value">${fastingGlucose} mg/dL</span>
                <span class="param-status ${glucoseColor}">${glucoseStatus}</span>
            </div>
            <div class="param-explanation">
                Fasting glucose is ${fastingGlucose} mg/dL, which is <strong>${glucoseStatus}</strong> (Normal: <100 mg/dL). 
                ${glucoseStatus === 'NORMAL' ? 
                    'This indicates normal glucose metabolism. Normal fasting glucose suggests good blood sugar control and low risk of diabetes. This is the most common finding in healthy individuals.' :
                    glucoseStatus === 'PREDIABETES' ?
                    'This indicates prediabetes, a condition where blood sugar is higher than normal but not high enough for diabetes. This increases diabetes risk and requires lifestyle modifications including diet and exercise.' :
                    'This indicates diabetes, a condition where blood sugar is consistently elevated. This requires medical management including medication, diet, and regular monitoring to prevent complications.'
                }
            </div>
        </div>
    `;
    
    // Postprandial Glucose Analysis
    const postprandialStatus = postprandialGlucose < 140 ? 'NORMAL' : (postprandialGlucose < 200 ? 'PREDIABETES' : 'DIABETES');
    const postprandialColor = postprandialStatus === 'NORMAL' ? 'green' : (postprandialStatus === 'PREDIABETES' ? 'yellow' : 'red');
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Postprandial Glucose</span>
                <span class="param-value">${postprandialGlucose} mg/dL</span>
                <span class="param-status ${postprandialColor}">${postprandialStatus}</span>
            </div>
            <div class="param-explanation">
                Postprandial glucose is ${postprandialGlucose} mg/dL, which is <strong>${postprandialStatus}</strong> (Normal: <140 mg/dL). 
                ${postprandialStatus === 'NORMAL' ? 
                    'This indicates normal glucose response after eating. Normal postprandial glucose suggests good blood sugar control and proper insulin function.' :
                    postprandialStatus === 'PREDIABETES' ?
                    'This indicates impaired glucose tolerance, a sign of prediabetes. This increases diabetes risk and requires lifestyle modifications including diet and exercise.' :
                    'This indicates diabetes, showing poor glucose control after eating. This requires medical management including medication, diet, and regular monitoring.'
                }
            </div>
        </div>
    `;
    
    // OGTT 2-hour Analysis
    const ogttStatus = ogtt2hr < 140 ? 'NORMAL' : (ogtt2hr < 200 ? 'PREDIABETES' : 'DIABETES');
    const ogttColor = ogttStatus === 'NORMAL' ? 'green' : (ogttStatus === 'PREDIABETES' ? 'yellow' : 'red');
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">OGTT 2-hour</span>
                <span class="param-value">${ogtt2hr} mg/dL</span>
                <span class="param-status ${ogttColor}">${ogttStatus}</span>
            </div>
            <div class="param-explanation">
                OGTT 2-hour glucose is ${ogtt2hr} mg/dL, which is <strong>${ogttStatus}</strong> (Normal: <140 mg/dL). 
                ${ogttStatus === 'NORMAL' ? 
                    'This indicates normal glucose tolerance during oral glucose tolerance test. Normal OGTT suggests good insulin function and glucose metabolism.' :
                    ogttStatus === 'PREDIABETES' ?
                    'This indicates impaired glucose tolerance, a sign of prediabetes. This increases diabetes risk and requires lifestyle modifications including diet and exercise.' :
                    'This indicates diabetes, showing poor glucose tolerance. This requires medical management including medication, diet, and regular monitoring.'
                }
            </div>
        </div>
    `;
    
    // HbA1c Analysis
    const hba1cStatus = hba1c < 5.7 ? 'NORMAL' : (hba1c < 6.5 ? 'PREDIABETES' : 'DIABETES');
    const hba1cColor = hba1cStatus === 'NORMAL' ? 'green' : (hba1cStatus === 'PREDIABETES' ? 'yellow' : 'red');
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">HbA1c</span>
                <span class="param-value">${hba1c}%</span>
                <span class="param-status ${hba1cColor}">${hba1cStatus}</span>
            </div>
            <div class="param-explanation">
                HbA1c is ${hba1c}%, which is <strong>${hba1cStatus}</strong> (Normal: <5.7%). 
                ${hba1cStatus === 'NORMAL' ? 
                    'This indicates normal long-term glucose control over the past 2-3 months. Normal HbA1c suggests good blood sugar management and low diabetes risk.' :
                    hba1cStatus === 'PREDIABETES' ?
                    'This indicates prediabetes, showing elevated long-term glucose levels. This increases diabetes risk and requires lifestyle modifications including diet and exercise.' :
                    'This indicates diabetes, showing poor long-term glucose control. This requires medical management including medication, diet, and regular monitoring.'
                }
            </div>
        </div>
    `;
    
    // Fasting Insulin Analysis
    const insulinFastingStatus = insulinFasting < 25 ? 'NORMAL' : (insulinFasting < 50 ? 'HIGH' : 'VERY_HIGH');
    const insulinFastingColor = insulinFastingStatus === 'NORMAL' ? 'green' : (insulinFastingStatus === 'HIGH' ? 'yellow' : 'red');
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">Fasting Insulin</span>
                <span class="param-value">${insulinFasting} μU/mL</span>
                <span class="param-status ${insulinFastingColor}">${insulinFastingStatus}</span>
            </div>
            <div class="param-explanation">
                Fasting insulin is ${insulinFasting} μU/mL, which is <strong>${insulinFastingStatus}</strong> (Normal: <25 μU/mL). 
                ${insulinFastingStatus === 'NORMAL' ? 
                    'This indicates normal insulin production and sensitivity. Normal fasting insulin suggests good glucose metabolism and low diabetes risk.' :
                    insulinFastingStatus === 'HIGH' ?
                    'This indicates insulin resistance, where the body produces more insulin to maintain normal glucose levels. This increases diabetes risk and requires lifestyle modifications.' :
                    'This indicates severe insulin resistance, showing very high insulin production. This significantly increases diabetes risk and requires medical intervention.'
                }
            </div>
        </div>
    `;
    
    // 2-hour Insulin Analysis
    const insulin2hrStatus = insulin2hr < 100 ? 'NORMAL' : (insulin2hr < 200 ? 'HIGH' : 'VERY_HIGH');
    const insulin2hrColor = insulin2hrStatus === 'NORMAL' ? 'green' : (insulin2hrStatus === 'HIGH' ? 'yellow' : 'red');
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">2-hour Insulin</span>
                <span class="param-value">${insulin2hr} μU/mL</span>
                <span class="param-status ${insulin2hrColor}">${insulin2hrStatus}</span>
            </div>
            <div class="param-explanation">
                2-hour insulin is ${insulin2hr} μU/mL, which is <strong>${insulin2hrStatus}</strong> (Normal: <100 μU/mL). 
                ${insulin2hrStatus === 'NORMAL' ? 
                    'This indicates normal insulin response after glucose challenge. Normal 2-hour insulin suggests good glucose metabolism and insulin sensitivity.' :
                    insulin2hrStatus === 'HIGH' ?
                    'This indicates insulin resistance, where the body produces more insulin in response to glucose. This increases diabetes risk and requires lifestyle modifications.' :
                    'This indicates severe insulin resistance, showing very high insulin production after glucose challenge. This significantly increases diabetes risk and requires medical intervention.'
                }
            </div>
        </div>
    `;
    
    // C-Peptide Analysis
    const cPeptideStatus = cPeptide < 0.8 ? 'LOW' : (cPeptide < 3.0 ? 'NORMAL' : 'HIGH');
    const cPeptideColor = cPeptideStatus === 'NORMAL' ? 'green' : 'red';
    explanations += `
        <div class="explanation-item">
            <div class="param-header">
                <span class="param-name">C-Peptide</span>
                <span class="param-value">${cPeptide} ng/mL</span>
                <span class="param-status ${cPeptideColor}">${cPeptideStatus}</span>
            </div>
            <div class="param-explanation">
                C-Peptide is ${cPeptide} ng/mL, which is <strong>${cPeptideStatus}</strong> (Normal: 0.8–3.0 ng/mL). 
                ${cPeptideStatus === 'NORMAL' ? 
                    'This indicates normal insulin production by the pancreas. Normal C-Peptide suggests good pancreatic function and insulin production capacity.' :
                    cPeptideStatus === 'LOW' ?
                    'This indicates reduced insulin production, which may suggest pancreatic dysfunction or advanced diabetes. This requires medical evaluation and may indicate need for insulin therapy.' :
                    'This indicates high insulin production, which may suggest insulin resistance or certain pancreatic conditions. This requires medical evaluation and monitoring.'
                }
            </div>
        </div>
    `;
    
    return explanations;
}

    // Close results function
    window.closeResults = function() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'none';
    };

// Function to get risk color class based on risk level
function getRiskColorClass(riskLevel) {
    const risk = riskLevel.toLowerCase();
    if (risk.includes('high') || risk.includes('unhealthy')) {
        return 'high';
    } else if (risk.includes('mid') || risk.includes('moderate')) {
        return 'mid';
    } else if (risk.includes('low') || risk.includes('normal')) {
        return 'normal';
    } else {
        return 'normal'; // default
    }
}

// Explanation pagination
let explanationPages = {};

function setupExplanationPagination(reportType, explanations) {
    const itemsPerPage = 1; // Show 1 parameter per page
    const explanationItems = document.querySelectorAll(`#explanations-${reportType} .explanation-item`);
    const totalPages = Math.ceil(explanationItems.length / itemsPerPage);
    
    explanationPages[reportType] = {
        currentPage: 1,
        totalPages: totalPages,
        itemsPerPage: itemsPerPage
    };
    
    // Update counter
    const counter = document.querySelector(`#explanations-${reportType}`).parentElement.querySelector('.explanation-counter');
    counter.innerHTML = `<span class="current-page">1</span> / <span class="total-pages">${totalPages}</span>`;
    
    // Show first page
    showExplanationPage(reportType, 1);
}

function showExplanationPage(reportType, page) {
    const explanationItems = document.querySelectorAll(`#explanations-${reportType} .explanation-item`);
    const startIndex = (page - 1) * explanationPages[reportType].itemsPerPage;
    const endIndex = startIndex + explanationPages[reportType].itemsPerPage;
    
    // Hide all items
    explanationItems.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.querySelector(`#explanations-${reportType}`).parentElement.querySelector('.prev-btn');
    const nextBtn = document.querySelector(`#explanations-${reportType}`).parentElement.querySelector('.next-btn');
    const counter = document.querySelector(`#explanations-${reportType}`).parentElement.querySelector('.explanation-counter');
    
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === explanationPages[reportType].totalPages;
    counter.innerHTML = `<span class="current-page">${page}</span> / <span class="total-pages">${explanationPages[reportType].totalPages}</span>`;
}

    // Global functions for pagination
    window.nextExplanation = function(reportType) {
        if (explanationPages[reportType] && explanationPages[reportType].currentPage < explanationPages[reportType].totalPages) {
            explanationPages[reportType].currentPage++;
            showExplanationPage(reportType, explanationPages[reportType].currentPage);
        }
    };

    window.previousExplanation = function(reportType) {
        if (explanationPages[reportType] && explanationPages[reportType].currentPage > 1) {
            explanationPages[reportType].currentPage--;
            showExplanationPage(reportType, explanationPages[reportType].currentPage);
        }
    };

    // Clear all reports function
    window.clearAllReports = function() {
    const reportsWithData = Object.entries(reportData).filter(([type, data]) => 
        Object.values(data).some(value => value !== '')
    );
    
    if (reportsWithData.length === 0) {
            alert('No reports to clear');
        return;
    }
    
    if (confirm('Are you sure you want to clear all entered reports?')) {
        reportData = {};
        selectedReportType = null;
        
        // Reset UI
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('formGrid').innerHTML = '';
        
        // Remove selections from cards
        document.querySelectorAll('.report-card').forEach(card => {
            card.classList.remove('selected', 'uploaded');
        });
        
            alert('All reports cleared');
        }
    };

    // Global function for selecting report type
    window.selectReportType = function(reportType) {
        
        const reportCards = document.querySelectorAll('.report-card');
        const uploadSection = document.getElementById('uploadSection');
        const uploadSectionTitle = document.getElementById('uploadSectionTitle');
        const formGrid = document.getElementById('formGrid');
        
        // Remove previous selection
        reportCards.forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        const selectedCard = document.querySelector(`[data-type="${reportType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Set selected report type
        selectedReportType = reportType;
        
        // Show upload section
        if (uploadSection) {
            uploadSection.style.display = 'block';
        }
        
        // Update title
        if (uploadSectionTitle) {
            uploadSectionTitle.textContent = `Enter ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Data`;
        }
        
        // Generate form fields
        generateFormFields(reportType);
    };
