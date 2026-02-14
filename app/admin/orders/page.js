"use client";

import { useState, useEffect } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [showModal, setShowModal] = useState(false); // Modal visibility

  // Fetch orders
  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
      const data = await res.json();
      setOrders(data.orders);
      console.log("Orders fetched:", data.orders);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      console.log(`Updating status for order ${orderId} to ${newStatus}`);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
      console.log("Status updated successfully");
      fetchOrders(); // Refresh
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating status: " + err.message);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      console.log(`Deleting order ${orderId}`);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete order: ${res.status}`);
      console.log("Order deleted successfully");
      fetchOrders(); // Refresh
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting order: " + err.message);
    }
  };

  // Open modal with order details
  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  // Print shipping label
  const printShippingLabel = () => {
    if (!selectedOrder) return;

    const printWindow = window.open("", "_blank");
    const labelContent = `
  <html>
    <head>
      <title>Shipping Label - Order #${selectedOrder._id.slice(-6)}</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #000; background: #fff; }
        .label { border: 2px solid #000; padding: 15px; max-width: 600px; margin: 0 auto; page-break-inside: avoid; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .logo { font-size: 24px; font-weight: bold; color: #000; }
        .order-id { font-size: 16px; font-weight: bold; }
        .barcode { display: inline-block; height: 40px; width: 200px; background: repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px); margin-top: 5px; }
        .sections { display: table; width: 100%; margin-bottom: 15px; }
        .section { display: table-cell; width: 50%; padding: 10px; border: 1px solid #ccc; vertical-align: top; }
        .section h3 { font-size: 14px; margin-bottom: 5px; text-transform: uppercase; font-weight: bold; }
        .products { list-style: none; padding: 0; margin: 0; }
        .products li { margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; padding: 5px; border-bottom: 1px dashed #ccc; }
        .qr { width: 50px; height: 50px; margin-left: 10px; }
        .footer { text-align: center; font-size: 12px; margin-top: 15px; border-top: 1px solid #000; padding-top: 10px; }
        .total { font-weight: bold; font-size: 14px; }
        @media print { body { margin: 0; } .label { border: none; page-break-inside: avoid; } .barcode { page-break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="label">
        <div class="header">
          <div class="logo">Kristi</div>
          <div>
            <div class="order-id">Order #${selectedOrder._id.slice(-6)}</div>
            <div class="barcode"></div>
          </div>
        </div>
        
        <div class="sections">
          <div class="section">
            <h3>From</h3>
            <p>Kristi<br>Malikpur Aiwan E Khas, Sheikhupura Road, Faisalabad<br>+92 315 7378892<br>kristi@gmail.com</p>
          </div>
          
          <div class="section">
            <h3>To</h3>
            <p><strong>${selectedOrder.buyerName || "N/A"}</strong><br>${
              selectedOrder.buyerPhone || "N/A"
            }<br>${selectedOrder.shippingAddress?.street || "N/A"}, ${
              selectedOrder.shippingAddress?.city || "N/A"
            }, ${selectedOrder.shippingAddress?.state || "N/A"} ${
              selectedOrder.shippingAddress?.zipCode || "N/A"
            }, ${selectedOrder.shippingAddress?.country || "N/A"}</p>
          </div>
        </div>
        
        <div class="section" style="width: 100%; display: block;">
          <h3>Products</h3>
          <ul class="products" id="products-list">
            ${
              selectedOrder.products
                ?.map(
                  (product, index) => `
              <li id="product-${index}">
                <div>
                  <strong>${
                    product.productId?.title ||
                    (typeof product.productId === "string"
                      ? product.productId
                      : "N/A")
                  }</strong><br>
                  Qty: ${product.quantity} - Rs. ${product.price}
                </div>
                <div class="qr" id="qr-${index}"></div>
              </li>
            `,
                )
                .join("") || "<li>No products</li>"
            }
          </ul>
        </div>
        
        <div class="footer">
          <p class="total">Total: Rs. ${selectedOrder.totalAmount} | Status: ${
            selectedOrder.status
          } | Payment: ${selectedOrder.paymentMethod}</p>
          <p>Printed on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
      
      <script>
        // Generate QR codes for each product
        ${selectedOrder.products
          ?.map((product, index) => {
            const qrData =
              product.productId?.title ||
              (typeof product.productId === "string"
                ? product.productId
                : "N/A");
            return `
            try {
              new QRCode(document.getElementById('qr-${index}'), {
                text: '${qrData}',
                width: 50,
                height: 50
              });
            } catch (e) {
              document.getElementById('qr-${index}').innerHTML = '<span>QR N/A</span>';
            }
          `;
          })
          .join("")}
      </script>
    </body>
  </html>
`;
    printWindow.document.write(labelContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>
        <span className="text-sm text-gray-500">
          {orders.length} total orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Order</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Total</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-b-[#e9e9e9] hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-medium text-gray-800">
                    <button
                      onClick={() => openModal(order)}
                      className="text-blue-600 cursor-pointer hover:text-blue-800 underline"
                    >
                      #{order._id.slice(-6)}
                    </button>
                  </td>

                  <td className="py-4">
                    <div className="font-medium text-gray-800">
                      {order.buyerName}
                    </div>
                  </td>

                  <td className="py-4 text-gray-600">{order.buyerPhone}</td>

                  <td className="py-4 font-semibold text-gray-800">
                    Rs. {order.totalAmount}
                  </td>

                  <td className="py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full cursor-pointer text-xs font-medium border
                    ${
                      order.status === "pending"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : order.status === "processing"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : order.status === "shipped"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : order.status === "delivered"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                    }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-4 text-right">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="text-red-600 cursor-pointer hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Order Details - Shopify-like Design */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-[#1111115b] bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeModal} // Close modal on backdrop click
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Order #{selectedOrder._id.slice(-6)}
                </h3>
                <span
                  className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                    selectedOrder.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedOrder.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : selectedOrder.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : selectedOrder.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Buyer Info */}
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">
                  Buyer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong className="text-gray-700">Name:</strong>{" "}
                    {selectedOrder.buyerName || "N/A"}
                  </p>
                  <p>
                    <strong className="text-gray-700">Phone:</strong>{" "}
                    {selectedOrder.buyerPhone || "N/A"}
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Products */}
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">
                  Products
                </h4>
                <div className="space-y-3">
                  {selectedOrder.products?.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={
                          product.productId?.images?.[0] ||
                          "/placeholder-image.png"
                        } // Fallback to placeholder
                        alt={product.productId?.title || "Product"}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {product.productId?.title ||
                            (typeof product.productId === "string"
                              ? product.productId
                              : "N/A")}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {product.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          Rs. {product.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          Subtotal: Rs. {product.quantity * product.price}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center">
                      No products found.
                    </p>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Total Amount */}
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-blue-600">
                  Total Amount
                </h4>
                <p className="text-xl font-bold text-gray-900">
                  Rs. {selectedOrder.totalAmount}
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* Shipping Address */}
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">
                  Shipping Address
                </h4>
                <p className="text-sm text-gray-700">
                  {selectedOrder.shippingAddress?.street || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.city || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.state || "N/A"}{" "}
                  {selectedOrder.shippingAddress?.zipCode || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.country || "N/A"}
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* Other Details */}
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">
                  Order Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong className="text-gray-700">Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <strong className="text-gray-700">Created At:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong className="text-gray-700">Updated At:</strong>{" "}
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={printShippingLabel}
                className="bg-linear-to-t from-[#323c47] to-[#1A1A1A] cursor-pointer text-sm font-semibold text-white px-4 py-1 rounded-lg hover:scale-105 transition-all"
              >
                Print Shipping Label
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
