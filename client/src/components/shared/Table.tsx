import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

interface TableProps {
  rows: any[];
  columns: GridColDef[];
  heading: string;
  rowHeight?: number;
}

const Table: React.FC<TableProps> = ({
  rows,
  columns,
  heading,
  rowHeight = 52,
}) => {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="w-full h-full max-w-7xl rounded-2xl bg-background-2 px-16 py-6 overflow-hidden">
        <h1 className="text-center text-2xl font-semibold uppercase text-text mb-8">
          {heading}
        </h1>

        <div className="h-[80%]">
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={rowHeight}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "var(--color-text)",
                color: "#fff",
                fontWeight: "600",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
