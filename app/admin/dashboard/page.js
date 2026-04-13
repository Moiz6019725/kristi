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
      case "dashboard": return <Dashboard />;
      case "orders": return <Orders />;
      case "collections": return <Collections />;
      case "products": return <Products />;
      case "reviews": return <Reviews />;
      case "reports": return <Reports />;
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

  // Bottom nav tabs — limit to 5 for mobile
  const mobileTabs = tabs.slice(0, 5);

  return (
    <div className="h-screen flex bg-linear-to-br from-slate-50 via-purple-50 to-slate-100">

      {/* ── Sidebar (desktop only) ── */}
      <aside
        className={`hidden md:flex bg-black shadow-2xl transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-72" : "w-20"
        } flex-col relative border-r border-slate-700/50`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 via-transparent to-pink-600/10 pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
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
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`${
              sidebarOpen ? "relative" : "absolute -right-3 top-8"
            } p-2 cursor-pointer bg-slate-800 hover:bg-slate-700 rounded-full transition-all duration-200 shadow-lg border border-slate-600 z-10 group`}
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} className="text-slate-300 group-hover:text-white transition-colors" />
            ) : (
              <ChevronRight size={18} className="text-slate-300 group-hover:text-white transition-colors" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 relative overflow-y-auto">
          {tabs.map(({ id, label, icon, gradient }, index) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full cursor-pointer flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                activeTab === id
                  ? "bg-linear-to-r from-slate-800 to-slate-700 shadow-lg border border-slate-600"
                  : "hover:bg-slate-800/50 border border-transparent"
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: mounted ? "slideIn 0.3s ease-out forwards" : "none",
              }}
            >
              {activeTab === id && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b ${gradient} rounded-r-full`} />
              )}
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300 ${
                  activeTab === id
                    ? `bg-linear-to-br ${gradient} shadow-lg`
                    : "bg-slate-800 group-hover:bg-slate-700"
                }`}
              >
                <div className={activeTab === id ? "text-white" : "text-slate-400 group-hover:text-slate-200"}>
                  {icon}
                </div>
              </div>
              <span
                className={`font-semibold transition-all duration-300 ${!sidebarOpen && "opacity-0 w-0"} ${
                  activeTab === id ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {label}
              </span>
              {activeTab !== id && (
                <div className={`absolute inset-0 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`} />
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

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden bg-black border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <img src="/Logo.png" className="invert h-5 w-5" alt="Logo" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">
              Admin Panel
            </h1>
            <p className="text-xs text-slate-400 leading-none mt-0.5">Manage your store</p>
          </div>
          <div className="ml-auto text-xs text-slate-400 capitalize">{activeTab}</div>
        </header>

        {/* Scrollable content area — pb-20 reserves space for mobile bottom nav */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-slate-700/50 z-50 flex">
        {mobileTabs.map(({ id, label, icon, gradient }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-1 cursor-pointer group relative"
            style={{ minHeight: 56 }}
          >
            {/* Active pill indicator */}
            {activeTab === id && (
              <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-linear-to-r ${gradient}`} />
            )}
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${
                activeTab === id
                  ? `bg-linear-to-br ${gradient}`
                  : "bg-slate-800 group-hover:bg-slate-700"
              }`}
            >
              <div className={`${activeTab === id ? "text-white" : "text-slate-400"} [&>svg]:w-4 [&>svg]:h-4`}>
                {icon}
              </div>
            </div>
            <span
              className={`text-[10px] font-medium leading-none ${
                activeTab === id ? "text-purple-300" : "text-slate-500"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>

      <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0);      }
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,.05); border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #a855f7, #ec4899); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #9333ea, #db2777); }
      `}</style>
    </div>
  );
};

export default Page;