
import { useLocation, Navigate } from 'react-router-dom';
import { PatientResultsCard } from '@/components/PatientResultsCard';

interface LocationState {
  formData: {
    name: string;
    age: string;
    sex: string;
    chiefComplaint: string;
    medicalHistory: string;
  };
}

const Results = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  // If no form data is present, redirect to the form
  if (!state?.formData) {
    return <Navigate to="/form" replace />;
  }

  const patientResults = {
    labResults: {
      cbc: "normal",
      bmp: "elevated creatinine (1.5 mg/dL)",
      coagulation: "normal"
    },
    imaging: "CT scan of the head: shows a large infarct in the left middle cerebral artery territory",
    diagnosis: "Acute ischemic stroke",
    treatment: [
      "tPA administration",
      "blood pressure management",
      "admission to the ICU for close monitoring"
    ]
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Patient Results</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Patient Information</h3>
          <div className="bg-muted p-4 rounded-md">
            <p><strong>Name:</strong> {state.formData.name}</p>
            <p><strong>Age:</strong> {state.formData.age}</p>
            <p><strong>Sex:</strong> {state.formData.sex}</p>
            <p><strong>Chief Complaint:</strong> {state.formData.chiefComplaint}</p>
            <p><strong>Medical History:</strong> {state.formData.medicalHistory}</p>
          </div>
        </div>
        <PatientResultsCard results={patientResults} />
      </div>
    </div>
  );
};

export default Results;
