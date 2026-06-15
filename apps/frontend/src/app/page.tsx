"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, ShoppingBag, TrendingUp, Activity } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    revenue: 0,
    campaigns: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from /api/dashboard-stats
    // For now, we simulate data
    setStats({
      customers: 1250,
      orders: 5400,
      revenue: 425000,
      campaigns: 12,
    });

    setChartData([
      { name: "Mon", revenue: 4000 },
      { name: "Tue", revenue: 3000 },
      { name: "Wed", revenue: 2000 },
      { name: "Thu", revenue: 2780 },
      { name: "Fri", revenue: 1890 },
      { name: "Sat", revenue: 2390 },
      { name: "Sun", revenue: 3490 },
    ]);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your CRM and campaign performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3 text-gray-500">
            <Users size={20} className="text-blue-500" />
            <span className="font-medium">Total Customers</span>
          </div>
          <span className="text-3xl font-bold">{stats.customers.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3 text-gray-500">
            <ShoppingBag size={20} className="text-green-500" />
            <span className="font-medium">Total Orders</span>
          </div>
          <span className="text-3xl font-bold">{stats.orders.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3 text-gray-500">
            <TrendingUp size={20} className="text-purple-500" />
            <span className="font-medium">Total Revenue</span>
          </div>
          <span className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3 text-gray-500">
            <Activity size={20} className="text-orange-500" />
            <span className="font-medium">Active Campaigns</span>
          </div>
          <span className="text-3xl font-bold">{stats.campaigns}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Revenue Over Time</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip cursor={{ fill: "#F3F4F6" }} />
              <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
