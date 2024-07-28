import React, { useState, useEffect } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const passwordRegex =
      "/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{7,}$/";
    const validateForm = () => {
      if (
        name.trim() &&
        email.trim() &&
        channelName.trim() &&
        password.trim() &&
        confirmPassword.trim() &&
        password === confirmPassword &&
        passwordRegex.test(password)
      ) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    };
    validateForm();
  }, [name, email, channelName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("country", country);
    formData.append("email", email);
    formData.append("profilePhoto", profilePhoto);
    formData.append("channelName", channelName);
    formData.append("password", password);

    // Add your sign-up logic here
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
        value
      )
    ) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and be at least 7 characters long."
      );
    }
  };

  return (
    <div className="flex justify-center items-center my-5 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="country"
            className="block text-gray-700 font-bold mb-2"
          >
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="UK">UK</option>
            {/* Add more countries as needed */}
          </select>
        </div>
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
        <div className="mb-4">
          <label
            htmlFor="profilePhoto"
            className="block text-gray-700 font-bold mb-2"
          >
            Profile Photo
          </label>
          <input
            id="profilePhoto"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="channelName"
            className="block text-gray-700 font-bold mb-2"
          >
            Channel Name
          </label>
          <input
            id="channelName"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
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
            onChange={handlePasswordChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {confirmPassword.length === password.length &&
            password !== confirmPassword && (
              <p className="text-red-500 text-sm">Passwords do not match.</p>
            )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600"
          disabled={!isFormValid}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
