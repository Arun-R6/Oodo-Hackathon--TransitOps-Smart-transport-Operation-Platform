import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { vehicleApi } from "../api/services";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"];
const TYPES = ["Truck", "Van", "Bus", "Motorcycle", "Car", "Trailer"];

const emptyForm = { registrationNumber: "", name: "", type: "", maxLoadCapacity: "", odometer: "", acquisitionCost: "", region: "", status: "AVAILABLE" };

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  const load = () => vehicleApi.getAll().then(r => setVehicles(r.data)).catch(() => toast.error("Failed to load vehicles"));

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setModal("create"); };
  const openEdit = (v) => { setForm({ ...v, maxLoadCapacity: v.maxLoadCapacity ?? "", odometer: v.odometer ?? "", acquisitionCost: v.acquisitionCost ?? "" }); setModal("edit"); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === "create") await vehicleApi.create(form);
      else await vehicleApi.update(form.id, form);
      toast.success(`Vehicle ${modal === "create" ? "created" : "updated"}`);
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this vehicle?")) return;
    try { await vehicleApi.delete(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  const filtered = vehicles.filter(v =>
    (!search || v.registrationNumber?.toLowerCase().includes(search.toLowerCase()) || v.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || v.status === filterStatus) &&
    (!filterType || v.type === filterType)
  );

  return (
    <Layout title="Vehicle Registry">
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="input w-36" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}>
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Reg. Number", "Name", "Type", "Capacity (kg)", "Odometer", "Region", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No vehicles found</td></tr>
            ) : filtered.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono font-medium">{v.registrationNumber}</td>
                <td className="px-4 py-3">{v.name}</td>
                <td className="px-4 py-3">{v.type}</td>
                <td className="px-4 py-3">{v.maxLoadCapacity}</td>
                <td className="px-4 py-3">{v.odometer?.toLocaleString()} km</td>
                <td className="px-4 py-3">{v.region}</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(v)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded text-blue-600"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(v.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Add Vehicle" : "Edit Vehicle"} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Registration Number *</label>
                <input className="input" value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} required />
              </div>
              <div>
                <label className="label">Name/Model *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="">Select type</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Max Load (kg)</label>
                <input type="number" className="input" value={form.maxLoadCapacity} onChange={e => setForm({ ...form, maxLoadCapacity: e.target.value })} />
              </div>
              <div>
                <label className="label">Odometer (km)</label>
                <input type="number" className="input" value={form.odometer} onChange={e => setForm({ ...form, odometer: e.target.value })} />
              </div>
              <div>
                <label className="label">Acquisition Cost ($)</label>
                <input type="number" className="input" value={form.acquisitionCost} onChange={e => setForm({ ...form, acquisitionCost: e.target.value })} />
              </div>
              <div>
                <label className="label">Region</label>
                <input className="input" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
              </div>
              {modal === "edit" && (
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
