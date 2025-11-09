import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Review from "./pages/Review.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto p-4 flex gap-4">
          <Link className="font-semibold" to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Student Sign Up</Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/review/:id" element={<Review />} />
          </Route>

          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}
