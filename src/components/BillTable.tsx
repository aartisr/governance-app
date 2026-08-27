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
        <input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Search by bill ID, title, sponsor, or policy area"
          aria-label="Search bills"
        />
        <span>{table.getRowModel().rows.length} bills</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted();
                  const sortable = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : "none" as "none"}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={sortable ? "table-sort-button" : "table-sort-button disabled"}
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={!sortable}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortable ? <span aria-hidden="true">{sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "↕"}</span> : null}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            )) : (
              <tr><td className="table-empty" colSpan={columns.length}>No bills match that search. Try a bill number, sponsor, or policy area.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
