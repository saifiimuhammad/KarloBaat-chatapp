import React, { useState, type FC, type ReactNode } from "react";
import moment from "moment";
import {
  Shield,
  Users,
  MessageSquare,
  Bell,
  Search,
  User,
  Calendar,
  LogOut,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import AdminLayout from "../../components/layout/AdminLayout";
// import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";
import { adminLogout } from "../../redux/thunks/admin";
import { useDispatch } from "react-redux";
import MessagesChart from "../../components/charts/MessagesChart";
import DoughnutChart from "../../components/charts/DoughnutChart";

/* ================= TYPES ================= */

interface DashboardStats {
  usersCount: number;
  totalChatsCount: number;
  messagesCount: number;
  messagesChart: number[];
  singleChatsCount: number;
  groupsCount: number;
}

interface DashboardResponse {
  stats: DashboardStats;
}

/* ================= COMPONENT ================= */

const Dashboard: React.FC = () => {
  const { loading, data, error } = useFetchData<DashboardResponse>(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const [isActive, setIsActive] = useState(false);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  const stats = data?.stats;

  useErrors([
    {
      isError: error,
      error,
    },
  ]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-screen w-full animate-pulse rounded-xl bg-accent" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= APP BAR ================= */}
        <div className="col-span-1 lg:col-span-3 flex flex-wrap items-center justify-between gap-4 bg-white px-8 py-6 border-b border-zinc-200">
          <div className="flex items-center justify-start gap-4">
            <h2 className="text-[1.275rem] font-bold">Analytics Overview</h2>
            <span className="inline-flex items-center justify-center gap-1 rounded-full border border-zinc-200 bg-background-2 px-3 py-1 text-[.8rem] text-text-light">
              <Calendar size={15} />
              Last 30 Days
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div
                className={`absolute left-3 top-5 -translate-y-1/2 text-[#9b988c] ${
                  isActive ? "text-text/70" : ""
                }`}
              >
                <Search size={16} />
              </div>
              <input
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f6f8f4] text-text 
                   placeholder:text-[#9b988c] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                name="search"
                id="search"
                placeholder="Search data..."
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
              />
            </div>

            <span className="hidden lg:block text-sm text-gray-600">
              {moment().format("dddd, D MMMM YYYY")}
            </span>
            <button
              onClick={logoutHandler}
              className="text-text-light font-bold p-3 rounded-xl hover:bg-background-2 cursor-pointer"
            >
              <LogOut size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 col-span-1 lg:col-span-3 gap-6 px-4 sm:px-6 lg:px-8">
          {/* ================= STAT CARDS ================= */}

          <StatCard
            title="Total Users"
            value={stats?.usersCount || 0}
            icon={<User />}
            percentage={5.2}
          />
          <StatCard
            title="Active Chats"
            value={stats?.totalChatsCount || 0}
            icon={<Users />}
            percentage={-4.1}
          />
          <StatCard
            title="Messages Today"
            value={stats?.messagesCount || 0}
            icon={<MessageSquare />}
            percentage={60}
          />

          {/* ================= CHARTS ================= */}

          <div className="col-span-1 lg:col-span-2">
            <MessagesChart data={stats?.messagesChart || []} />
          </div>
          <div className="col-span-1">
            <DoughnutChart
              centerLabel="Chats"
              data={[
                {
                  label: "Single Chats",
                  value: stats?.singleChatsCount || 0,
                  color: "#628141",
                },
                {
                  label: "Group Chats",
                  value: stats?.groupsCount || 0,
                  color: "#ebd5ab",
                },
              ]}
            />
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  percentage: number; // positive for up, negative for down
  icon: ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, percentage, icon }) => {
  const isPositive = percentage >= 0;

  return (
    <div className="col-span-1 w-full bg-white border border-zinc-200 rounded-xl p-8 flex items-center gap-4">
      <div className="size-12 rounded-full bg-accent flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-text-light text-xs font-semibold uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold leading-tight">
          {value.toLocaleString()}
        </h3>
        <p
          className={`text-xs font-medium flex items-center gap-1 mt-1 ${
            isPositive ? "text-[#07881d]" : "text-[#880707]"
          }`}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(percentage)}%</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
