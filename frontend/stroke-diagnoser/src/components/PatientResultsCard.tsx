import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Heart, Hospital, FileImage, Check, X, Syringe, Droplet } from 'lucide-react'

interface PatientResults {
  labResults: {
    cbc: string;
    bmp: string;
    coagulation: string;
  };
  imaging: string;
  diagnosis: string;
  treatment: string[];
}

interface PatientResultsCardProps {
  results: PatientResults;
}

export const PatientResultsCard = ({ results }: PatientResultsCardProps) => {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Patient Results Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Lab Results
          </h3>
          <div className="grid gap-2 pl-6">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>CBC: {results.labResults.cbc}</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-500" />
              <span>BMP: {results.labResults.bmp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Coagulation studies: {results.labResults.coagulation}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Imaging Studies
          </h3>
          <div className="pl-6">
            {results.imaging}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Diagnosis
          </h3>
          <div className="pl-6">
            {results.diagnosis}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Hospital className="h-4 w-4" />
            Treatment Plan
          </h3>
          <div className="grid gap-2 pl-6">
            {results.treatment.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index === 0 && <Syringe className="h-4 w-4 text-blue-500" />}
                {index === 1 && <Droplet className="h-4 w-4 text-red-500" />}
                {index === 2 && <Hospital className="h-4 w-4 text-purple-500" />}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
