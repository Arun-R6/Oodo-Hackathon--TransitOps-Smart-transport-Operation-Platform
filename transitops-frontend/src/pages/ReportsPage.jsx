import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { analyticsApi } from "../api/services";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getVehicleAnalytics()
      .then(r => setAnalytics(r.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  const chartData = analytics.map(v => ({
    name: v.registrationNumber,
    fuel: v.fuelCost,
    maintenance: v.maintenanceCost,
    other: v.otherExpenses,
    efficiency: v.fuelEfficiency,
    roi: v.roi,
  }));

  if (loading) return <Layout title="Reports & Analytics"><div className="text-center py-20 text-gray-400">Loading...</div></Layout>;

  return (
    <Layout title="Reports & Analytics">
      <div className="flex justify-end mb-6">
        <button className="btn-primary flex items-center gap-2" onClick={analyticsApi.exportCsv}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Operational Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="fuel" name="Fuel ($)" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="maintenance" name="Maintenance ($)" fill="#f59e0b" stackId="a" />
              <Bar dataKey="other" name="Other ($)" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Fuel Efficiency (km/L)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="efficiency" name="km/L" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-4">Vehicle ROI (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="roi" name="ROI (%)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold">Vehicle Analytics Summary</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Vehicle", "Reg. No.", "Fuel Cost", "Maint. Cost", "Other", "Total Cost", "Distance", "Efficiency", "ROI"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {analytics.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400">No analytics data</td></tr>
            ) : analytics.map(v => (
              <tr key={v.vehicleId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{v.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{v.registrationNumber}</td>
                <td className="px-4 py-3">${v.fuelCost?.toFixed(2)}</td>
                <td className="px-4 py-3">${v.maintenanceCost?.toFixed(2)}</td>
                <td className="px-4 py-3">${v.otherExpenses?.toFixed(2)}</td>
                <td className="px-4 py-3 font-medium">${v.totalOperationalCost?.toFixed(2)}</td>
                <td className="px-4 py-3">{v.totalDistance?.toFixed(1)} km</td>
                <td className="px-4 py-3">{v.fuelEfficiency} km/L</td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${v.roi >= 0 ? "text-green-600" : "text-red-600"}`}>{v.roi}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
