"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/protected";
import Image from "next/image";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  total: number;
  orderDate: string;
  status: string | null;
  cartItems: { productName?: string; image?: string }[] | null;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    client
      .fetch<Order[]>(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          zip,
          total,
          orderDate,
          status,
          cartItems[]->{
            productName,
            image
          }
        }`
      )
      .then((data: Order[]) => setOrders(data))
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error fetching orders:", error.message);
        } else {
          console.error("Unknown error occurred:", error);
        }
      });
  }, []);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      Swal.fire(
        newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        `The order status has been updated to ${newStatus}.`,
        "success"
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire(
        "Error!",
        "Something went wrong while updating the status.",
        "error"
      );
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status
                    ? "bg-white text-red-600 font-bold"
                    : "text-white"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Orders</h2>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
              <thead className="bg-gray-50 text-red-600">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-red-100 transition-all">
                      <td>{order._id}</td>
                      <td>
                        {order.firstName} {order.lastName}
                      </td>
                      <td>{order.address}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>${order.total}</td>
                      <td>
                        <select
                          value={order.status || ""}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="bg-gray-100 p-1 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatch">Dispatch</option>
                          <option value="success">Completed</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleOrderDetails(order._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          {selectedOrderId === order._id ? "Hide" : "View"}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {selectedOrderId === order._id && (
                      <tr>
                        <td colSpan={8} className="bg-gray-50 p-4">
                          <div className="p-4 border rounded-md shadow-md">
                            <h3 className="text-lg font-semibold mb-2">
                              Order Details
                            </h3>
                            <p>
                              <strong>Phone:</strong> {order.phone}
                            </p>
                            <p>
                              <strong>Email:</strong> {order.email}
                            </p>
                            <p>
                              <strong>City:</strong> {order.city}
                            </p>
                            <p>
                              <strong>ZIP Code:</strong> {order.zip}
                            </p>
                            <h4 className="mt-3 font-semibold">Cart Items:</h4>
                            <ul className="list-disc pl-6">
                              {order.cartItems?.length ? (
                                order.cartItems.map((item, index) =>
                                  item ? ( // Ensure item is not null or undefined
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2"
                                    >
                                      <Image
                                        src={item.image || "/default-image.png"} // Use a fallback image
                                        alt={
                                          item.productName || "Unknown Product"
                                        }
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded"
                                      />
                                      <span>
                                        {item.productName || "Unknown Product"}
                                      </span>
                                    </div>
                                  ) : (
                                    <span key={index} className="text-red-500">
                                      Invalid Item
                                    </span> // Handle null items gracefully
                                  )
                                )
                              ) : (
                                <p>No items available</p>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
