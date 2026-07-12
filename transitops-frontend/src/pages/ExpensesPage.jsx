import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { expenseApi, vehicleApi, tripApi } from "../api/services";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const emptyFuel = { vehicle: { id: "" }, trip: null, liters: "", cost: "", date: "" };
const emptyExpense = { vehicle: { id: "" }, trip: null, category: "", description: "", amount: "", date: "" };
const CATEGORIES = ["Toll", "Parking", "Repair", "Insurance", "Other"];

export default function ExpensesPage() {
  const [tab, setTab] = useState("fuel");
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [modal, setModal] = useState(false);
  const [fuelForm, setFuelForm] = useState(emptyFuel);
  const [expForm, setExpForm] = useState(emptyExpense);

  const loadFuel = () => expenseApi.getAllFuel().then(r => setFuelLogs(r.data));
  const loadExp = () => expenseApi.getAll().then(r => setExpenses(r.data));

  useEffect(() => {
    loadFuel(); loadExp();
    vehicleApi.getAll().then(r => setVehicles(r.data));
    tripApi.getAll().then(r => setTrips(r.data));
  }, []);

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    try {
      await expenseApi.createFuel({ ...fuelForm, trip: fuelForm.trip?.id ? fuelForm.trip : null });
      toast.success("Fuel log added"); setModal(false); loadFuel();
    } catch { toast.error("Failed to add fuel log"); }
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    try {
      await expenseApi.create({ ...expForm, trip: expForm.trip?.id ? expForm.trip : null });
      toast.success("Expense added"); setModal(false); loadExp();
    } catch { toast.error("Failed to add expense"); }
  };

  const deleteFuel = async (id) => {
    if (!confirm("Delete?")) return;
    await expenseApi.deleteFuel(id); loadFuel();
  };

  const deleteExp = async (id) => {
    if (!confirm("Delete?")) return;
    await expenseApi.delete(id); loadExp();
  };

  return (
    <Layout title="Fuel & Expenses">
      <div className="flex gap-2 mb-6">
        <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${tab === "fuel" ? "bg-blue-600 text-white" : "btn-secondary"}`} onClick={() => setTab("fuel")}>Fuel Logs</button>
        <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${tab === "expenses" ? "bg-blue-600 text-white" : "btn-secondary"}`} onClick={() => setTab("expenses")}>Other Expenses</button>
        <div className="flex-1" />
        <button className="btn-primary flex items-center gap-2" onClick={() => setModal(true)}>
          <Plus size={16} /> Add {tab === "fuel" ? "Fuel Log" : "Expense"}
        </button>
      </div>

      {tab === "fuel" && (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Vehicle", "Trip", "Liters", "Cost ($)", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {fuelLogs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No fuel logs</td></tr>
              ) : fuelLogs.map(f => (
                <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-mono">{f.vehicle?.registrationNumber}</td>
                  <td className="px-4 py-3 text-xs">{f.trip ? `${f.trip.source} → ${f.trip.destination}` : "—"}</td>
                  <td className="px-4 py-3">{f.liters} L</td>
                  <td className="px-4 py-3">${f.cost}</td>
                  <td className="px-4 py-3">{f.date}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteFuel(f.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "expenses" && (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Vehicle", "Category", "Description", "Amount ($)", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {expenses.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No expenses</td></tr>
              ) : expenses.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-mono">{e.vehicle?.registrationNumber}</td>
                  <td className="px-4 py-3"><span className="badge bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">{e.category}</span></td>
                  <td className="px-4 py-3">{e.description}</td>
                  <td className="px-4 py-3">${e.amount}</td>
                  <td className="px-4 py-3">{e.date}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteExp(e.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && tab === "fuel" && (
        <Modal title="Add Fuel Log" onClose={() => setModal(false)}>
          <form onSubmit={handleFuelSubmit} className="space-y-4">
            <div>
              <label className="label">Vehicle *</label>
              <select className="input" value={fuelForm.vehicle.id} onChange={e => setFuelForm({ ...fuelForm, vehicle: { id: e.target.value } })} required>
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Trip (optional)</label>
              <select className="input" value={fuelForm.trip?.id || ""} onChange={e => setFuelForm({ ...fuelForm, trip: e.target.value ? { id: e.target.value } : null })}>
                <option value="">None</option>
                {trips.map(t => <option key={t.id} value={t.id}>{t.source} → {t.destination}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Liters *</label>
                <input type="number" step="0.01" className="input" value={fuelForm.liters} onChange={e => setFuelForm({ ...fuelForm, liters: e.target.value })} required />
              </div>
              <div>
                <label className="label">Cost ($) *</label>
                <input type="number" step="0.01" className="input" value={fuelForm.cost} onChange={e => setFuelForm({ ...fuelForm, cost: e.target.value })} required />
              </div>
              <div>
                <label className="label">Date *</label>
                <input type="date" className="input" value={fuelForm.date} onChange={e => setFuelForm({ ...fuelForm, date: e.target.value })} required />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Add</button>
            </div>
          </form>
        </Modal>
      )}

      {modal && tab === "expenses" && (
        <Modal title="Add Expense" onClose={() => setModal(false)}>
          <form onSubmit={handleExpSubmit} className="space-y-4">
            <div>
              <label className="label">Vehicle *</label>
              <select className="input" value={expForm.vehicle.id} onChange={e => setExpForm({ ...expForm, vehicle: { id: e.target.value } })} required>
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category *</label>
                <select className="input" value={expForm.category} onChange={e => setExpForm({ ...expForm, category: e.target.value })} required>
                  <option value="">Select</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Amount ($) *</label>
                <input type="number" step="0.01" className="input" value={expForm.amount} onChange={e => setExpForm({ ...expForm, amount: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <label className="label">Description</label>
                <input className="input" value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} />
              </div>
              <div>
                <label className="label">Date *</label>
                <input type="date" className="input" value={expForm.date} onChange={e => setExpForm({ ...expForm, date: e.target.value })} required />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Add</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
