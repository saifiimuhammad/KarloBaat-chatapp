import React, { useEffect, useState, type FC, type ReactNode } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { useFetchData } from "6pp";

import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";
import { transformImage } from "../../lib/features";
import { Ban, UserPlus, Users } from "lucide-react";
import usersData from "../../constants/usersData";
/* ================= TYPES ================= */

interface User {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  friends: number;
}

interface TableUser extends User {
  id: string;
}

/* ================= COLUMNS ================= */

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    width: 150,
    renderCell: (params) => (
      <img
        src={params.value}
        alt={params.row.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    width: 150,
  },
];

/* ================= COMPONENT ================= */

const UserManagement: React.FC = () => {
  const [rows, setRows] = useState<TableUser[]>([]);
  const [isActive, setIsActive] = useState(false);

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "dashboard-users"
  );

  useErrors([
    {
      isError: error,
      error,
    },
  ]);

  useEffect(() => {
    if (data?.users) {
      const mappedRows: TableUser[] = data.users.map((user: User) => ({
        ...user,
        id: user._id,
        avatar: transformImage(user.avatar, 50),
      }));

      setRows(mappedRows);
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <div className="w-full h-screen animate-pulse rounded-xl bg-accent" />
      ) : (
        // <Table heading="All Users" columns={columns} rows={rows} />
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
                  <div className="flex-1 max-w-lg">
                    <label className="relative flex items-center w-full">
                      <div className="absolute left-4 text-slate-400">
                        <span className="material-symbols-outlined">
                          search
                        </span>
                      </div>
                      <input
                        className="w-full h-11 pl-12 pr-4 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-primary/50 text-slate-900 placeholder:text-slate-500"
                        placeholder="Search by name, username, or email..."
                        value=""
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-500">
                      Filter by status:
                    </span>
                    <button className="flex h-9 items-center gap-2 rounded-full text-primary px-3 text-sm font-semibold">
                      <span>All</span>
                    </button>
                    <button className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-3 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors">
                      <span>Active</span>
                    </button>
                    <button className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-3 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors">
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
                    {usersData.map((user) => (
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
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
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
                              <span className="material-symbols-outlined text-xl">
                                edit
                              </span>
                            </button>

                            {user.isBlocked ? (
                              <button
                                className="p-2 text-slate-500 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                                title="Unban User"
                              >
                                <span className="material-symbols-outlined text-xl">
                                  check_circle
                                </span>
                              </button>
                            ) : (
                              <button
                                className="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all"
                                title="Ban User"
                              >
                                <span className="material-symbols-outlined text-xl">
                                  block
                                </span>
                              </button>
                            )}

                            <button
                              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete User"
                            >
                              <span className="material-symbols-outlined text-xl">
                                delete
                              </span>
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
      )}
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
