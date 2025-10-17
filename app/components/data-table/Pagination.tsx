"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateFilterValue } from "@/lib/date-utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  selectedDateFilter?: DateFilterValue;
  hasLoadedMore?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSize = 50,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100],
  hasMore = false,
  onLoadMore,
  isLoading = false,
  selectedDateFilter = "last_3_months",
  hasLoadedMore = false,
}: DataTablePaginationProps<TData>) {
  const getEndMessage = () => {
    const filterMessages: Record<DateFilterValue, string> = {
      last_3_months: "That's all for the last 3 months",
      last_6_months: "That's all for the last 6 months",
      this_fiscal_year: "That's all for this financial year",
      last_fiscal_year: "That's all for last financial year",
    };
    return filterMessages[selectedDateFilter];
  };

  return (
    <div className="flex items-center justify-between pl-6 pr-4 py-8">
      {/* Left: Item count / selection */}
      <div className="text-muted-foreground text-sm">
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

      {/* Center: Load More Button or End Message */}
      <div className="flex justify-center">
        {hasMore ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        ) : (
          hasLoadedMore && (
            <p className="text-sm text-muted-foreground">{getEndMessage()}</p>
          )
        )}
      </div>

      {/* Right: Page size selector */}
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
    </div>
  );
}
