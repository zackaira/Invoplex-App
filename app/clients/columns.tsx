"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical, Copy, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { TooltipWrapper } from "../components/ui/TooltipWrapper";
import Link from "next/link";

// Extend ColumnMeta to include width properties and display label
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    width?: string;
    label?: string;
  }
}

// This type represents a client
export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  outstanding: number;
  currency: string;
  createdAt: Date;
};

// Define the order you want columns to appear
const columnOrder = [
  "select",
  "name",
  "email",
  "phone",
  "outstanding",
  "actions",
];

// Define all column definitions (order doesn't matter here)
const columnDefinitions: ColumnDef<Client>[] = [
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
    accessorKey: "name",
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
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/client/${row.original.id}`}
          className="text-md font-medium cursor-pointer transition-colors py-4 group-hover/row:text-invoplex"
        >
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    meta: {
      width: "280px",
      label: "Email",
    },
    header: () => <div className="text-right">Email</div>,
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;

      const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (email) {
          navigator.clipboard.writeText(email);
          toast.success("Email copied to clipboard");
        }
      };

      const handleEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (email) {
          window.location.href = `mailto:${email}`;
        }
      };

      return (
        <div className="group/email-cell flex items-center justify-end text-muted-foreground py-4">
          {email ? (
            <div className="flex items-center justify-end gap-2 w-full">
              <div className="flex items-center gap-0 opacity-0 group-hover/email-cell:opacity-100 transition-opacity">
                <TooltipWrapper tooltip="Copy email" side="top">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip="Send email" side="top">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleEmail}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                </TooltipWrapper>
              </div>

              <span className="truncate">{email}</span>
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    meta: {
      width: "200px",
      label: "Phone Number",
    },
    header: () => <div className="text-right">Phone Number</div>,
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | null;

      const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (phone) {
          navigator.clipboard.writeText(phone);
          toast.success("Phone number copied to clipboard");
        }
      };

      const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (phone) {
          window.location.href = `tel:${phone}`;
        }
      };

      return (
        <div className="group/phone-cell flex items-center justify-end text-muted-foreground py-4">
          {phone ? (
            <div className="flex items-center justify-end gap-2 w-full">
              <div className="flex items-center gap-0 opacity-0 group-hover/phone-cell:opacity-100 transition-opacity">
                <TooltipWrapper tooltip="Copy phone number" side="top">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltip="Call client" side="top">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleCall}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
                </TooltipWrapper>
              </div>

              <span className="truncate">{phone}</span>
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "outstanding",
    meta: {
      width: "130px",
      label: "Outstanding",
    },
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0! hover:bg-transparent!"
          >
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            Outstanding
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("outstanding") as number;
      const currency = row.original.currency;

      if (amount === 0) {
        return (
          <div className="text-right text-gray-400 py-4">
            <span>—</span>
          </div>
        );
      }

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(amount);

      return (
        <div className="text-right py-4">
          <TooltipWrapper
            tooltip={`Total outstanding balance from unpaid invoices`}
            side="top"
          >
            <span className="font-medium text-orange-600 dark:text-orange-400">
              {formatted}
            </span>
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
      const client = row.original;

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
              <Link href={`/client/${client.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/client/${client.id}`}>View details</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => console.log("Recording a payment...", client.id)}
            >
              Record Payment
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive">
              Delete client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Helper function to get column identifier
const getColumnId = (column: ColumnDef<Client>): string => {
  if ("id" in column && column.id) return column.id;
  if ("accessorKey" in column && column.accessorKey)
    return column.accessorKey as string;
  return "";
};

// Create a map of columns by their id/accessorKey
const columnMap = new Map<string, ColumnDef<Client>>();
columnDefinitions.forEach((col) => {
  const id = getColumnId(col);
  if (id) columnMap.set(id, col);
});

// Reorder columns based on columnOrder array
export const columns: ColumnDef<Client>[] = columnOrder
  .map((id) => columnMap.get(id))
  .filter((col): col is ColumnDef<Client> => col !== undefined);
