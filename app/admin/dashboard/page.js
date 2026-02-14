"use client";
import { useState, useEffect } from "react";
import Dashboard from "@/app/components/Dashboard";
import Orders from "../orders/page";
import Collections from "../collections/page";
import Reviews from "../reviews/page";
import Reports from "../reports/page";
import Products from "../products/page";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Eye,
  ShoppingCart,
  Package,
  LibraryBig,
  Star,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Eye size={20} />,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart size={20} />,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "collections",
      label: "Collections",
      icon: <LibraryBig size={20} />,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      id: "products",
      label: "Products",
      icon: <Package size={20} />,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star size={20} />,
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      id: "reports",
      label: "Reports",
      icon: <BarChart3 size={20} />,
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "collections":
        return <Collections />;
      case "products":
        return <Products />;
      case "reviews":
        return <Reviews />;
      case "reports":
        return <Reports />;
      default:
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-gray-600">Welcome to the admin panel.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-linear-to-br from-slate-50 via-purple-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-72" : "w-20"
        } flex flex-col relative border-r border-slate-700/50`}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 via-transparent to-pink-600/10 pointer-events-none"></div>

        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div
            className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}
          >
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <img src="/Logo.png" className="invert h-6 w-6" alt="Logo" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-slate-400">Manage your store</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <img src="/Logo.png" className="invert h-6 w-6" alt="Logo" />
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`${
              sidebarOpen ? "relative" : "absolute -right-3 top-8"
            } p-2 cursor-pointer bg-slate-800 hover:bg-slate-700 rounded-full transition-all duration-200 shadow-lg border border-slate-600 z-10 group`}
          >
            {sidebarOpen ? (
              <ChevronLeft
                size={18}
                className="text-slate-300 group-hover:text-white transition-colors"
              />
            ) : (
              <ChevronRight
                size={18}
                className="text-slate-300 group-hover:text-white transition-colors"
              />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 relative overflow-y-auto">
          {tabs.map(({ id, label, icon, gradient }, index) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full cursor-pointer flex items-center gap-4 px-4 py-2  rounded-xl transition-all duration-300 group relative overflow-hidden ${
                activeTab === id
                  ? "bg-linear-to-r from-slate-800 to-slate-700 shadow-lg border border-slate-600"
                  : "hover:bg-slate-800/50 border border-transparent"
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: mounted ? "slideIn 0.3s ease-out forwards" : "none",
              }}
            >
              {/* Active indicator */}
              {activeTab === id && (
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b ${gradient} rounded-r-full`}
                ></div>
              )}

              {/* Icon with gradient background */}
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300 ${
                  activeTab === id
                    ? `bg-linear-to-br ${gradient} shadow-lg`
                    : "bg-slate-800 group-hover:bg-slate-700"
                }`}
              >
                <div
                  className={
                    activeTab === id
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-200"
                  }
                >
                  {icon}
                </div>
              </div>

              {/* Label */}
              <span
                className={`font-semibold transition-all duration-300 ${
                  !sidebarOpen && "opacity-0 w-0"
                } ${
                  activeTab === id
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {label}
              </span>

              {/* Hover gradient effect */}
              {activeTab !== id && (
                <div
                  className={`absolute inset-0 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}
                ></div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="relative p-4 border-t border-slate-700/50">
            <div className="bg-linear-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Admin User</p>
                  <p className="text-xs text-slate-400">admin@store.com</p>
                </div>
              </div>
              <button className="w-full py-2 bg-slate-800 cursor-pointer hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        

        {/* Content Area */}
        <div className="p-4">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7, #ec4899);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
};

export default Page;
