import { useEffect, useState } from "react";
import API from "../api.js";

export default function StudentDashboard() {
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({
    firstName:"", lastName:"", dob:"", course:"", year:1,
    email:"", phone:"", address:""
  });
  const [files, setFiles] = useState([]);

  useEffect(() => { API.get("/students/me").then(r => setMe(r.data)) }, []);

  const submitRegistration = async (e) => {
    e.preventDefault();
    const res = await API.post("/students", form);
    setMe(res.data);
  };

  const uploadDocs = async () => {
    if (!me) return;
    const fd = new FormData();
    for (const f of files) fd.append("docs", f);
    const res = await API.post(`/students/${me._id}/docs`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    setMe(res.data);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">My Application</h2>
        {me ? (
          <div className="space-y-1">
            <div><b>Status:</b> <span className="uppercase">{me.status}</span></div>
            <div><b>Name:</b> {me.firstName} {me.lastName}</div>
            <div><b>Course/Year:</b> {me.course} / {me.year}</div>
            <div><b>Email:</b> {me.email}</div>
            <div><b>Docs:</b> {me.docs?.length || 0}</div>
          </div>
        ) : (
          <form onSubmit={submitRegistration} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input className="border p-2 rounded" placeholder="First Name" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} />
              <input className="border p-2 rounded" placeholder="Last Name" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
            </div>
            <input className="border p-2 rounded w-full" type="date" value={form.dob} onChange={e=>setForm({...form, dob:e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input className="border p-2 rounded" placeholder="Course" value={form.course} onChange={e=>setForm({...form, course:e.target.value})} />
              <input className="border p-2 rounded" placeholder="Year (1-5)" type="number" min="1" max="5" value={form.year} onChange={e=>setForm({...form, year:Number(e.target.value)})} />
            </div>
            <input className="border p-2 rounded w-full" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <input className="border p-2 rounded w-full" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
            <textarea className="border p-2 rounded w-full" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Application</button>
          </form>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Documents</h2>
        <input type="file" multiple onChange={e=>setFiles(Array.from(e.target.files))} />
        <div className="text-sm text-gray-500 mb-2">Max 5MB each. Upload after submitting application.</div>
        <button disabled={!me} onClick={uploadDocs} className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50">Upload</button>
        {me?.docs?.length ? (
          <ul className="mt-3 list-disc ml-6">
            {me.docs.map((d,i)=>(<li key={i}>{d.originalname} ({Math.round(d.size/1024)} KB)</li>))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
