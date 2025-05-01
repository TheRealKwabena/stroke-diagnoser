
import { ConsultationCard } from "@/components/ConsultationCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [hasConsultation, setHasConsultation] = useState(false);
  
  // Mock consultation data
  const mockPatientData = {
    name: user?.name || "Patient Name",
    age: "42",
    sex: "male",
    chiefComplaint: "Sudden onset of headache and confusion",
    medicalHistory: "Hypertension, Diabetes"
  };

  const mockLabData = {
    cbc: "abnormal",
    bmp_glucose: 142,
    creatinine: 0.9,
    coagulation: "normal"
  };

  const mockDiagnosis = {
    condition: "Acute ischemic stroke",
    treatment: [
      "tPA administration approved",
      "Blood pressure management",
      "Admission to the ICU for close monitoring"
    ]
  };

  const handleRequestConsultation = () => {
    // In a real app, this would create a consultation request
    setHasConsultation(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Patient Dashboard
        </h1>
        
        <div className="mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-purple-500" />
              Welcome, {user?.name}
            </h2>
            <p className="text-gray-600 mb-4">
              Here you can view your consultation results and neurologist recommendations.
            </p>
          </div>

          {!hasConsultation ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <h3 className="text-xl font-medium mb-4">No Consultations Yet</h3>
              <p className="text-gray-600 mb-6">
                You don't have any neurologist consultations yet. Request a consultation to get started.
              </p>
              <Button onClick={handleRequestConsultation}>
                Request Consultation
              </Button>
            </div>
          ) : (
            <ConsultationCard
              patientData={mockPatientData}
              labData={mockLabData}
              diagnosis={mockDiagnosis}
              className="mb-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
