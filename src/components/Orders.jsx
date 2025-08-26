import { Outlet } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

function Orders() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(); // ✅ fixed

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null); // ✅ track which order to update

  const fetchOrders = useCallback(async (pageNo) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get(
        `/orders?page=${pageNo}&limit=5`
      );
      if (data.success) {
        setOrders(data.data.docs);
        setTotalPages(data.data.totalPages);
        setPage(data.data.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleUpdateOrderStatus = async (data) => {
    try {
      await axiosInstance.patch(`/orders/${selectedOrderId}/status`, {
        status: data.status,
      });

      // refresh list & close modal
      await fetchOrders(page);
      setShowForm(false);
      setSelectedOrderId(null);
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Orders</h2>
      </div>

      {loading && <p>Loading customers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Customer ID</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Total Amount</th>
                <th className="p-2 border">Insurance Discount</th>
                <th className="p-2 border">Delivery Date</th>
                <th className="p-2 border">Tracking Number</th>
                <th className="p-2 border">Notes</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="text-center">
                    <td className="p-2 border">{order._id}</td>
                    <td className="p-2 border">{order.customer_id}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border">{order.total_amount}</td>
                    <td className="p-2 border">{order.insurance_discount}</td>
                    <td className="p-2 border">{order.delivery_date}</td>
                    <td className="p-2 border">{order.tracking_number}</td>
                    <td className="p-2 border">
                      {order.notes.length > 0 ? order.notes : `-`}
                    </td>
                    <td className="p-2 border space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 mt-4 rounded hover:bg-yellow-600"
                        onClick={() => {
                          setShowForm(true);
                          setSelectedOrderId(order._id); // ✅ set selected order
                        }}
                      >
                        Update Status
                      </button>
                      <button className="bg-yellow-500 text-white px-3 py-1 mt-4 rounded hover:bg-yellow-600">
                        Download Invoice
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
            <form
              onSubmit={handleSubmit(handleUpdateOrderStatus)}
              className="space-y-3"
            >
              <label>
                <input
                  type="radio"
                  value="ordered"
                  {...register("status", {
                    required: "Please select a status",
                  })}
                />
                Ordered
              </label>
              <label>
                <input type="radio" value="shipped" {...register("status")} />
                Shipped
              </label>
              <label>
                <input type="radio" value="delivered" {...register("status")} />
                Delivered
              </label>
              <label>
                <input type="radio" value="fitted" {...register("status")} />
                Fitted
              </label>

              {errors.status && (
                <span className="font-medium italic text-red-500">
                  {errors.status.message}
                </span>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Submit
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

export default Orders;
