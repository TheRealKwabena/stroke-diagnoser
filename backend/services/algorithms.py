
from models.models import AllReportData
def meet_inclusion_criteria(report: AllReportData) -> bool:
    """
    Check if the patient meets the inclusion criteria for tPA administration.
    """
    return (
        report.age >= 18 and
        report.nihss_score >= 4 and
        report.inr <= 1.7 and
        60 <= report.heart_rate <= 100 and
        12 <= report.respiratory_rate <= 20 and
        97 <= report.temperature <= 100.4 and
        95 <= report.oxygen_saturation <= 100 and
        report.informed_consent == True
    )
def meet_exclusion_criteria(report: AllReportData) -> bool:
    """TODO: Check if the patient meets the exclusion criteria for tPA administration."""
    
def analyze_symptoms(report: AllReportData):
    """
    * **Initial Assessment**:
* Has the patient presented within 4.5 hours of symptom onset?
* Are imaging studies (CT or MRI) available to confirm ischemic stroke and rule out
hemorrhage?
* If the patient meets the inclusion criteria and does not have any of the exclusion
criteria, proceed with tPA administration.
* If the patient has any of the exclusion criteria, do not administer tPA.
* **Inclusion Criteria**:
* Age ≥ 18 years
* NIHSS (National Institutes of Health Stroke Scale) score ≥ 4
* INR <=1.7
Heart Rate (Pulse) Normal: 60-100 beats per minute (bpm)
Respiratory Rate Normal: 12-20 breaths per minute
Temperature Normal: Approximately 98.6°F (37°C), but can range from 97°F
(36.1°C) to 100.4°F (38°C)
Oxygen Saturation (SpO2) normal: 95-100%
* Patient or legal representative provides informed consent
* **Exclusion Criteria**:
* Significant head or spinal trauma in the previous 3 months
* Stroke or serious head injury in the previous 3 months
* Intracranial hemorrhage, tumor, or arteriovenous malformation
* Recent myocardial infarction
* Systolic blood pressure > 185 mmHg or diastolic blood pressure > 110 mmHg
* Blood glucose < 50 mg/dL or >400 mg/dL
* Use of anticoagulants with elevated INR >=3 causes bleeding
* Platelet count < 100,000/μL
* Recent surgery or biopsy of a parenchymal organ

    """

    

