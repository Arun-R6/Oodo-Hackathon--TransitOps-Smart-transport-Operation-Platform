import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { maintenanceApi, vehicleApi } from "../api/services";
import { Plus, CheckCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const emptyForm = { vehicle: { id: "" }, description: "", cost: "", startDate: "", endDate: "" };

export default function MaintenancePage() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => maintenanceApi.getAll().then(r => setLogs(r.data)).catch(() => toast.error("Failed to load maintenance logs"));

  useEffect(() => {
    load();
    vehicleApi.getAll().then(r => setVehicles(r.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await maintenanceApi.create(form);
      toast.success("Maintenance record created. Vehicle set to In Shop.");
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create record");
    }
  };

  const handleClose = async (id) => {
    try { await maintenanceApi.close(id); toast.success("Maintenance closed. Vehicle restored to Available."); load(); }
    catch (err) { toast.error(err.response?.data?.error || "Failed to close"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    try { await maintenanceApi.delete(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <Layout title="Maintenance">
      <div className="flex justify-end mb-6">
        <button className="btn-primary flex items-center gap-2" onClick={() => { setForm(emptyForm); setModal(true); }}>
          <Plus size={16} /> Add Maintenance Record
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Vehicle", "Description", "Cost ($)", "Start Date", "End Date", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {logs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No maintenance records</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono font-medium">{log.vehicle?.registrationNumber}</td>
                <td className="px-4 py-3">{log.description}</td>
                <td className="px-4 py-3">{log.cost}</td>
                <td className="px-4 py-3">{log.startDate}</td>
                <td className="px-4 py-3">{log.endDate || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${log.closed ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                    {log.closed ? "Closed" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {!log.closed && (
                      <button onClick={() => handleClose(log.id)} title="Close" className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/30 rounded text-green-600"><CheckCircle size={15} /></button>
                    )}
                    <button onClick={() => handleDelete(log.id)} title="Delete" className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Add Maintenance Record" onClose={() => setModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Vehicle *</label>
              <select className="input" value={form.vehicle.id} onChange={e => setForm({ ...form, vehicle: { id: e.target.value } })} required>
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name} ({v.status})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Description *</label>
              <input className="input" placeholder="e.g. Oil Change, Brake Repair" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Cost ($)</label>
                <input type="number" className="input" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
              </div>
              <div>
                <label className="label">Start Date *</label>
                <input type="date" className="input" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
              </div>
              <div>
                <label className="label">End Date</label>
                <input type="date" className="input" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">⚠ Creating this record will automatically set the vehicle status to "In Shop"</p>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create Record</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
