"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import type { StatusFilterOption } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { deleteDocuments } from "@/lib/actions";
import { toast } from "sonner";
import { FiscalYearSettings } from "@/lib/date-utils";

interface DataTableWrapperProps<TData, TValue> {
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

export function DataTableWrapper<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder,
  statusFilterColumn,
  statusFilterOptions,
  dateFilterColumn,
  fiscalYearSettings,
  documentType = "quote",
  newDocumentRoute,
}: DataTableWrapperProps<TData, TValue>) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (ids: string[], clearSelection: () => void) => {
    setIsDeleting(true);
    try {
      const result = await deleteDocuments(ids);

      if (result.success) {
        toast.success(
          `Successfully deleted ${result.count} ${documentType}${
            result.count > 1 ? "s" : ""
          }`
        );
        clearSelection();
      }
    } catch (error) {
      console.error(`Error deleting ${documentType}s:`, error);
      toast.error(`Failed to delete ${documentType}s`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn={filterColumn}
      filterPlaceholder={filterPlaceholder}
      statusFilterColumn={statusFilterColumn}
      statusFilterOptions={statusFilterOptions}
      dateFilterColumn={dateFilterColumn}
      fiscalYearSettings={fiscalYearSettings}
      documentType={documentType}
      newDocumentRoute={newDocumentRoute}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  );
}
