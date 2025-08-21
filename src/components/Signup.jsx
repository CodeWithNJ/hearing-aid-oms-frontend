import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

function Signup() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await axios.post("/api/v1/auth/register", {
        first_name: data.first_name,
        last_name: data.last_name ? data.last_name : null,
        username: data.username,
        password: data.password,
      });

      if (response.data.success) {
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Error response:", error.response.data);

        if (error.response.data?.message) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        setServerError("No response from server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        setServerError("Request setup error. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Order Management System
        </h2>
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          Admin Signup
        </h2>
        {serverError && (
          <p className="mb-4 text-red-400 text-sm text-center">{serverError}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="first_name"
              className="text-sm font-medium text-gray-200"
            >
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              {...register("first_name", { required: true })}
              className="w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.first_name && (
              <p className="text-red-400 text-sm">First Name is required</p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="last_name"
              className="text-sm font-medium text-gray-200"
            >
              Last Name (Optional)
            </label>
            <input
              id="last_name"
              type="text"
              {...register("last_name")}
              className="w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-200"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: true })}
              className="w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.username && (
              <p className="text-red-400 text-sm">Username is required</p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: true })}
              autoComplete="current-password"
              className="w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">Password is required</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-500 px-3 py-2 text-white font-semibold hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Signup As Admin
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Existing User? <NavLink to="/">Click Here To Sign In</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Signup;
