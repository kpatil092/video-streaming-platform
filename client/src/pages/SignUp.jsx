import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance, { postData } from "@/api/axios";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("country", country);
    formData.append("email", email);
    formData.append("avatar", profilePhoto);
    formData.append("channelName", channelName);
    formData.append("password", password);
    // console.log(formData.entries);

    try {
      const response = await postData("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(response);
      navigate("/sign-in");
    } catch (error) {
      // console.log(error);
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage("Please fill in all required fields.");
        } else if (error.response.status === 409) {
          setErrorMessage("Email or Channel Name already exists.");
        } else {
          setErrorMessage("Failed to sign up. Please try again.");
        }
      } else {
        setErrorMessage("Network error. Please try again.", error);
      }
    } finally {
      setIsLoading(false);
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
    <div className="flex flex-col justify-center items-center min-h-full bg-gray-100">
      <div className="flex flex-col gap-2 w-full max-w-4xl  bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
                {confirmPassword.length === password.length &&
                  password !== confirmPassword && (
                    <p className="text-red-500 text-sm">
                      Passwords do not match.
                    </p>
                  )}
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label
                  htmlFor="profilePhoto"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Profile Photo
                </label>
                <div className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2">
                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                    className="hidden"
                  />
                  {profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Avatar"
                      className="rounded-full w-24 h-24 object-cover"
                    />
                  ) : (
                    <div
                      className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        document.getElementById("profilePhoto").click()
                      }
                    >
                      Drag & Drop or Click to Upload
                    </div>
                  )}
                </div>
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
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
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full justify-center items-center">
            <button
              type="submit"
              className="w-1/2 lg:w-1/3 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
            <div className="flex gap-2 text-sm">
              Already have an account?
              <Link
                to="/sign-in"
                className="text-blue-500 hover:text-blue-700 hover:underline active:text-blue-900"
              >
                Sign-in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
