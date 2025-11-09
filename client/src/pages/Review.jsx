import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api.js";

export default function Review() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/students/${id}`).then(r => setS(r.data));
  }, [id]);

  const updateStatus = async (status) => {
    await API.patch(`/students/${id}/status`, { status });
    navigate("/admin");
  };

  if (!s) return <div>Loading...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-2">Review Application</h1>
      <div className="grid md:grid-cols-2 gap-2">
        <div><b>Name:</b> {s.firstName} {s.lastName}</div>
        <div><b>DOB:</b> {new Date(s.dob).toLocaleDateString()}</div>
        <div><b>Email:</b> {s.email}</div>
        <div><b>Phone:</b> {s.phone}</div>
        <div><b>Course/Year:</b> {s.course}/{s.year}</div>
        <div><b>Address:</b> {s.address}</div>
      </div>
      <div className="mt-3">
        <h2 className="font-semibold">Documents</h2>
        {s.docs?.length ? (
          <ul className="list-disc ml-6">
            {s.docs.map((d,i)=>(
              <li key={i}>
                <a className="text-blue-600 underline" href={`${import.meta.env.VITE_API_URL?.replace('/api','') || "http://localhost:5000"}/uploads/${d.filename}`} target="_blank">
                  {d.originalname}
                </a>
              </li>
            ))}
          </ul>
        ) : <div>No documents uploaded.</div>}
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={()=>updateStatus("approved")} className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
        <button onClick={()=>updateStatus("rejected")} className="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
      </div>
    </div>
  );
}
