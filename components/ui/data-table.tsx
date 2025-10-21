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
import {
  DateFilterValue,
  FiscalYearSettings,
  getDateRangeForFilter,
  isDateInRange,
} from "@/lib/date-utils";

export type { StatusFilterOption };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  statusFilterColumn?: string;
  statusFilterOptions?: StatusFilterOption[];
  dateFilterColumn?: string;
  fiscalYearSettings?: FiscalYearSettings;
  documentType?: "quote" | "invoice";
  newDocumentRoute?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filter...",
  statusFilterColumn,
  statusFilterOptions = [],
  dateFilterColumn,
  fiscalYearSettings = { fiscalYearStartMonth: 3, fiscalYearStartDay: 1 },
  documentType = "quote",
  newDocumentRoute,
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
  const [dateFilter, setDateFilter] =
    React.useState<DateFilterValue>("last_3_months");
  const [itemsToShow, setItemsToShow] = React.useState(50);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [hasLoadedMore, setHasLoadedMore] = React.useState(false);

  // Filter data by date range before passing to table
  const filteredData = React.useMemo(() => {
    if (!dateFilterColumn) return data;

    const dateRange = getDateRangeForFilter(dateFilter, fiscalYearSettings);
    if (!dateRange) return data; // "all_time" selected

    return data.filter((row) => {
      const dateValue = (row as any)[dateFilterColumn];
      return isDateInRange(dateValue, dateRange);
    });
  }, [data, dateFilter, dateFilterColumn, fiscalYearSettings]);

  // Slice data for "load more" functionality
  const displayData = React.useMemo(() => {
    return filteredData.slice(0, itemsToShow);
  }, [filteredData, itemsToShow]);

  const table = useReactTable({
    data: displayData,
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
    manualPagination: true,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Reset items to show when filters change
  React.useEffect(() => {
    setItemsToShow(pagination.pageSize);
    setHasLoadedMore(false);
  }, [dateFilter, columnFilters, pagination.pageSize]);

  // Check if there's more data to load
  const hasMore = itemsToShow < filteredData.length;

  // Handle load more
  const handleLoadMore = React.useCallback(() => {
    setIsLoadingMore(true);
    setHasLoadedMore(true);
    // Simulate loading delay for better UX (even though data is already available)
    setTimeout(() => {
      setItemsToShow((prev) =>
        Math.min(prev + pagination.pageSize, filteredData.length)
      );
      setIsLoadingMore(false);
    }, 200);
  }, [pagination.pageSize, filteredData.length]);

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
        statusFilterOptions={statusFilterOptions}
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
        selectedDateFilter={dateFilter}
        onDateFilterChange={dateFilterColumn ? setDateFilter : undefined}
        fiscalYearSettings={fiscalYearSettings}
        documentType={documentType}
        newDocumentRoute={newDocumentRoute}
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
        onPageSizeChange={(size) => {
          table.setPageSize(size);
          setItemsToShow(size);
        }}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoading={isLoadingMore}
        selectedDateFilter={dateFilter}
        hasLoadedMore={hasLoadedMore}
      />
    </div>
  );
}
