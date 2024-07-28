import React, { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign-in logic here
    console.log({ email, password });
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-500"
          disabled={email.length < 4 || password.length < 5}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
