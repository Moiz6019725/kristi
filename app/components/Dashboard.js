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
  Filler,
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      const orders = data.orders || data;

      setRecentOrders(orders);

      const deliveredOrders = orders.filter((o) => o.status === "delivered");
      const totalSales = deliveredOrders.reduce(
        (sum, o) => sum + o.totalAmount,
        0,
      );
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
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#8b5cf6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#8b5cf6",
            pointHoverBorderWidth: 2,
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
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 10,
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
        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
        ticks: { color: "#6b7280", font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          maxRotation: 45,       // ← allows label rotation on small screens
          autoSkip: true,
          maxTicksLimit: 8,      // ← prevents label crowding
        },
      },
    },
  };

  const getStatusSelectClass = (status) => {
    const base =
      "px-2 py-1.5 rounded-full cursor-pointer text-xs font-medium border w-full sm:w-auto";
    const map = {
      pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      shipped:    "bg-purple-50 text-purple-700 border-purple-200",
      delivered:  "bg-green-50 text-green-700 border-green-200",
      cancelled:  "bg-red-50 text-red-700 border-red-200",
    };
    return `${base} ${map[status] ?? map.pending}`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8 max-w-md w-full">
          <p className="text-red-600 font-semibold text-center text-sm sm:text-base">
            {error}
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-2 sm:px-4 rounded-full shadow-md self-start sm:self-auto">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Live Updates
            </span>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        {/* 2-col on mobile, 4-col on lg+ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <div className="relative p-4 sm:p-5 lg:p-6">
                <div
                  className={`inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${m.gradient} mb-3 shadow-md`}
                >
                  <span className="text-lg sm:text-xl">{m.icon}</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">
                  {m.title}
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
                  {m.value}
                </p>
                <div className="flex items-center gap-1 flex-wrap">
                  <span
                    className={`text-xs font-semibold ${
                      m.changeType === "positive"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {m.changeType === "positive" ? "↑" : "↓"} {m.change}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className={`h-1 bg-gradient-to-r ${m.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              />
            </div>
          ))}
        </div>

        {/* ── SALES CHART ── */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Sales Analytics
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                Track your revenue performance over time
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-full self-start sm:self-auto">
              <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />
              <span className="text-xs sm:text-sm font-medium text-purple-900">
                Revenue
              </span>
            </div>
          </div>
          {/* Chart height shrinks on mobile */}
          <div className="h-48 sm:h-64 lg:h-80">
            {chartData && <Line data={chartData} options={chartOptions} />}
          </div>
        </div>

        {/* ── ORDERS TABLE ── */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Recent Orders
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                Manage and track all your orders
              </p>
            </div>
            <div className="bg-gray-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {recentOrders.length} Orders
              </span>
            </div>
          </div>

          {/* Horizontal scroll wrapper keeps table readable on narrow screens */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-sm" style={{ minWidth: "540px" }}>
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-3 pr-3 font-medium">Order</th>
                  <th className="py-3 pr-3 font-medium">Customer</th>
                  <th className="py-3 pr-3 font-medium hidden sm:table-cell">Phone</th>
                  <th className="py-3 pr-3 font-medium">Total</th>
                  <th className="py-3 pr-3 font-medium">Status</th>
                  <th className="py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-b-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 pr-3">
                      <button className="text-blue-600 hover:text-blue-800 underline text-xs sm:text-sm">
                        #{order._id.slice(-6)}
                      </button>
                    </td>

                    <td className="py-3 pr-3">
                      <div className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                        {order.buyerName}
                      </div>
                    </td>

                    <td className="py-3 pr-3 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                      {order.buyerPhone}
                    </td>

                    <td className="py-3 pr-3 font-semibold text-gray-800 text-xs sm:text-sm whitespace-nowrap">
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3 pr-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={getStatusSelectClass(order.status)}
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

            {recentOrders.length === 0 && (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-500 font-medium text-sm">No orders yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Orders will appear here once customers start purchasing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;