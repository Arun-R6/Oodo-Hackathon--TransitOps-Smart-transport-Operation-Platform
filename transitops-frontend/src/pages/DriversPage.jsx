import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { driverApi } from "../api/services";
import { Plus, Pencil, Trash2, Search, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = ["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"];
const emptyForm = { name: "", licenseNumber: "", licenseCategory: "", licenseExpiry: "", contactNumber: "", safetyScore: 100, status: "AVAILABLE" };

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const load = () => driverApi.getAll().then(r => setDrivers(r.data)).catch(() => toast.error("Failed to load drivers"));
  useEffect(() => { load(); }, []);

  const isExpired = (date) => date && new Date(date) < new Date();
  const isExpiringSoon = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  };

  const openCreate = () => { setForm(emptyForm); setModal("create"); };
  const openEdit = (d) => { setForm({ ...d, licenseExpiry: d.licenseExpiry || "" }); setModal("edit"); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === "create") await driverApi.create(form);
      else await driverApi.update(form.id, form);
      toast.success(`Driver ${modal === "create" ? "created" : "updated"}`);
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this driver?")) return;
    try { await driverApi.delete(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  const filtered = drivers.filter(d =>
    (!search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.licenseNumber?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || d.status === filterStatus)
  );

  return (
    <Layout title="Driver Management">
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}>
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Name", "License No.", "Category", "Expiry", "Contact", "Safety Score", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No drivers found</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 font-mono">{d.licenseNumber}</td>
                <td className="px-4 py-3">{d.licenseCategory}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 ${isExpired(d.licenseExpiry) ? "text-red-500" : isExpiringSoon(d.licenseExpiry) ? "text-yellow-500" : ""}`}>
                    {(isExpired(d.licenseExpiry) || isExpiringSoon(d.licenseExpiry)) && <AlertTriangle size={14} />}
                    {d.licenseExpiry}
                  </span>
                </td>
                <td className="px-4 py-3">{d.contactNumber}</td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${d.safetyScore >= 80 ? "text-green-600" : d.safetyScore >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                    {d.safetyScore}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(d)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded text-blue-600"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Add Driver" : "Edit Driver"} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">License Number *</label>
                <input className="input" value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} required />
              </div>
              <div>
                <label className="label">License Category</label>
                <input className="input" placeholder="e.g. Class A, B, C" value={form.licenseCategory} onChange={e => setForm({ ...form, licenseCategory: e.target.value })} />
              </div>
              <div>
                <label className="label">License Expiry *</label>
                <input type="date" className="input" value={form.licenseExpiry} onChange={e => setForm({ ...form, licenseExpiry: e.target.value })} required />
              </div>
              <div>
                <label className="label">Contact Number</label>
                <input className="input" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} />
              </div>
              <div>
                <label className="label">Safety Score (0-100)</label>
                <input type="number" min="0" max="100" className="input" value={form.safetyScore} onChange={e => setForm({ ...form, safetyScore: e.target.value })} />
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
