import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { tripApi, vehicleApi, driverApi } from "../api/services";
import { Plus, Play, CheckCircle, XCircle, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

const emptyForm = { source: "", destination: "", cargoWeight: "", plannedDistance: "", vehicle: { id: "" }, driver: { id: "" } };

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [completeForm, setCompleteForm] = useState({ finalOdometer: "", fuelConsumed: "" });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const load = () => tripApi.getAll().then(r => setTrips(r.data)).catch(() => toast.error("Failed to load trips"));

  useEffect(() => {
    load();
    vehicleApi.getAvailable().then(r => setVehicles(r.data));
    driverApi.getAvailable().then(r => setDrivers(r.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await tripApi.create(form);
      toast.success("Trip created");
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create trip");
    }
  };

  const handleDispatch = async (id) => {
    try { await tripApi.dispatch(id); toast.success("Trip dispatched"); load(); }
    catch (err) { toast.error(err.response?.data?.error || "Dispatch failed"); }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    try {
      await tripApi.complete(selectedTrip.id, completeForm);
      toast.success("Trip completed");
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Complete failed");
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this trip?")) return;
    try { await tripApi.cancel(id); toast.success("Trip cancelled"); load(); }
    catch (err) { toast.error(err.response?.data?.error || "Cancel failed"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this trip?")) return;
    try { await tripApi.delete(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  const filtered = trips.filter(t =>
    (!search || t.source?.toLowerCase().includes(search.toLowerCase()) || t.destination?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || t.status === filterStatus)
  );

  return (
    <Layout title="Trip Management">
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"].map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setForm(emptyForm); setModal("create"); }}>
          <Plus size={16} /> New Trip
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Route", "Vehicle", "Driver", "Cargo (kg)", "Distance", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No trips found</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3">
                  <div className="font-medium">{t.source} → {t.destination}</div>
                  <div className="text-xs text-gray-400">{t.createdAt?.split("T")[0]}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{t.vehicle?.registrationNumber}</td>
                <td className="px-4 py-3">{t.driver?.name}</td>
                <td className="px-4 py-3">{t.cargoWeight}</td>
                <td className="px-4 py-3">{t.actualDistance ?? t.plannedDistance} km</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {t.status === "DRAFT" && (
                      <button onClick={() => handleDispatch(t.id)} title="Dispatch" className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded text-blue-600"><Play size={15} /></button>
                    )}
                    {t.status === "DISPATCHED" && (
                      <button onClick={() => { setSelectedTrip(t); setCompleteForm({ finalOdometer: "", fuelConsumed: "" }); setModal("complete"); }} title="Complete" className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/30 rounded text-green-600"><CheckCircle size={15} /></button>
                    )}
                    {(t.status === "DRAFT" || t.status === "DISPATCHED") && (
                      <button onClick={() => handleCancel(t.id)} title="Cancel" className="p-1.5 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded text-yellow-600"><XCircle size={15} /></button>
                    )}
                    <button onClick={() => handleDelete(t.id)} title="Delete" className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "create" && (
        <Modal title="Create Trip" onClose={() => setModal(null)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Source *</label>
                <input className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} required />
              </div>
              <div>
                <label className="label">Destination *</label>
                <input className="input" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required />
              </div>
              <div>
                <label className="label">Vehicle *</label>
                <select className="input" value={form.vehicle.id} onChange={e => setForm({ ...form, vehicle: { id: e.target.value } })} required>
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name} ({v.maxLoadCapacity}kg)</option>)}
                </select>
              </div>
              <div>
                <label className="label">Driver *</label>
                <select className="input" value={form.driver.id} onChange={e => setForm({ ...form, driver: { id: e.target.value } })} required>
                  <option value="">Select driver</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name} - {d.licenseNumber}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Cargo Weight (kg)</label>
                <input type="number" className="input" value={form.cargoWeight} onChange={e => setForm({ ...form, cargoWeight: e.target.value })} />
              </div>
              <div>
                <label className="label">Planned Distance (km)</label>
                <input type="number" className="input" value={form.plannedDistance} onChange={e => setForm({ ...form, plannedDistance: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Create Trip</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "complete" && (
        <Modal title="Complete Trip" onClose={() => setModal(null)}>
          <form onSubmit={handleComplete} className="space-y-4">
            <p className="text-sm text-gray-500">{selectedTrip?.source} → {selectedTrip?.destination}</p>
            <div>
              <label className="label">Final Odometer (km)</label>
              <input type="number" className="input" value={completeForm.finalOdometer} onChange={e => setCompleteForm({ ...completeForm, finalOdometer: e.target.value })} />
            </div>
            <div>
              <label className="label">Fuel Consumed (liters)</label>
              <input type="number" className="input" value={completeForm.fuelConsumed} onChange={e => setCompleteForm({ ...completeForm, fuelConsumed: e.target.value })} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Complete Trip</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
