
import { useLocation } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertBanner } from "@/components/AlertBanner";
import { Users, Brain, Activity, AlertTriangle, FileText, Heart, Stethoscope } from 'lucide-react';
import { StatsCard } from "@/components/StatsCard";
import { ConsultationCard } from "@/components/ConsultationCard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, 
  Line, PieChart, Pie, Cell 
} from 'recharts';

interface DashboardProps {
  userRole?: 'technician' | 'neurologist';
}

const Dashboard = ({ userRole = 'technician' }: DashboardProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const patientInfo = location.state?.completeData?.patientData;
  const labData = location.state?.completeData?.labData;
  const diagnosis = location.state?.completeData?.diagnosis;

  const criticalVitals = [
    { type: "Blood Pressure", value: 180, threshold: 140, unit: "mmHg" },
    { type: "Heart Rate", value: 120, threshold: 100, unit: "bpm" }
  ]

  const statsData = {
    totalPatients: 1543,
    strokeTypes: {
      ischemic: 245,
      hemorrhagic: 98
    },
    criticalCases: 12,
    averageAge: 62
  }

  const patientStatsData = [
    { name: 'Jan', patients: 400 },
    { name: 'Feb', patients: 300 },
    { name: 'Mar', patients: 500 },
    { name: 'Apr', patients: 280 },
    { name: 'May', patients: 590 },
    { name: 'Jun', patients: 320 }
  ]

  const strokeTypeData = [
    { name: 'Ischemic', value: statsData.strokeTypes.ischemic },
    { name: 'Hemorrhagic', value: statsData.strokeTypes.hemorrhagic }
  ]

  const COLORS = ['#9b87f5', '#7E69AB']

  const neuralActivityData = [
    { name: 'Mon', activity: 12 },
    { name: 'Tue', activity: 19 },
    { name: 'Wed', activity: 15 },
    { name: 'Thu', activity: 22 },
    { name: 'Fri', activity: 25 },
    { name: 'Sat', activity: 10 },
    { name: 'Sun', activity: 5 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {userRole === 'neurologist' ? 'Neurologist Dashboard' : 'Technician Dashboard'}
        </h1>

        {patientInfo && (
          <ConsultationCard
            patientData={patientInfo}
            labData={labData}
            diagnosis={diagnosis}
            className="mb-6"
          />
        )}

        <AlertBanner alerts={criticalVitals} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Patients"
            value={statsData.totalPatients}
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Stroke Cases"
            value={statsData.strokeTypes.ischemic + statsData.strokeTypes.hemorrhagic}
            description="Total stroke cases this month"
            icon={<Brain className="h-4 w-4" />}
          />
          <StatsCard
            title="Critical Cases"
            value={statsData.criticalCases}
            description="Patients requiring immediate attention"
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <StatsCard
            title="Average Age"
            value={statsData.averageAge}
            description="Years"
            icon={<Activity className="h-4 w-4" />}
          />
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Statistics</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Stroke Types Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={strokeTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {strokeTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {userRole === 'neurologist' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Neural Activity Patterns</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={neuralActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="activity" stroke="#9b87f5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {userRole === 'technician' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Equipment Status</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'MRI', status: 95 },
                    { name: 'CT', status: 88 },
                    { name: 'EEG', status: 92 },
                    { name: 'X-Ray', status: 85 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="status" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
