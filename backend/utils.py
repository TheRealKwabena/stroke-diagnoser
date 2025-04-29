from models import LabResultPublic, VitalsPublic, User


def is_eligible_for_tpa(vitals: VitalsPublic, lab_result: LabResultPublic, user: User) -> bool:
    if not (user.age and user.age >= 18):
        return False
    if not (vitals.nihss_score and vitals.nihss_score >= 4):
        return False
    if not (vitals.oxygen_saturation and vitals.oxygen_saturation >= 95):
        return False
    if vitals.significant_head_trauma or vitals.recent_surgery or \
       vitals.recent_myocardial_infarction or vitals.recent_hemorrhage:
        return False
    if vitals.blood_pressure_systolic > 185 or vitals.blood_pressure_diastolic > 110:
        return False
    if lab_result.bmp_glucose < 50 or lab_result.bmp_glucose > 400:
        return False
    if lab_result.coagulation.lower() == "abnormal" or vitals.inr_score >= 3.0:
        return False
    if vitals.platelet_count and vitals.platelet_count < 100000:
        return False
    return True
