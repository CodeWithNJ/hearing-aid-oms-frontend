import { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(null); // for view profile modal
  const [editingCustomer, setEditingCustomer] = useState(null); // for update form

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchCustomers = useCallback(async (pageNo) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get(
        `/customers?page=${pageNo}&limit=5`
      );

      if (data.success) {
        setCustomers(data.data.docs);
        setTotalPages(data.data.totalPages);
        setPage(data.data.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(page);
  }, [page, fetchCustomers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleAddCustomer = async (formData) => {
    try {
      const { data } = await axiosInstance.post("/customers", formData);

      if (data.success) {
        setShowForm(false);
        reset();
        fetchCustomers(page);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add customer.");
    }
  };

  const handleUpdateCustomer = async (formData) => {
    try {
      const { data } = await axiosInstance.patch(
        `/customers/${editingCustomer._id}`,
        formData
      );

      if (data.success) {
        setEditingCustomer(null);
        reset();
        fetchCustomers(page);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update customer.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <button
          onClick={() => {
            reset();
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add New Customer
        </button>
      </div>

      {loading && <p>Loading customers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">First Name</th>
                <th className="p-2 border">Last Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Hearing Loss Level</th>
                <th className="p-2 border">Budget Range</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer._id} className="text-center">
                    <td className="p-2 border">{customer.first_name}</td>
                    <td className="p-2 border">{customer.last_name || "-"}</td>
                    <td className="p-2 border">{customer.email}</td>
                    <td className="p-2 border">{customer.phone}</td>
                    <td className="p-2 border">{customer.address}</td>
                    <td className="p-2 border">
                      {customer.hearing_loss_level}
                    </td>
                    <td className="p-2 border">₹{customer.budget_range}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => setShowProfile(customer)}
                      >
                        View Profile
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => {
                          setEditingCustomer(customer);
                          reset(customer);
                        }}
                      >
                        Update Profile
                      </button>
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        Place Order
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Add New Customer Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Customer</h3>
            <form
              onSubmit={handleSubmit(handleAddCustomer)}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="First Name"
                {...register("first_name", { required: true })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                {...register("last_name")}
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                {...register("phone", { required: true })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Address"
                {...register("address", { required: true })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Hearing Loss Level"
                {...register("hearing_loss_level")}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Budget Range"
                {...register("budget_range")}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Customer Profile</h3>
            <p>
              <strong>Name:</strong> {showProfile.first_name}{" "}
              {showProfile.last_name}
            </p>
            <p>
              <strong>Email:</strong> {showProfile.email}
            </p>
            <p>
              <strong>Phone:</strong> {showProfile.phone}
            </p>
            <p>
              <strong>Address:</strong> {showProfile.address}
            </p>
            <p>
              <strong>Hearing Loss Level:</strong>{" "}
              {showProfile.hearing_loss_level}
            </p>
            <p>
              <strong>Budget Range:</strong> ₹{showProfile.budget_range}
            </p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowProfile(null)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Profile Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Update Customer</h3>
            <form
              onSubmit={handleSubmit(handleUpdateCustomer)}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="First Name"
                {...register("first_name", { required: true })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                {...register("last_name")}
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                {...register("phone", { required: true })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Address"
                {...register("address", { required: true })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Hearing Loss Level"
                {...register("hearing_loss_level")}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Budget Range"
                {...register("budget_range")}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}

export default Customers;
