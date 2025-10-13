"use client";

import * as React from "react";
import { Table, flexRender, ColumnDef } from "@tanstack/react-table";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface DataTableBodyProps<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  emptyMessage?: string;
}

export function DataTableBody<TData, TValue>({
  table,
  columns,
  emptyMessage = "No results.",
}: DataTableBodyProps<TData, TValue>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="py-4"
                style={{
                  width: cell.column.columnDef.meta?.width,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center py-4">
            {emptyMessage}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
