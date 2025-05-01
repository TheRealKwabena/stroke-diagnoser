
import axios from 'axios';
import { api } from '../lib/api';
import { PatientData, LabData, Diagnosis } from '../types/patient';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000' || "https://stroke-diagnoser.onrender.com"; / Update this to match your FastAPI server

// Helper to get the auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const patientService = {
  // Fetch patients by role (for doctors and neurologists)
  getPatientsByRole: async (role: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/role/${role}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching patients by role:', error);
      throw error;
    }
  },

  // Get all patients (with role = Patient)
  getPatients: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/role/Patient`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Fallback to local storage if API fails
      const localPatients = localStorage.getItem('patients');
      if (localPatients) {
        return JSON.parse(localPatients);
      }
      throw error;
    }
  },

  // Submit vitals for current patient
  submitVitals: async (vitalsData: PatientData) => {
    try {
      const response = await axios.post(`${API_URL}/users/me/vitals`, vitalsData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error submitting vitals:', error);
      throw error;
    }
  },

  // Submit lab results for current patient
  submitLabResults: async (labData: Omit<LabData, 'id'>) => {
    try {
      const response = await axios.post(`${API_URL}/users/me/results`, labData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error submitting lab results:', error);
      throw error;
    }
  },

  // Get vitals for a specific patient
  getPatientVitals: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/vitals`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching patient vitals:', error);
      throw error;
    }
  },

  // Get lab results for a specific patient
  getPatientLabResults: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/results`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching patient lab results:', error);
      throw error;
    }
  },

  // Create neurologist consultation
  createConsultation: async (userId: string, consultationData: Omit<Diagnosis, 'id'>) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/${userId}/consultations`, 
        consultationData, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  },

  // Get consultations for a specific patient
  getPatientConsultations: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/consultations`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching patient consultations:', error);
      throw error;
    }
  },

  // Check TPA eligibility for a patient
  checkTPAEligibility: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/tpa-eligibility`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error checking TPA eligibility:', error);
      throw error;
    }
  }
};
