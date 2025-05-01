
// Patient data interface
export interface PatientData {
  chief_complaint: string;
  medical_history: string;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  respiratory_rate: number;
  oxygen_saturation: number;
  significant_head_trauma: boolean;
  recent_surgery: boolean;
  recent_myocardial_infarction: boolean;
  recent_hemorrhage: boolean;
  platelet_count: number;
  nihss_score?: number;
  inr_score?: number;
}
export interface UserPatientData {
  name: string;
  age:number;
  gender: string
  chief_complaint: string;
  medical_history: string;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  respiratory_rate: number;
  oxygen_saturation: number;
  significant_head_trauma: boolean;
  recent_surgery: boolean;
  recent_myocardial_infarction: boolean;
  recent_hemorrhage: boolean;
  platelet_count: number;
  nihss_score?: number;
  inr_score?: number;
}

// Lab data interface
export interface LabData {
  cbc: string; // "normal" or "abnormal"
  bmp_glucose: number;
  creatinine: number;
  coagulation: string; // "normal" or "abnormal"
}

// Diagnosis interface
export interface Diagnosis {
  tpa_approval?: boolean;
  diagnosis: string;
  treatment_plan: string;
  
}

// Complete patient case interface
export interface PatientCase {
  id: string;
  patientData: UserPatientData;
  labData: LabData;
  consultations?: Diagnosis[];
  tpa_eligibility?: string;
  status?: "pending" | "approved" | "denied";  // Frontend status for UI tracking
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// User types matching backend
export interface User {
  id: string;
  name: string;
  username: string;
  age: number;
  gender: string;  // "Male" | "Female"
  role: string;    // "Patient" | "Doctor" | "Neurologist"
}
