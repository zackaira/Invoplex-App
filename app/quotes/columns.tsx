"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { TooltipWrapper } from "../components/ui/TooltipWrapper";

// Extend ColumnMeta to include width properties and display label
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    width?: string;
    label?: string;
  }
}

// This type represents a quote with its client relationship
export type Quote = {
  id: string;
  documentNumber: string;
  status: string;
  createdAt: Date;
  total: number;
  currency: string;
  client: {
    name: string;
  };
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  CONVERTED:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
};

// Define the order you want columns to appear
const columnOrder = [
  "select",
  "documentNumber",
  "client.name",
  "total",
  "status",
  "createdAt",
  "actions",
];

// Define all column definitions (order doesn't matter here)
const columnDefinitions: ColumnDef<Quote>[] = [
  {
    id: "select",
    meta: {
      width: "50px",
      label: "Select",
    },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        name="select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        name="select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    meta: {
      width: "165px",
      label: "Status",
    },
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="text-right">
          {status !== "DRAFT" ? (
            <TooltipWrapper
              tooltip={`Status changed to ${status} on this date`}
              side="top"
            >
              <span
                className={`inline-flex justify-center rounded-sm min-w-[90px] px-2.5 py-0.5 text-xs font-medium ${
                  statusColors[status] || statusColors.DRAFT
                }`}
              >
                {status}
              </span>
            </TooltipWrapper>
          ) : (
            <span
              className={`inline-flex justify-center rounded-sm min-w-[90px] px-2.5 py-0.5 text-xs font-medium ${
                statusColors[status] || statusColors.DRAFT
              }`}
            >
              {status}
            </span>
          )}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (
        !filterValue ||
        !Array.isArray(filterValue) ||
        filterValue.length === 0
      ) {
        return true;
      }
      const value = row.getValue(columnId) as string;
      return filterValue.includes(value);
    },
  },
  {
    accessorKey: "createdAt",
    meta: {
      width: "155px",
      label: "Created",
    },
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0! hover:bg-transparent!"
          >
            <ArrowUpDown className="mr-2 h-4 w-4 text-gray-400" />
            Created
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(date);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "documentNumber",
    meta: {
      width: "110px",
      label: "No.",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0! hover:bg-transparent!"
        >
          No.
          <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          onClick={() => row.toggleSelected(!row.getIsSelected())}
          className="text-md font-medium cursor-pointer hover:opacity-70 transition-opacity py-4"
        >
          {row.getValue("documentNumber")}
        </div>
      );
    },
  },
  {
    id: "client.name",
    accessorKey: "client.name",
    meta: {
      width: "",
      label: "Client",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0! hover:bg-transparent!"
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/quote/${row.original.id}`}
          className="text-md font-medium cursor-pointer hover:opacity-70 transition-opacity py-4"
        >
          {row.original.client.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "total",
    meta: {
      width: "120px",
      label: "Amount Due",
    },
    header: () => <div className="text-right">Amount Due</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const currency = row.original.currency;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(amount);

      return (
        <div className="text-right">
          <TooltipWrapper
            tooltip={`Last Payment of [amount] received on [date]`}
            side="top"
          >
            <span>{formatted}</span>
          </TooltipWrapper>
        </div>
      );
    },
  },
  {
    id: "actions",
    meta: {
      width: "48px",
      label: "Actions",
    },
    enableHiding: false,
    cell: ({ row }) => {
      const quote = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/quote/${quote.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Duplicating Quote...")}
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Downloading PDF...")}>
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Converting Quote to Invoice...")}
            >
              Convert to invoice
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete quote
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Helper function to get column identifier
const getColumnId = (column: ColumnDef<Quote>): string => {
  if ("id" in column && column.id) return column.id;
  if ("accessorKey" in column && column.accessorKey)
    return column.accessorKey as string;
  return "";
};

// Create a map of columns by their id/accessorKey
const columnMap = new Map<string, ColumnDef<Quote>>();
columnDefinitions.forEach((col) => {
  const id = getColumnId(col);
  if (id) columnMap.set(id, col);
});

// Reorder columns based on columnOrder array
export const columns: ColumnDef<Quote>[] = columnOrder
  .map((id) => columnMap.get(id))
  .filter((col): col is ColumnDef<Quote> => col !== undefined);
