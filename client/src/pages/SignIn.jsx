import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { postData } from "@/api/axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await postData("/auth/login", {
        email,
        password,
      });

      // console.log(response)

      if (response.statusCode === 200) {
        const from = location.state?.from?.pathname || "/home";
        navigate(from, { replace: true });
        window.location.reload();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Email is required.");
        } else if (error.response.status === 404) {
          setError("User does not exist.");
        } else if (error.response.status === 401) {
          setError("Invalid user credentials.");
        } else {
          setError("Fail to sign-up. Please try again.");
        }
      } else {
        setError("Network error. Please try again.", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-lg text-white disabled:bg-gray-400 disabled:cursor-not-allowed
              bg-gray-700 hover:bg-gray-800
          `}
          disabled={loading || email.length < 4 || password.length < 5}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="my-2 flex justify-center text-sm">
          Are you a new user?
          <Link
            to="/sign-up"
            className="text-blue-600 px-1 hover:underline hover:text-blue-800 active:text-blue-950"
          >
            Sign-up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
