"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DataTableToolbar,
  StatusFilterOption,
} from "@/app/components/datatables/DataTableToolbar";
import { DataTablePagination } from "@/app/components/datatables/DataTablePagination";
import { DataTableHeader } from "@/app/components/datatables/DataTableHeader";
import { DataTableBody } from "@/app/components/datatables/DataTableBody";
import { Table } from "@/components/ui/table";

export type { StatusFilterOption };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  statusFilterColumn?: string;
  statusFilterOptions?: StatusFilterOption[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filter...",
  statusFilterColumn,
  statusFilterOptions = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [pageSize, setPageSize] = React.useState(50);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Update the page size whenever pageSize changes
  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  // Update the status filter whenever selectedStatuses changes
  React.useEffect(() => {
    if (statusFilterColumn) {
      if (selectedStatuses.length === 0) {
        table.getColumn(statusFilterColumn)?.setFilterValue(undefined);
      } else {
        table.getColumn(statusFilterColumn)?.setFilterValue(selectedStatuses);
      }
    }
  }, [selectedStatuses, statusFilterColumn, table]);

  return (
    <div className="w-full">
      <DataTableToolbar
        table={table}
        filterColumn={filterColumn}
        filterPlaceholder={filterPlaceholder}
        statusFilterColumn={statusFilterColumn}
        statusFilterOptions={statusFilterOptions}
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
      />
      <div className="overflow-hidden">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination
        table={table}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
