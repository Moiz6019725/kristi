"use client";

import { useState, useEffect } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
      fetchOrders();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete order: ${res.status}`);
      fetchOrders();
    } catch (err) {
      alert("Error deleting order: " + err.message);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

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
      .label { border: 2px solid #000; padding: 15px; max-width: 600px; margin: 0 auto; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px; }
      .logo { font-size: 24px; font-weight: bold; }
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
      @media print { body { margin: 0; } .label { border: none; } }
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
          <p><strong>${selectedOrder.buyerName || "N/A"}</strong><br>${selectedOrder.buyerPhone || "N/A"}<br>${selectedOrder.shippingAddress?.street || "N/A"}, ${selectedOrder.shippingAddress?.city || "N/A"}, ${selectedOrder.shippingAddress?.state || "N/A"} ${selectedOrder.shippingAddress?.zipCode || "N/A"}, ${selectedOrder.shippingAddress?.country || "N/A"}</p>
        </div>
      </div>
      <div class="section" style="width:100%;display:block;">
        <h3>Products</h3>
        <ul class="products">
          ${selectedOrder.products?.map((p, i) => `
            <li id="product-${i}">
              <div>
                <strong>${p.productId?.title || (typeof p.productId === "string" ? p.productId : "N/A")}</strong><br>
                Qty: ${p.quantity} - Rs. ${p.price}
              </div>
              <div class="qr" id="qr-${i}"></div>
            </li>
          `).join("") || "<li>No products</li>"}
        </ul>
      </div>
      <div class="footer">
        <p class="total">Total: Rs. ${selectedOrder.totalAmount} | Status: ${selectedOrder.status} | Payment: ${selectedOrder.paymentMethod}</p>
        <p>Printed on: ${new Date().toLocaleString()}</p>
      </div>
    </div>
    <script>
      ${selectedOrder.products?.map((p, i) => {
        const qrData = p.productId?.title || (typeof p.productId === "string" ? p.productId : "N/A");
        return `try { new QRCode(document.getElementById('qr-${i}'), { text: '${qrData}', width: 50, height: 50 }); } catch(e) { document.getElementById('qr-${i}').innerHTML = '<span>QR N/A</span>'; }`;
      }).join("")}
    </script>
  </body>
</html>`;
    printWindow.document.write(labelContent);
    printWindow.document.close();
    printWindow.onload = () => setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const statusSelectClass = (status) => {
    const base = "px-2 py-1.5 rounded-full cursor-pointer text-xs font-medium border";
    const map = {
      pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
      processing: "bg-blue-50   text-blue-700   border-blue-200",
      shipped:    "bg-purple-50 text-purple-700 border-purple-200",
      delivered:  "bg-green-50  text-green-700  border-green-200",
      cancelled:  "bg-red-50    text-red-700    border-red-200",
    };
    return `${base} ${map[status] ?? map.pending}`;
  };

  const statusBadgeClass = (status) => {
    const map = {
      pending:    "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100   text-blue-800",
      shipped:    "bg-purple-100 text-purple-800",
      delivered:  "bg-green-100  text-green-800",
      cancelled:  "bg-red-100    text-red-800",
    };
    return map[status] ?? map.pending;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading orders…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-500 text-sm">Error: {error}</div>
    );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Orders</h2>
        <span className="text-sm text-gray-500">{orders.length} total orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">No orders found.</div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-sm" style={{ minWidth: "520px" }}>
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3 pr-3 font-medium">Order</th>
                <th className="py-3 pr-3 font-medium">Customer</th>
                {/* Phone hidden on mobile — visible from sm up */}
                <th className="py-3 pr-3 font-medium hidden sm:table-cell">Phone</th>
                <th className="py-3 pr-3 font-medium">Total</th>
                <th className="py-3 pr-3 font-medium">Status</th>
                <th className="py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-b-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 pr-3">
                    <button
                      onClick={() => openModal(order)}
                      className="text-blue-600 hover:text-blue-800 underline text-xs sm:text-sm"
                    >
                      #{order._id.slice(-6)}
                    </button>
                  </td>

                  <td className="py-3 pr-3">
                    <div className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[90px] sm:max-w-none">
                      {order.buyerName}
                    </div>
                  </td>

                  <td className="py-3 pr-3 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                    {order.buyerPhone}
                  </td>

                  <td className="py-3 pr-3 font-semibold text-gray-800 text-xs sm:text-sm whitespace-nowrap">
                    Rs. {order.totalAmount?.toLocaleString()}
                  </td>

                  <td className="py-3 pr-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={statusSelectClass(order.status)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium"
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

      {/* ── Modal ── */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="
              bg-white w-full sm:max-w-2xl lg:max-w-4xl
              rounded-t-2xl sm:rounded-2xl
              shadow-2xl
              max-h-[92vh] sm:max-h-[90vh]
              overflow-y-auto
              flex flex-col
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Order #{selectedOrder._id.slice(-6)}
                </h3>
                <span
                  className={`inline-block mt-1 px-3 py-0.5 text-xs font-medium rounded-full ${statusBadgeClass(selectedOrder.status)}`}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 flex-1">

              {/* Buyer Info */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-blue-600 mb-2">
                  Buyer information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p><span className="font-medium">Name:</span> {selectedOrder.buyerName || "N/A"}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.buyerPhone || "N/A"}</p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Products */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-blue-600 mb-2">
                  Products
                </h4>
                <div className="space-y-2">
                  {selectedOrder.products?.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={product.productId?.images?.[0] || "/placeholder-image.png"}
                        alt={product.productId?.title || "Product"}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {product.productId?.title ||
                            (typeof product.productId === "string" ? product.productId : "N/A")}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          Rs. {product.price?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Subtotal: Rs. {(product.quantity * product.price)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm text-center py-4">No products found.</p>
                  )}
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <h4 className="text-sm sm:text-base font-semibold text-blue-600">Total amount</h4>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  Rs. {selectedOrder.totalAmount?.toLocaleString()}
                </p>
              </div>

              <hr className="border-gray-100" />

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-blue-600 mb-2">
                  Shipping address
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedOrder.shippingAddress?.street || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.city || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.state || "N/A"}{" "}
                  {selectedOrder.shippingAddress?.zipCode || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.country || "N/A"}
                </p>
              </div>

              <hr className="border-gray-100" />

              {/* Order Details */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-blue-600 mb-2">
                  Order details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Payment:</span>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Updated:</span>{" "}
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer — sticky at bottom */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 p-4 sm:p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="w-full sm:w-auto px-5 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={printShippingLabel}
                className="w-full sm:w-auto bg-linear-to-t from-[#323c47] to-[#1A1A1A] cursor-pointer text-sm font-semibold text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
              >
                Print shipping label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}