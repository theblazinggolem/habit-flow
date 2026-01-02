import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Welcome Back</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="••••••••" />
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}