"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH ORDERS + METRICS ---------------- */
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      const orders = data.orders || data;

      setRecentOrders(orders);

      const deliveredOrders = orders.filter((o) => o.status === "delivered");
      const totalSales = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const uniqueCustomers = new Set(orders.map((o) => o.buyerPhone)).size;

      setMetrics([
        {
          title: "Total Revenue",
          value: `Rs. ${totalSales.toLocaleString()}`,
          icon: "💎",
          gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
          change: "+12.5%",
          changeType: "positive",
        },
        {
          title: "Total Orders",
          value: orders.length,
          icon: "📦",
          gradient: "from-cyan-500 via-blue-500 to-indigo-500",
          change: "+8.2%",
          changeType: "positive",
        },
        {
          title: "Active Customers",
          value: uniqueCustomers,
          icon: "👥",
          gradient: "from-amber-500 via-orange-500 to-red-500",
          change: "+23.1%",
          changeType: "positive",
        },
        {
          title: "Delivered",
          value: deliveredOrders.length,
          icon: "✨",
          gradient: "from-emerald-500 via-green-500 to-teal-500",
          change: "+15.3%",
          changeType: "positive",
        },
      ]);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /* ---------------- FETCH SALES CHART ---------------- */
  const fetchSalesChart = async () => {
    try {
      const res = await fetch("/api/orders/sales-overview");
      const data = await res.json();

      setChartData({
        labels: data.map((d) => d._id),
        datasets: [
          {
            label: "Sales Revenue",
            data: data.map((d) => d.totalSales),
            borderColor: "#8b5cf6",
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, "rgba(139, 92, 246, 0.3)");
              gradient.addColorStop(1, "rgba(139, 92, 246, 0.01)");
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#8b5cf6",
            pointBorderColor: "#fff",
            pointBorderWidth: 3,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#8b5cf6",
            pointHoverBorderWidth: 3,
          },
        ],
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSalesChart();

    const interval = setInterval(() => {
      fetchOrders();
      fetchSalesChart();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
    fetchSalesChart();
  };

  const deleteOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
    fetchSalesChart();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderColor: "#8b5cf6",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const getStatusBadgeStyles = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cancelled: "bg-rose-100 text-rose-800 border-rose-200",
    };
    return styles[status] || styles.pending;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
          <p className="text-red-600 font-semibold text-center">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Live Updates</span>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-linear-to-br ${m.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              {/* Icon Background */}
              <div className="absolute -top-4 -right-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                {m.icon}
              </div>

              <div className="relative p-6">
                {/* Icon Badge */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${m.gradient} mb-4 shadow-lg`}>
                  <span className="text-2xl">{m.icon}</span>
                </div>

                {/* Title */}
                <p className="text-sm font-medium text-gray-500 mb-1">{m.title}</p>

                {/* Value */}
                <p className="text-3xl font-bold text-gray-900 mb-2">{m.value}</p>

                {/* Change Indicator */}
                <div className="flex items-center space-x-1">
                  <span className={`text-xs font-semibold ${m.changeType === "positive" ? "text-emerald-600" : "text-rose-600"}`}>
                    {m.changeType === "positive" ? "↑" : "↓"} {m.change}
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>

              {/* Bottom Border Animation */}
              <div className={`h-1 bg-linear-to-r ${m.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          ))}
        </div>

        {/* SALES CHART */}
        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sales Analytics</h2>
              <p className="text-gray-500 text-sm mt-1">Track your revenue performance over time</p>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-sm font-medium text-purple-900">Revenue</span>
            </div>
          </div>

          <div className="h-80">
            {chartData && <Line data={chartData} options={chartOptions} />}
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <p className="text-gray-500 text-sm mt-1">Manage and track all your orders</p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-gray-700">{recentOrders.length} Orders</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">#{order._id.slice(-2)}</span>
                        </div>
                        <span className="font-semibold text-gray-900">#{order._id.slice(-6)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {order.buyerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{order.buyerName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-gray-600">{order.buyerPhone}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">Rs. {order.totalAmount.toLocaleString()}</span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${getStatusBadgeStyles(
                          order.status
                        )}`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="processing">⚙️ Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="inline-flex items-center px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                      >
                        <span className="mr-1">🗑️</span> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {recentOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 font-medium">No orders yet</p>
                <p className="text-gray-400 text-sm">Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;