import { useForm } from "react-hook-form";
import API from "../api.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/register", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/student");
    } catch (e) {
      alert(e.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Student Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Full Name" {...register("name", { required: true })} />
        <input className="w-full border p-2 rounded" placeholder="Email" {...register("email", { required: true })} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" {...register("password", { required: true })} />
        <button className="w-full bg-green-600 text-white p-2 rounded">Create Account</button>
      </form>
    </div>
  );
}
