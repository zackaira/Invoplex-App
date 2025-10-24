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
import Modal from "@/app/components/Modal";
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
  documentType?: "quote" | "invoice";
  newDocumentRoute?: string;
  onDelete?: (
    ids: string[],
    clearSelection: () => void
  ) => void | Promise<void>;
  statusColumn?: string;
  clearSelection?: () => void;
  isDeleting?: boolean;
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
  documentType = "quote",
  newDocumentRoute,
  onDelete,
  statusColumn = "status",
  clearSelection,
  isDeleting = false,
}: DataTableToolbarProps<TData>) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const toggleStatus = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusChange?.(newStatuses);
  };
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  // Get the edit route for single selected document
  const editRoute = React.useMemo(() => {
    if (selectedCount === 1) {
      const row = selectedRows[0];
      const id = (row.original as any).id;
      return documentType === "invoice"
        ? `/invoice/${id}/edit`
        : `/quote/${id}/edit`;
    }
    return null;
  }, [selectedCount, selectedRows, documentType]);

  // Handle delete action
  const handleDelete = async () => {
    if (selectedCount > 0 && onDelete && clearSelection) {
      const ids = selectedRows.map((row) => (row.original as any).id);
      await onDelete(ids, clearSelection);
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // Calculate status counts
  const statusCounts = React.useMemo(() => {
    const allRows = table.getCoreRowModel().rows;
    const counts: Record<string, number> = {};

    statusFilterOptions.forEach((option) => {
      counts[option.value] = 0;
    });

    allRows.forEach((row) => {
      const status = (row.original as any)[statusColumn];
      if (status && counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  }, [table, statusFilterOptions, statusColumn]);

  // Get document type labels
  const documentLabel = documentType === "invoice" ? "Invoice" : "Quote";
  const documentLabelPlural =
    documentType === "invoice" ? "Invoices" : "Quotes";
  const defaultNewRoute =
    documentType === "invoice" ? "/invoice/new/edit" : "/quote/new/edit";
  const newRoute = newDocumentRoute || defaultNewRoute;

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
          className="max-w-[280px]"
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
                  const count = statusCounts[option.value] || 0;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-between h-9"
                      onClick={() => toggleStatus(option.value)}
                    >
                      <span>{option.label}</span>
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1.5 font-normal ml-2"
                      >
                        {count}
                      </Badge>
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
              tooltip={`Delete ${
                selectedCount > 1 ? documentLabelPlural : documentLabel
              }`}
              side="bottom"
            >
              <Button variant="outline" onClick={openDeleteModal}>
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
            {selectedCount === 1 && editRoute && (
              <TooltipWrapper tooltip={`Edit ${documentLabel}`} side="bottom">
                <Button variant="outline" asChild>
                  <Link href={editRoute}>
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipWrapper>
            )}
          </>
        )}

        {/* New document button */}
        <Button variant="outline" title={`New ${documentLabel}`} asChild>
          <Link href={newRoute}>
            <PlusIcon className="h-4 w-4" />
            New {documentLabel}
          </Link>
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title={`Delete ${
          selectedCount > 1 ? documentLabelPlural : documentLabel
        }?`}
        description={`Are you sure you want to delete ${
          selectedCount > 1
            ? `these ${selectedCount} ${documentLabelPlural.toLowerCase()}`
            : `this ${documentLabel.toLowerCase()}`
        }? This action cannot be undone.`}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDelete}
        submitBtnText="Delete"
        cancelBtnText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
