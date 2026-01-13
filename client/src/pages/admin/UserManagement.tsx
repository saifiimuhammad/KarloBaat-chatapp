import React, { useEffect, useState } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { useFetchData } from "6pp";

import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";
import { transformImage } from "../../lib/features";

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
        <div className="w-full h-screen animate-pulse rounded-xl bg-[var(--color-accent)]" />
      ) : (
        <Table heading="All Users" columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
