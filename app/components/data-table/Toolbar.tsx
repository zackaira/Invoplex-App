"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
  CalendarDays,
  Download,
  Filter,
  PencilIcon,
  PlusIcon,
  Trash,
  X,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { TooltipWrapper } from "@/app/components/ui/TooltipWrapper";
import {
  DateFilterValue,
  FiscalYearSettings,
  getDateFilterOptions,
} from "@/lib/date-utils";

export interface StatusFilterOption {
  value: string;
  label: string;
  color?: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumn?: string;
  filterPlaceholder?: string;
  statusFilterOptions?: StatusFilterOption[];
  selectedStatuses?: string[];
  onStatusChange?: (statuses: string[]) => void;
  selectedDateFilter?: DateFilterValue;
  onDateFilterChange?: (filter: DateFilterValue) => void;
  fiscalYearSettings?: FiscalYearSettings;
}

export function DataTableToolbar<TData>({
  table,
  filterColumn,
  filterPlaceholder = "Filter...",
  statusFilterOptions = [],
  selectedStatuses = [],
  onStatusChange,
  selectedDateFilter = "last_3_months",
  onDateFilterChange,
  fiscalYearSettings = { fiscalYearStartMonth: 3, fiscalYearStartDay: 1 },
}: DataTableToolbarProps<TData>) {
  const toggleStatus = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusChange?.(newStatuses);
  };
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const clearStatusFilters = () => {
    onStatusChange?.([]);
  };

  const dateFilterOptions = React.useMemo(() => {
    return getDateFilterOptions(fiscalYearSettings);
  }, [fiscalYearSettings]);

  const currentDateFilterLabel = React.useMemo(() => {
    return (
      dateFilterOptions.find((opt) => opt.value === selectedDateFilter)
        ?.label || "Filter by date"
    );
  }, [selectedDateFilter, dateFilterOptions]);

  return (
    <div className="flex items-center gap-2 pl-6 pr-4 py-6">
      {/* Search Filter */}
      {filterColumn && (
        <Input
          placeholder={filterPlaceholder}
          value={
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          name="search filter"
        />
      )}

      {/* Date Range Filter */}
      {onDateFilterChange && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed">
              <CalendarDays className="h-4 w-4" />
              {currentDateFilterLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <div className="space-y-1 p-2">
              {dateFilterOptions.map((option) => {
                const isSelected = selectedDateFilter === option.value;
                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-9"
                    onClick={() => onDateFilterChange(option.value)}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Status */}
      {statusFilterOptions.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed">
              <Filter className="h-4 w-4" />
              Status
              {selectedStatuses.length > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-0" align="start">
            <div className="space-y-2">
              <div className="flex items-center justify-between pt-4 px-5">
                <p className="text-sm font-medium">Filter by status</p>
              </div>
              <div className="space-y-1 p-2">
                {statusFilterOptions.map((option) => {
                  const isSelected = selectedStatuses.includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-9"
                      onClick={() => toggleStatus(option.value)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Actions - align to the right */}
      <div className="flex-1 flex justify-end gap-2">
        {selectedCount > 0 && (
          <>
            {/* delete icon */}
            <TooltipWrapper
              tooltip={`Delete Quote${selectedCount > 1 ? "s" : ""}`}
              side="bottom"
            >
              <Button variant="outline">
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipWrapper>

            {/* download icon */}
            <TooltipWrapper
              tooltip={`Download PDF${selectedCount > 1 ? "s" : ""}`}
              side="bottom"
            >
              <Button
                variant="outline"
                title={`Download PDF${selectedCount > 1 ? "s" : ""}`}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipWrapper>

            {/* edit icon */}
            {selectedCount === 1 && (
              <TooltipWrapper tooltip="Edit Quote" side="bottom">
                <Button variant="outline">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TooltipWrapper>
            )}
          </>
        )}

        {/* download icon */}
        <Button variant="outline" title="New Quote" asChild>
          <Link href="/quote/new/edit">
            <PlusIcon className="h-4 w-4" />
            New Quote
          </Link>
        </Button>
      </div>
    </div>
  );
}
