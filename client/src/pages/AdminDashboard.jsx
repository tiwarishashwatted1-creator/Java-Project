import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api.js";

export default function AdminDashboard() {
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState({ course:"", status:"", year:"", q:"" });

  const load = async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => v && params.append(k,v));
    const res = await API.get(`/students?${params.toString()}`);
    setList(res.data);
  };

  useEffect(() => { load() }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Admin Dashboard</h1>
      <div className="bg-white p-3 rounded-xl shadow mb-3 grid md:grid-cols-5 gap-2">
        <input className="border p-2 rounded" placeholder="Course" value={filters.course} onChange={e=>setFilters({...filters, course:e.target.value})} />
        <select className="border p-2 rounded" value={filters.status} onChange={e=>setFilters({...filters, status:e.target.value})}>
          <option value="">Any status</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input className="border p-2 rounded" placeholder="Year" value={filters.year} onChange={e=>setFilters({...filters, year:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Search name/email" value={filters.q} onChange={e=>setFilters({...filters, q:e.target.value})} />
        <button onClick={load} className="bg-blue-600 text-white rounded px-4">Apply</button>
      </div>

      <div className="flex gap-2 mb-3">
        <a className="bg-gray-800 text-white px-3 py-2 rounded" href={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/reports/export.csv`} target="_blank">Export CSV</a>
        <a className="bg-gray-800 text-white px-3 py-2 rounded" href={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/reports/export.xml`} target="_blank">Export XML</a>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Course/Year</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s._id} className="border-t">
                <td className="px-3 py-2">{s.firstName} {s.lastName}</td>
                <td className="px-3 py-2">{s.email}</td>
                <td className="px-3 py-2">{s.course} / {s.year}</td>
                <td className="px-3 py-2 uppercase">{s.status}</td>
                <td className="px-3 py-2">
                  <Link className="text-blue-600 underline" to={`/review/${s._id}`}>Review</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
