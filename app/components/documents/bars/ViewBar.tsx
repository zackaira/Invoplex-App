/**
 * ============================================================================
 * DOCUMENT VIEW BAR
 * ============================================================================
 *
 * Action bar displayed when viewing a document (not in edit mode).
 *
 * Features:
 * - Back navigation
 * - PDF preview and download
 * - Mark as accepted
 * - Edit document
 * - Document actions (duplicate, convert, send, archive, delete)
 *
 * Location: /app/components/documents/bars/ViewBar.tsx
 * Used by: TemplateRenderer (when isEditable = false)
 */

"use client";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/app/components/ui/TooltipWrapper";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  DownloadCloud,
  FileText,
  Mail,
  MoreVertical,
  Pencil,
  Printer,
  Archive,
  Trash2,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DocumentWithRelations } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * DocumentViewBar Component
 *
 * Displays action buttons for viewing and managing a document.
 *
 * @param document - The document being viewed
 */
export function DocumentViewBar({
  document,
}: {
  document: DocumentWithRelations;
}) {
  const router = useRouter();

  // =========================================================================
  // ACTION HANDLERS
  // =========================================================================

  /** Creates a duplicate copy of the document */
  const handleDuplicate = () => {
    console.log("Duplicate quote");
    // TODO: Implement duplicate functionality
  };

  /** Converts a quote to an invoice */
  const handleConvertToInvoice = () => {
    console.log("Convert to invoice");
    // TODO: Implement conversion functionality
  };

  /** Sends the document to the client via email */
  const handleSendToClient = () => {
    console.log("Send to client");
    // TODO: Implement email sending functionality
  };

  /** Downloads the document as PDF */
  const handleDownloadPDF = () => {
    console.log("Download PDF");
    // TODO: Implement PDF generation and download
  };

  /** Opens the browser print dialog */
  const handlePrint = () => {
    window.print();
  };

  /** Archives the document */
  const handleArchive = () => {
    console.log("Archive quote");
    // TODO: Implement archive functionality
  };

  /** Deletes the document */
  const handleDelete = () => {
    console.log("Delete quote");
    // TODO: Implement delete functionality with confirmation
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <TooltipWrapper tooltip="Go back" side="bottom">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </TooltipWrapper>
      </div>

      <div className="flex items-center gap-4">
        {/* Action buttons group */}
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <TooltipWrapper tooltip="Preview PDF" side="bottom">
            <Button
              variant="outline"
              size="icon"
              className="rounded-r-none border-r-0"
              onClick={handleDownloadPDF}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </TooltipWrapper>

          <TooltipWrapper tooltip="Download PDF" side="bottom">
            <Button
              variant="outline"
              size="icon"
              className="rounded-none border-r-0"
              onClick={handleDownloadPDF}
            >
              <DownloadCloud className="h-4 w-4" />
            </Button>
          </TooltipWrapper>

          <TooltipWrapper tooltip="Mark as accepted" side="bottom">
            <Button
              variant="outline"
              size="icon"
              className="rounded-l-none"
              onClick={() => {}}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          </TooltipWrapper>
        </div>

        {/* Edit button group with dropdown */}
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <TooltipWrapper tooltip="Edit this quote" side="bottom">
            <Button asChild size="lg" className="rounded-r-none border-r-0">
              <Link href={`/quote/${document.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Quote
              </Link>
            </Button>
          </TooltipWrapper>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="lg" className="rounded-l-none px-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy />
                Duplicate Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleConvertToInvoice}>
                <Receipt />
                Convert to Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSendToClient}>
                <Mail />
                Send to Client
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPDF}>
                <DownloadCloud />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer />
                Print
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleArchive}>
                <Archive />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} variant="destructive">
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
