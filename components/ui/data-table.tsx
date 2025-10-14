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
} from "@/app/components/data-table/Toolbar";
import { DataTablePagination } from "@/app/components/data-table/Pagination";
import { DataTableHeader } from "@/app/components/data-table/Header";
import { DataTableBody } from "@/app/components/data-table/Body";
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
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Get current status filter value
  const selectedStatuses = React.useMemo(() => {
    if (!statusFilterColumn) return [];
    const filterValue = columnFilters.find(
      (filter) => filter.id === statusFilterColumn
    )?.value;
    return Array.isArray(filterValue) ? filterValue : [];
  }, [columnFilters, statusFilterColumn]);

  // Handle status change by updating column filters
  const handleStatusChange = React.useCallback(
    (statuses: string[]) => {
      if (statusFilterColumn) {
        table
          .getColumn(statusFilterColumn)
          ?.setFilterValue(statuses.length > 0 ? statuses : undefined);
      }
    },
    [statusFilterColumn, table]
  );

  return (
    <div className="w-full">
      <DataTableToolbar
        table={table}
        filterColumn={filterColumn}
        filterPlaceholder={filterPlaceholder}
        statusFilterColumn={statusFilterColumn}
        statusFilterOptions={statusFilterOptions}
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
      />
      <div className="overflow-hidden">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination
        table={table}
        pageSize={pagination.pageSize}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  );
}
