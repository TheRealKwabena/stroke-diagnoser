
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Form() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patient");
  const [showLabForm, setShowLabForm] = useState(false);
  
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    sex: '',
    chiefComplaint: '',
    medicalHistory: ''
  });

  const [labData, setLabData] = useState({
    cbc: '',
    bmp_glucose: 0,
    creatinine: 0,
    coagulation: '',
  });

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLabForm(true);
    setActiveTab("labs");
  };

  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine both forms' data and navigate to dashboard
    const completeData = {
      patientData,
      labData,
      diagnosis: {
        condition: "Acute ischemic stroke",
        treatment: [
          "tPA administration",
          "blood pressure management",
          "admission to the ICU for close monitoring"
        ]
      }
    };
    
    navigate('/dashboard', { state: { completeData } });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient Information</TabsTrigger>
            <TabsTrigger value="labs" disabled={!showLabForm}>Lab Results</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <form onSubmit={handlePatientSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Maria Rodriguez"
                  value={patientData.name}
                  onChange={e => setPatientData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="40"
                  value={patientData.age}
                  onChange={e => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sex">Sex</Label>
                <Select
                  value={patientData.sex}
                  onValueChange={value => setPatientData(prev => ({ ...prev, sex: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Textarea
                  id="chiefComplaint"
                  placeholder="Sudden onset of headache and confusion"
                  value={patientData.chiefComplaint}
                  onChange={e => setPatientData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Migraines, depression"
                  value={patientData.medicalHistory}
                  onChange={e => setPatientData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full">Continue to Lab Results</Button>
            </form>
          </TabsContent>

          <TabsContent value="labs">
            <form onSubmit={handleLabSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cbc">CBC Results</Label>
                <Select 
                  value={labData.cbc} 
                  onValueChange={(value) => setLabData(prev => ({ ...prev, cbc: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CBC result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="abnormal">Abnormal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bmp_glucose">BMP Glucose (mg/dL)</Label>
                <Input
                  id="bmp_glucose"
                  type="number"
                  step="0.1"
                  value={labData.bmp_glucose}
                  onChange={(e) => setLabData(prev => ({ ...prev, bmp_glucose: parseFloat(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                <Input
                  id="creatinine"
                  type="number"
                  step="0.1"
                  value={labData.creatinine}
                  onChange={(e) => setLabData(prev => ({ ...prev, creatinine: parseFloat(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="coagulation">Coagulation Studies</Label>
                <Select 
                  value={labData.coagulation} 
                  onValueChange={(value) => setLabData(prev => ({ ...prev, coagulation: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coagulation result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="abnormal">Abnormal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Submit and View Results</Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
