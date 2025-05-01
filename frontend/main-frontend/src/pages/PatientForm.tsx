
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
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
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { patientService } from '@/services/patientService';

// Define the schema for vital signs form
const vitalsSchema = z.object({
  chief_complaint: z.string().optional(),
  medical_history: z.string().optional(),
  blood_pressure_systolic: z.string().refine(val => {
    const num = parseInt(val);
    return val === "" || (num >= 0 && !isNaN(num));
  }, "Must be a non-negative number"),
  blood_pressure_diastolic: z.string().refine(val => {
    const num = parseInt(val);
    return val === "" || (num >= 0 && !isNaN(num));
  }, "Must be a non-negative number"),
  heart_rate: z.string().refine(val => {
    const num = parseInt(val);
    return val === "" || (num >= 0 && !isNaN(num));
  }, "Must be a non-negative number"),
  respiratory_rate: z.string().refine(val => {
    const num = parseInt(val);
    return val === "" || (num >= 0 && !isNaN(num));
  }, "Must be a non-negative number"),
  oxygen_saturation: z.string().refine(val => {
    const num = parseInt(val);
    return val === "" || (num >= 0 && !isNaN(num));
  }, "Must be a non-negative number"),
  significant_head_trauma: z.boolean().default(false),
  recent_surgery: z.boolean().default(false),
  recent_myocardial_infarction: z.boolean().default(false),
  recent_hemorrhage: z.boolean().default(false),
  platelet_count: z.string().refine(val => {
    const num = parseInt(val);
    return val === "" || (num >= 0 && !isNaN(num));
  }, "Must be a non-negative number"),
});

// Define the schema for lab results form
const labSchema = z.object({
  cbc: z.string().min(1, "CBC result is required"),
  bmp_glucose: z.string().refine(val => {
    const num = parseFloat(val);
    return val === "" || (num >= 0 && !isNaN(num));
  }, "Must be a non-negative number"),
  creatinine: z.string().refine(val => {
    const num = parseFloat(val);
    return val === "" || (num >= 0 && !isNaN(num));
  }, "Must be a non-negative number"),
  coagulation: z.string().min(1, "Coagulation result is required"),
});

// Types derived from schemas
type VitalsFormValues = z.infer<typeof vitalsSchema>;
type LabFormValues = z.infer<typeof labSchema>;

const PatientForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("patient");
  const [showLabForm, setShowLabForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Initialize the form with react-hook-form and zod resolver
  const vitalsForm = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      chief_complaint: '',
      medical_history: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      heart_rate: '',
      respiratory_rate: '',
      oxygen_saturation: '',
      significant_head_trauma: false,
      recent_surgery: false,
      recent_myocardial_infarction: false,
      recent_hemorrhage: false,
      platelet_count: '',
    }
  });

  const labForm = useForm<LabFormValues>({
    resolver: zodResolver(labSchema),
    defaultValues: {
      cbc: '',
      bmp_glucose: '',
      creatinine: '',
      coagulation: '',
    }
  });

  const onVitalsSubmit = async (data: VitalsFormValues) => {
    console.log("Vitals form data:", data);
    
    try {
      // Format the data for the API
      const vitalsData = {
        chief_complaint: data.chief_complaint || '',
        medical_history: data.medical_history || '',
        blood_pressure_systolic: parseInt(data.blood_pressure_systolic) || 0,
        blood_pressure_diastolic: parseInt(data.blood_pressure_diastolic) || 0,
        heart_rate: parseInt(data.heart_rate) || 0,
        respiratory_rate: parseInt(data.respiratory_rate) || 0,
        oxygen_saturation: parseInt(data.oxygen_saturation) || 0,
        significant_head_trauma: data.significant_head_trauma,
        recent_surgery: data.recent_surgery,
        recent_myocardial_infarction: data.recent_myocardial_infarction,
        recent_hemorrhage: data.recent_hemorrhage,
        platelet_count: parseInt(data.platelet_count) || 0
      };
      
      await patientService.submitVitals(vitalsData);
      toast.success("Vitals information submitted successfully");
      setShowLabForm(true);
      setActiveTab("labs");
    } catch (error) {
      console.error("Error submitting vitals:", error);
      toast.error("Failed to submit vitals. Please try again.");
    }
  };

    


  const onLabSubmit = async (data: LabFormValues) => {
    setSubmitting(true);
    
    try {
      // Format the lab data for the API
      const labData = {
        cbc: data.cbc,
        bmp_glucose: parseFloat(data.bmp_glucose) || 0,
        creatinine: parseFloat(data.creatinine) || 0,
        coagulation: data.coagulation
      };
      
      await patientService.submitLabResults(labData);
      
      toast.success("Your information has been submitted for review");
      navigate('/patient-dashboard');
    } catch (error) {
      console.error("Error submitting lab results:", error);
      toast.error("Failed to submit lab results. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Submit Medical Information</h1>
      <Card className="max-w-2xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Vitals</TabsTrigger>
            <TabsTrigger value="labs" disabled={!showLabForm}>Lab Results</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <Form {...vitalsForm}>
              <form onSubmit={vitalsForm.handleSubmit(onVitalsSubmit)} className="space-y-4">
               

               

                <FormField
                  control={vitalsForm.control}
                  name="chief_complaint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chief Complaint</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your symptoms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={vitalsForm.control}
                  name="medical_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical History</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any past medical conditions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={vitalsForm.control}
                    name="blood_pressure_systolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Pressure (Systolic)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vitalsForm.control}
                    name="blood_pressure_diastolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Pressure (Diastolic)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={vitalsForm.control}
                    name="heart_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heart Rate (bpm)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="75" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vitalsForm.control}
                    name="respiratory_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Respiratory Rate</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="16" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={vitalsForm.control}
                    name="oxygen_saturation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oxygen Saturation (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" placeholder="98" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h3 className="text-lg font-semibold mt-6">Exclusion Criteria</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={vitalsForm.control}
                    name="significant_head_trauma"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Significant Head Trauma</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vitalsForm.control}
                    name="recent_surgery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Recent Surgery</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={vitalsForm.control}
                    name="recent_myocardial_infarction"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Recent Myocardial Infarction</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vitalsForm.control}
                    name="recent_hemorrhage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Recent Hemorrhage</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={vitalsForm.control}
                  name="platelet_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platelet Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="250000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Continue to Lab Results</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="labs">
            <Form {...labForm}>
              <form onSubmit={labForm.handleSubmit(onLabSubmit)} className="space-y-4">
                <FormField
                  control={labForm.control}
                  name="cbc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CBC Results</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select CBC result" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Abnormal">Abnormal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={labForm.control}
                  name="bmp_glucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMP Glucose (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="100" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={labForm.control}
                  name="creatinine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creatinine (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="1.0" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={labForm.control}
                  name="coagulation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coagulation Studies</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select coagulation result" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Abnormal">Abnormal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Submit for Review</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PatientForm;
