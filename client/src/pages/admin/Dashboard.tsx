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
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";
import { adminLogout } from "../../redux/thunks/admin";
import { useDispatch } from "react-redux";

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
        <div className="h-screen w-full animate-pulse rounded-xl bg-[var(--color-accent)]" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="">
        {/* ================= APP BAR ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-8 py-6 border-b border-zinc-200">
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

        {/* ================= STAT CARDS ================= */}
        <div className="p-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <StatCard
            title="Total Users"
            value={12842}
            icon={<User />}
            percentage={5.2}
          />
          <StatCard
            title="Active Chats"
            value={432}
            icon={<Users />}
            percentage={-4.1}
          />
          <StatCard
            title="Messages Today"
            value={85291}
            icon={<MessageSquare />}
            percentage={60}
          />
          {/* <StatCard
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
          /> */}
        </div>

        {/* ================= CHARTS ================= */}
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full max-w-3xl rounded-xl bg-background-2 p-8">
            <h2 className="mb-6 text-2xl font-semibold">Last Messages</h2>
            <LineChart value={stats?.messagesChart || []} />
          </div>

          <div className="relative flex w-full max-w-sm items-center justify-center rounded-xl bg-background-2 p-4">
            <DoughnutChart
              value={[stats?.singleChatsCount || 0, stats?.groupsCount || 0]}
              labels={["Single Chat", "Group Chats"]}
            />

            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Users />
              <span className="text-sm font-semibold">VS</span>
              <User />
            </div>
          </div>
        </div>

        {/* ================= WIDGETS ================= */}
        <div className="my-8 flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <Widget
            title="Users"
            value={stats?.usersCount || 0}
            icon={<User />}
          />
          <Widget
            title="Chats"
            value={stats?.totalChatsCount || 0}
            icon={<Users />}
          />
          <Widget
            title="Messages"
            value={stats?.messagesCount || 0}
            icon={<MessageSquare />}
          />
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
    <div className="bg-white rounded-xl border border-zinc-200 p-6 w-full">
      <div className="flex items-center space-x-4">
        <div className="bg-green-100 p-3 rounded-full text-green-600">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 uppercase">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
      </div>
      <div
        className={`flex items-center mt-2 text-sm font-medium ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="mr-1" />
        ) : (
          <TrendingDown className="mr-1" />
        )}
        <span>{Math.abs(percentage)}%</span>
      </div>
    </div>
  );
};

interface WidgetProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const Widget: FC<WidgetProps> = ({ title, value, icon }) => {
  return (
    <div className="w-80 rounded-2xl bg-color-background-2 p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary text-xl font-semibold">
          {value}
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          {icon}
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
