import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { analyticsApi } from "../api/services";
import { Truck, Users, MapPin, Wrench, Activity, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import toast from "react-hot-toast";

const KpiCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    Promise.all([analyticsApi.getDashboard(), analyticsApi.getVehicleAnalytics()])
      .then(([d, a]) => { setData(d.data); setAnalytics(a.data); })
      .catch(() => toast.error("Failed to load dashboard"));
  }, []);

  if (!data) return <Layout title="Dashboard"><div className="text-center py-20 text-gray-400">Loading...</div></Layout>;

  const pieData = [
    { name: "Available", value: data.availableVehicles },
    { name: "On Trip", value: data.activeVehicles },
    { name: "In Shop", value: data.vehiclesInMaintenance },
    { name: "Other", value: Math.max(0, data.totalVehicles - data.availableVehicles - data.activeVehicles - data.vehiclesInMaintenance) },
  ].filter(d => d.value > 0);

  const topVehicles = analytics.slice(0, 6).map(v => ({
    name: v.registrationNumber,
    cost: v.totalOperationalCost,
    efficiency: v.fuelEfficiency,
  }));

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Truck} label="Active Vehicles" value={data.activeVehicles} color="bg-blue-500" />
        <KpiCard icon={Truck} label="Available Vehicles" value={data.availableVehicles} color="bg-green-500" />
        <KpiCard icon={Wrench} label="In Maintenance" value={data.vehiclesInMaintenance} color="bg-yellow-500" />
        <KpiCard icon={MapPin} label="Active Trips" value={data.activeTrips} color="bg-purple-500" />
        <KpiCard icon={MapPin} label="Pending Trips" value={data.pendingTrips} color="bg-orange-500" />
        <KpiCard icon={Users} label="Drivers On Duty" value={data.driversOnDuty} color="bg-indigo-500" />
        <KpiCard icon={Activity} label="Fleet Utilization" value={`${data.fleetUtilization}%`} color="bg-teal-500" />
        <KpiCard icon={TrendingUp} label="Total Vehicles" value={data.totalVehicles} color="bg-gray-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Fleet Status Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-10">No vehicle data</p>}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Operational Cost by Vehicle</h3>
          {topVehicles.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topVehicles}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="cost" fill="#3b82f6" name="Cost ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-10">No analytics data</p>}
        </div>
      </div>
    </Layout>
  );
}
