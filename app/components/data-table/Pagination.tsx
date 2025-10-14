"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSize = 50,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100],
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end space-x-2 pl-6 pr-4 py-8">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length === 0
          ? `${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length === 1 ? "item" : "items"
            }`
          : `${table.getFilteredSelectedRowModel().rows.length} of ${
              table.getFilteredRowModel().rows.length
            } ${
              table.getFilteredRowModel().rows.length === 1 ? "item" : "items"
            } selected`}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Show:</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value: string) => {
              onPageSizeChange?.(Number(value));
            }}
            name="page size"
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium">per page</p>
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
