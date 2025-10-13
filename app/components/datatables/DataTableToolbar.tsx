"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Download, Filter, PencilIcon, PlusIcon, Trash, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export interface StatusFilterOption {
  value: string;
  label: string;
  color?: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumn?: string;
  filterPlaceholder?: string;
  statusFilterColumn?: string;
  statusFilterOptions?: StatusFilterOption[];
  selectedStatuses?: string[];
  onStatusChange?: (statuses: string[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  filterColumn,
  filterPlaceholder = "Filter...",
  statusFilterColumn,
  statusFilterOptions = [],
  selectedStatuses = [],
  onStatusChange,
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

      {/* Status */}
      {statusFilterOptions.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed">
              <Filter className="mr-2 h-4 w-4" />
              Status
              {selectedStatuses.length > 0 && (
                <>
                  <div className="mx-2 h-4 w-[1px] bg-border" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedStatuses.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align="start">
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Filter by status</p>
                {selectedStatuses.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={clearStatusFilters}
                  >
                    Clear
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {statusFilterOptions.map((option) => {
                  const isSelected = selectedStatuses.includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="h-8"
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
            <Button
              variant="outline"
              title={`Delete Quote${selectedCount > 1 ? "s" : ""}`}
            >
              <Trash className="h-4 w-4" />
            </Button>

            {/* download icon */}
            <Button
              variant="outline"
              title={`Download PDF${selectedCount > 1 ? "s" : ""}`}
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* edit icon */}
            {selectedCount === 1 && (
              <Button
                variant="outline"
                title={`Edit${selectedCount > 1 ? "s" : ""}`}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
          </>
        )}

        {/* download icon */}
        <Button variant="outline" title="New Quote">
          <PlusIcon className="h-4 w-4" />
          New
        </Button>
      </div>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.columnDef.meta?.label || column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
