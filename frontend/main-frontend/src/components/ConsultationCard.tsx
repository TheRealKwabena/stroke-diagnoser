
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Heart, Stethoscope } from "lucide-react";

interface ConsultationCardProps {
  patientData: {
    name: string;
    age: string;
    sex: string;
    chiefComplaint: string;
    medicalHistory: string;
    bloodPressure:string;
    heartRate: number;
    respiratoryRate: string;
  };
  labData: {
    cbc: string;
    bmp_glucose: number;
    creatinine: number;
    coagulation: string;
  };
  
  className?: string;
}

export const ConsultationCard = ({
  patientData,
  labData,
  
  className
}: ConsultationCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Remote Neurologist Consultation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Information */}
        <div className="space-y-2">
          <h3 className="font-semibold">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{patientData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">{patientData.age} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sex</p>
              <p className="font-medium">{patientData.sex}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chief Complaint</p>
              <p className="font-medium">{patientData.chiefComplaint}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Pressure</p>
              <p className="font-medium">{patientData.bloodPressure}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Heart Rate</p>
              <p className="font-medium">{patientData.heartRate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Respiratory Rate</p>
              <p className="font-medium">{patientData.respiratoryRate}</p>
            </div>
          </div>
        </div>

        {/* Lab Results */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Lab Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">CBC</p>
              <p className="font-medium">{labData.cbc}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">BMP Glucose</p>
              <p className="font-medium">{labData.bmp_glucose} mg/dL</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Creatinine</p>
              <p className="font-medium">{labData.creatinine} mg/dL</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coagulation</p>
              <p className="font-medium">{labData.coagulation}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis and Treatment */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Diagnosis and Treatment
          </h3>
          
        </div>
      </CardContent>
    </Card>
  );
};
