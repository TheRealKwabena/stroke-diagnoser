
import { PatientCase } from "@/types/patient";

const PATIENTS_STORAGE_KEY = "medease_patients";

export const localStorageService = {
  // Save all patients to localStorage
  savePatients: (patients: PatientCase[]): void => {
    try {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (error) {
      console.error("Error saving patients to localStorage:", error);
    }
  },

  // Get all patients from localStorage
  getPatients: (): PatientCase[] => {
    try {
      const patients = localStorage.getItem(PATIENTS_STORAGE_KEY);
      return patients ? JSON.parse(patients) : [];
    } catch (error) {
      console.error("Error getting patients from localStorage:", error);
      return [];
    }
  },

  // Save a single patient (adds or updates)
  savePatient: (patient: PatientCase): void => {
    try {
      const patients = localStorageService.getPatients();
      const existingIndex = patients.findIndex(p => p.id === patient.id);
      
      if (existingIndex >= 0) {
        // Update existing patient
        patients[existingIndex] = patient;
      } else {
        // Add new patient
        patients.push(patient);
      }
      
      localStorageService.savePatients(patients);
    } catch (error) {
      console.error("Error saving patient to localStorage:", error);
    }
  },

  // Get a single patient by ID
  getPatientById: (id: string): PatientCase | undefined => {
    try {
      const patients = localStorageService.getPatients();
      return patients.find(p => p.id === id);
    } catch (error) {
      console.error(`Error getting patient ${id} from localStorage:`, error);
      return undefined;
    }
  },

  // Get patients by status
  getPatientsByStatus: (status: string): PatientCase[] => {
    try {
      const patients = localStorageService.getPatients();
      return patients.filter(p => p.status === status);
    } catch (error) {
      console.error(`Error getting patients with status ${status} from localStorage:`, error);
      return [];
    }
  },

  // Clear all patient data
  clearPatients: (): void => {
    try {
      localStorage.removeItem(PATIENTS_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing patients from localStorage:", error);
    }
  }
};
