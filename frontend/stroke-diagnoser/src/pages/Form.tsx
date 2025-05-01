import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Form() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    chiefComplaint: '',
    medicalHistory: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/results', { state: { formData } });
  };

  return (
    <div className="container mx-auto py-8 ">
      <Card className="max-w-2xl mx-auto p-6 shadow-md shadow-indigo-300">
        <h2 className="text-2xl font-semibold mb-6">Patient Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="40"
              value={formData.age}
              onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="sex">Sex</Label>
            <Select
              value={formData.sex}
              onValueChange={value => setFormData(prev => ({ ...prev, sex: value }))}>
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
              value={formData.chiefComplaint}
              onChange={e => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              placeholder="Migraines, depression"
              value={formData.medicalHistory}
              onChange={e => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Card>
    </div>
  );
}
