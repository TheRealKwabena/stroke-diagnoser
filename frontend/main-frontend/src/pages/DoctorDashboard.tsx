
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationCard } from "@/components/ConsultationCard";
import { FileText, Users, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock patient data
const mockPatients = [
  {
    id: "p1",
    name: "John Doe",
    age: "45",
    sex: "male",
    hasSubmitted: true,
    hasConsultation: true,
    diagnosis: {
      condition: "Acute ischemic stroke",
      treatment: [
        "tPA administration approved",
        "Blood pressure management",
        "Admission to the ICU for close monitoring"
      ]
    }
  },
  {
    id: "p2",
    name: "Maria Rodriguez",
    age: "68",
    sex: "female",
    hasSubmitted: true,
    hasConsultation: false
  },
  {
    id: "p3",
    name: "Ahmed Khan",
    age: "52",
    sex: "male",
    hasSubmitted: false,
    hasConsultation: false
  },
  {
    id: "p4",
    name: "Sarah Johnson",
    age: "38",
    sex: "female",
    hasSubmitted: false,
    hasConsultation: false
  }
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  const handleSelectPatient = (id: string) => {
    setSelectedPatient(id);
  };
  
  const handleCreateForm = (patientId: string) => {
    // In a real app, this would navigate to a form pre-filled with patient data
    // For now, we'll just navigate to the form page
    navigate('/form', { state: { patientId } });
  };
  
  const allPatients = mockPatients;
  const pendingResultsPatients = mockPatients.filter(p => !p.hasSubmitted);
  const withConsultationPatients = mockPatients.filter(p => p.hasConsultation);

  // Get the full details of the selected patient
  const selectedPatientDetails = selectedPatient 
    ? mockPatients.find(p => p.id === selectedPatient)
    : null;
  
  // Mock patient data for the consultation card
  const mockPatientData = selectedPatientDetails ? {
    name: selectedPatientDetails.name,
    age: selectedPatientDetails.age,
    sex: selectedPatientDetails.sex,
    chiefComplaint: "Sudden onset of right-sided weakness and difficulty speaking",
    medicalHistory: "Hypertension, Smoking"
  } : null;
  
  const mockLabData = {
    cbc: "normal",
    bmp_glucose: 112,
    creatinine: 0.8,
    coagulation: "normal"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Doctor Dashboard
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">
              All Patients ({allPatients.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Results ({pendingResultsPatients.length})
            </TabsTrigger>
            <TabsTrigger value="consultations">
              With Consultations ({withConsultationPatients.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Patients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {allPatients.map((patient) => (
                        <div 
                          key={patient.id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            selectedPatient === patient.id ? "border-purple-500 bg-purple-50" : ""
                          }`}
                          onClick={() => handleSelectPatient(patient.id)}
                        >
                          <div className="flex justify-between">
                            <p className="font-medium">{patient.name}</p>
                            {patient.hasConsultation && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Consulted
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {patient.age} years, {patient.sex}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {patient.hasSubmitted ? "Results submitted" : "No results submitted"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {selectedPatient && selectedPatientDetails ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Patient Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{selectedPatientDetails.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="font-medium">{selectedPatientDetails.age} years</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Sex</p>
                            <p className="font-medium">{selectedPatientDetails.sex}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium">
                              {selectedPatientDetails.hasConsultation 
                                ? "Consultation completed" 
                                : selectedPatientDetails.hasSubmitted 
                                  ? "Awaiting consultation"
                                  : "Results not submitted"
                              }
                            </p>
                          </div>
                        </div>

                        {!selectedPatientDetails.hasSubmitted && (
                          <Button 
                            onClick={() => handleCreateForm(selectedPatientDetails.id)}
                            className="w-full"
                          >
                            Submit Form for Patient
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {selectedPatientDetails.hasConsultation && mockPatientData && (
                      <ConsultationCard 
                        patientData={mockPatientData}
                        labData={mockLabData}
                        diagnosis={selectedPatientDetails.diagnosis || {
                          condition: "",
                          treatment: []
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">Select a patient from the list to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingResultsPatients.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No patients with pending results</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingResultsPatients.map((patient) => (
                  <Card key={patient.id}>
                    <CardHeader>
                      <CardTitle>{patient.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">
                        {patient.age} years, {patient.sex}
                      </p>
                      <Button 
                        onClick={() => handleCreateForm(patient.id)}
                        className="w-full"
                      >
                        Submit Form
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4 mt-4">
            {withConsultationPatients.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No patients with completed consultations</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {withConsultationPatients.map((patient) => {
                  const mockPatientData = {
                    name: patient.name,
                    age: patient.age,
                    sex: patient.sex,
                    chiefComplaint: "Sudden onset of right-sided weakness and difficulty speaking",
                    medicalHistory: "Hypertension, Smoking"
                  };
                  
                  return (
                    <ConsultationCard
                      key={patient.id}
                      patientData={mockPatientData}
                      labData={mockLabData}
                      diagnosis={patient.diagnosis || { condition: "", treatment: [] }}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
