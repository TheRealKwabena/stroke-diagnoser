
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

type VitalAlert = {
  type: string;
  value: number;
  threshold: number;
  unit: string;
}

interface AlertBannerProps {
  alerts: VitalAlert[];
}

export const AlertBanner = ({ alerts }: AlertBannerProps) => {
  return (
    <div className="grid gap-4 p-4">
      {alerts.map((alert, index) => (
        <Alert key={index} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical {alert.type}</AlertTitle>
          <AlertDescription>
            Current value: {alert.value}{alert.unit} (Threshold: {alert.threshold}{alert.unit})
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
