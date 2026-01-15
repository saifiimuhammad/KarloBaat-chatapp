import React, { useEffect, useState, type FC, type ReactNode } from "react";
import {
  Ban,
  CircleCheck,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import usersData from "../../constants/usersData";

const UserManagement: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "banned">(
    "all"
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler); // Clear timeout if search changes
    };
  }, [search]);

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.username.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? !user.isBlocked
        : user.isBlocked;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= APP BAR ================= */}
        <div className="col-span-1 lg:col-span-3 w-full bg-white px-8 py-6 border-b border-zinc-200">
          <div className="flex items-start justify-center flex-col">
            <h2 className="text-[1.275rem] font-bold">User Management</h2>
            <p className="text-[.8rem] text-text-light">
              Manage all users on the Karlobaat platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 col-span-1 lg:col-span-3 gap-6 px-4 sm:px-6 lg:px-8">
          <StatCard
            title={"Total Users"}
            value={12840}
            icon={<Users className="text-primary" />}
          />
          <StatCard
            title={"New Users This Week"}
            value={312}
            icon={<UserPlus className="text-primary" />}
          />
          <StatCard
            title={"Banned Users"}
            value={86}
            icon={<Ban className="text-red-800" />}
          />

          {/* ================= TABLE ================= */}
          <div className="mb-8 col-span-1 lg:col-span-3 rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="w-full md:max-w-3xl relative">
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
                    placeholder="Search by name, username, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                  />
                </div>
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-500">
                    Filter by status:
                  </span>
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`flex h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors ${
                      statusFilter === "all"
                        ? "text-primary"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>All</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("active")}
                    className={`flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors ${
                      statusFilter === "active"
                        ? "text-primary"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>Active</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("banned")}
                    className={`flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors ${
                      statusFilter === "banned"
                        ? "text-primary"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>Banned</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Avatar
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Avatar */}
                      <td className="px-6 py-4">
                        <div
                          className="h-10 w-10 rounded-full bg-cover bg-center border border-slate-200"
                          data-alt={`User profile avatar of ${user.name}`}
                          style={{ backgroundImage: `url('${user.avatar}')` }}
                        ></div>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                        {user.name}
                      </td>

                      {/* Username */}
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        @{user.username}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      {/* Join Date */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase">
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Edit User"
                          >
                            <Pencil size={18} />
                          </button>

                          {user.isBlocked ? (
                            <button
                              className="p-2 text-slate-500 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                              title="Unban User"
                            >
                              <CircleCheck size={18} />
                            </button>
                          ) : (
                            <button
                              className="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all"
                              title="Ban User"
                            >
                              <Ban size={18} />
                            </button>
                          )}

                          <button
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Showing 1 to 4 of 12,840 users
              </span>
              <div className="flex gap-1">
                <button className="h-8 px-3 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="h-8 w-8 rounded-lg bg-primary text-white text-sm font-bold shadow-sm">
                  1
                </button>
                <button className="h-8 w-8 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-100">
                  2
                </button>
                <button className="h-8 w-8 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-100">
                  3
                </button>
                <button className="h-8 px-3 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-100">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="col-span-1 flex flex-col gap-2 rounded-xl p-6 bg-white border border-zinc-200">
      <div className="flex items-center justify-between">
        <p className="text-text-light text-sm font-medium">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold leading-tight">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export default UserManagement;
