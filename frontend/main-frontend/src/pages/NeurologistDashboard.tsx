import { useState, useEffect } from "react";
import { ConsultationCard } from "@/components/ConsultationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { FileText, Check, X, Info, Loader2 } from "lucide-react";
import { patientService } from "@/services/patientService";

import { PatientCase, PatientData, UserPatientData, User } from "@/types/patient";
import { useAuth } from "@/hooks/useAuth";
// Mock patient cases - these will be replaced with API data
const mockPatientCases: PatientCase[] = [
  {
    id: "p1",
    patientData: {
      name: "John Doe",
      age: 45,
      gender: "male",
      chief_complaint: "Sudden onset of right-sided weakness and difficulty speaking",
      medical_history: "Hypertension, Smoking",
      blood_pressure_systolic: 140,
      blood_pressure_diastolic: 90,
      heart_rate: 80,
      respiratory_rate: 18,
      oxygen_saturation: 98,
      significant_head_trauma: false,
      recent_surgery: false,
      recent_myocardial_infarction: false,
      recent_hemorrhage: false,
      platelet_count: 250000
    },
    labData: {
      cbc: "normal",
      bmp_glucose: 112,
      creatinine: 0.8,
      coagulation: "normal"
    },
    status: "pending"
  },
  {
    id: "p2",
    patientData: {
      name: "Maria Rodriguez",
      age: 68,
      gender: "female",
      chief_complaint: "Sudden severe headache, nausea, and confusion",
      medical_history: "Diabetes, Hypertension",
      blood_pressure_systolic: 160,
      blood_pressure_diastolic: 95,
      heart_rate: 88,
      respiratory_rate: 20,
      oxygen_saturation: 96,
      significant_head_trauma: false,
      recent_surgery: false,
      recent_myocardial_infarction: false,
      recent_hemorrhage: false,
      platelet_count: 190000
    },
    labData: {
      cbc: "abnormal",
      bmp_glucose: 205,
      creatinine: 1.2,
      coagulation: "abnormal"
    },
    status: "pending"
  },
  {
    id: "p3",
    patientData: {
      name: "Ahmed Khan",
      age: 52,
      gender: "male",
      chief_complaint: "Progressive weakness on left side, slurred speech",
      medical_history: "Prior TIA, Hyperlipidemia",
      blood_pressure_systolic: 150,
      blood_pressure_diastolic: 85,
      heart_rate: 76,
      respiratory_rate: 16,
      oxygen_saturation: 99,
      significant_head_trauma: false,
      recent_surgery: false,
      recent_myocardial_infarction: false,
      recent_hemorrhage: false,
      platelet_count: 230000
    },
    labData: {
      cbc: "normal",
      bmp_glucose: 98,
      creatinine: 0.9,
      coagulation: "normal"
    },
    status: "pending"
  }
];

// Helper function to map PatientData to the format expected by ConsultationCard
const mapPatientDataToCardFormat = (patientData: UserPatientData) => {
  return {
    name: patientData.name,
    age: patientData.age?.toString() || "",
    sex: patientData.gender,
    chiefComplaint: patientData.chief_complaint,
    medicalHistory: patientData.medical_history,
    bloodPressure: `${patientData.blood_pressure_systolic}/${patientData.blood_pressure_diastolic}`,
    heartRate: patientData.heart_rate,
    respiratoryRate: `${patientData.respiratory_rate} breaths/min`,
    oxygenSaturation: `${patientData.oxygen_saturation}%`,
  };
};

const NeurologistDashboard = () => {
  //const [patients, setPatients] = useState<PatientCase[]>(mockPatientCases);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment_plan, setTreatmentPlan] = useState("");
  const [tpa_approval, setTPApproval] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<PatientCase[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  // Fetch patients from API
  const [localLoading, setLocalLoading] = useState(false);


  const isProcessing = loading || localLoading;
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get patients with role "Patient"
        const patientUsers = await patientService.getPatients();
        console.log("Fetched patient users:", patientUsers);
        
        if (patientUsers && Array.isArray(patientUsers)) {
          // For each patient user, fetch their vitals and lab results
          const patientCasesPromises = patientUsers.map(async (patientUser: User) => {
            try {
              // Get vitals for this patient
              const vitalsData = await patientService.getPatientVitals(patientUser.id);
              console.log(`Vitals data for patient ${patientUser.id}:`, vitalsData);
              
              // Get lab results for this patient
              const labData = await patientService.getPatientLabResults(patientUser.id);
              console.log(`Lab data for patient ${patientUser.id}:`, labData);
              
              // Get consultations for this patient (if any)
              const consultations = await patientService.getPatientConsultations(patientUser.id);
              console.log(`Consultations for patient ${patientUser.id}:`, consultations);
              
              // Check TPA eligibility
              const tpaEligibility = await patientService.checkTPAEligibility(patientUser.id);
              console.log(`TPA eligibility for patient ${patientUser.id}:`, tpaEligibility);
              
              // Create a PatientCase object
              return {
                id: patientUser.id,
                patientData: {
                  name: patientUser.name,
                  age: patientUser.age,
                  gender: patientUser.gender,
                  ...vitalsData
                },
                labData: labData,
                consultations: consultations || [],
                tpa_eligibility: tpaEligibility?.eligible ? "eligible" : "ineligible",
                status: consultations && consultations.length > 0 ? 
                  (consultations[0].tpa_approval ? "approved" : "denied") : "pending"
              } as PatientCase;
            } catch (error) {
              console.error(`Error fetching data for patient ${patientUser.id}:`, error);
              return null;
            }
          });
          
          const patientCases = (await Promise.all(patientCasesPromises)).filter(Boolean) as PatientCase[];
          console.log("Processed patient cases:", patientCases);
          
          // If we got data from the API, use it
          if (patientCases && patientCases.length > 0) {
            setPatients(patientCases);
          } else {
            // Use mock data if no real patient data is available
            console.log("No patient data available, using mock data");
            setPatients(mockPatientCases);
          }
        } else {
          // Use mock data if API call was unsuccessful or returned invalid data
          console.log("Invalid API response, using mock data");
          setPatients(mockPatientCases);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        setError("Failed to load patient data. Using sample data instead.");
        toast.error("Failed to load patient data. Using sample data.");
        
        // Fall back to mock data
        setPatients(mockPatientCases);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSelectPatient = (id: string) => {
    setSelectedPatient(id);
  };

  const handleApproveTPA = async () => {
    if (!selectedPatient || !diagnosis || !treatment_plan) {
      toast.error("Please provide diagnosis and treatment details");
      return;
    }

    try {
      setLoading(true);
      const treatmentList = treatment_plan.split('\n').filter(line => line.trim() !== '');
      
      // Update local state first for immediate UI feedback
      setPatients(prev => 
        prev.map(p => 
          p.id === selectedPatient 
            ? { 
                ...p, 
                status: "approved",
                consultations: [{
                  neurologist_notes: diagnosis,
                  diagnosis: diagnosis,
                  treatment_plan: treatmentList.join(", ")
                }]
              } 
            : p
        )
      );
      
      const response = await patientService.createConsultation(selectedPatient, {
        tpa_approval: true,
        diagnosis: diagnosis, treatment_plan: treatmentList.join(", "), }
      )
        
      console.log("TPA approved response:", response);
      toast.success("TPA administration approved");
      setSelectedPatient(null);
      setDiagnosis("");
      setTreatmentPlan("");
      setTPApproval(true);
    } catch (error) {
      console.error("Failed to approve TPA:", error);
      toast.error("Failed to approve TPA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDenyTPA = async () => {
    if (!selectedPatient || !diagnosis || !treatment_plan) {
      toast.error("Please provide diagnosis and treatment details");
      return;
    }

    try {
      setLoading(true);
      const treatmentList = treatment_plan.split('\n').filter(line => line.trim() !== '');
      
      // Update local state first for immediate UI feedback
      setPatients(prev => 
        prev.map(p => 
          p.id === selectedPatient 
            ? { 
                ...p, 
                status: "denied",
                consultations: [{
                  neurologist_notes: diagnosis,
                  diagnosis: diagnosis,
                  treatment_plan: treatmentList.join(", ")
                }]
              } 
            : p
        )
      );
      
      
      const response = await patientService.createConsultation(selectedPatient, {
        tpa_approval: false,
        diagnosis: diagnosis, treatment_plan: treatmentList.join(", "), }
      )
      console.log("TPA denied response:", response);
      
      toast.success("TPA administration denied");
      setSelectedPatient(null);
      setDiagnosis("");
      setTreatmentPlan("");
      setTPApproval(false);
    } catch (error) {
      console.error("Failed to deny TPA:", error);
      toast.error("Failed to deny TPA. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const pendingPatients = patients.filter(p => p.status === "pending");
  const reviewedPatients = patients.filter(p => p.status === "approved" || p.status === "denied");

  // Get the selected patient object or null
  const selectedPatientObj = selectedPatient 
    ? patients.find(p => p.id === selectedPatient) 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Neurologist Dashboard
        </h1>

        {loading && (
          <div className="flex justify-center my-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Reviews ({pendingPatients.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed Cases ({reviewedPatients.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingPatients.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No pending cases to review</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Patient Cases
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {pendingPatients.map((patient) => (
                          <div 
                            key={patient.id}
                            className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                              selectedPatient === patient.id ? "border-purple-500 bg-purple-50" : ""
                            }`}
                            onClick={() => handleSelectPatient(patient.id)}
                          >
                            <p className="font-medium">{patient.patientData.name}</p>
                            <p className="text-sm text-gray-500">
                              {patient.patientData.age} years, {patient.patientData.gender}
                            </p>
                            <p className="text-sm text-gray-700 mt-1 truncate">
                              {patient.patientData.chief_complaint}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  {selectedPatientObj ? (
                    <div className="space-y-4">
                      <ConsultationCard 
                        patientData={mapPatientDataToCardFormat(selectedPatientObj.patientData)}
                        labData={selectedPatientObj.labData}
                      />
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Clinical Assessment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Alert className="mb-4">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              <p className="font-medium mb-1">tPA Recommendation Guidelines:</p>
                              <p className="text-sm">Consider approving tPA for ischemic stroke patients presenting within 4.5 hours of symptom onset with no contraindications. Deny tPA for patients with hemorrhagic stroke, significant bleeding risk, recent major surgery, or coagulation abnormalities.</p>
                            </AlertDescription>
                          </Alert>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Diagnosis</label>
                            <Textarea 
                              placeholder="Enter diagnosis"
                              value={diagnosis}
                              onChange={(e) => setDiagnosis(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Treatment Plan (one per line)</label>
                            <Textarea 
                              placeholder="Enter treatment plan"
                              value={treatment_plan}
                              onChange={(e) => setTreatmentPlan(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                          
                          <div className="flex gap-4 pt-2">
                            <Button 
                              onClick={handleApproveTPA}
                              className="flex-1"
                              variant="default"
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 h-4 w-4" />
                              )}
                              Approve TPA
                            </Button>
                            <Button 
                              onClick={handleDenyTPA}
                              className="flex-1"
                              variant="destructive"
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <X className="mr-2 h-4 w-4" />
                              )}
                              Deny TPA
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500">Select a patient case from the list to review</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-4 mt-4">
            {reviewedPatients.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No reviewed cases yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewedPatients.map((patient) => (
                  <ConsultationCard
                    key={patient.id}
                    patientData={mapPatientDataToCardFormat(patient.patientData)}
                    labData={patient.labData}
                    
                    className={`border-l-4 ${patient.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NeurologistDashboard;
