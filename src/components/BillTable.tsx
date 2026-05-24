import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { Bill } from "../domain/types";
import { Badge } from "./ui";

const columnHelper = createColumnHelper<Bill>();

export function BillTable({ bills }: { bills: Bill[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Bill",
        cell: (info) => (
          <Link to="/bills/$billId" params={{ billId: info.row.original.id }} className="table-link">
            {info.getValue().toUpperCase()}
          </Link>
        ),
      }),
      columnHelper.accessor("title", { header: "Title" }),
      columnHelper.accessor("sponsor", { header: "Sponsor" }),
      columnHelper.accessor("domain", {
        header: "Domain",
        cell: (info) => <Badge tone="violet">{info.getValue()}</Badge>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <Badge tone={info.getValue() === "stalled" ? "amber" : "green"}>{info.getValue()}</Badge>,
      }),
      columnHelper.accessor((row) => row.sections.length, {
        id: "sections",
        header: "Sections",
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: bills,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="table-panel">
      <div className="table-toolbar">
        <input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Search bills, sponsors, domains" />
        <span>{table.getRowModel().rows.length} bills</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
