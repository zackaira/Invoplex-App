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
import { DocumentWithRelations } from "./templates/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DocumentViewBar({
  document,
}: {
  document: DocumentWithRelations;
}) {
  const router = useRouter();

  const handleDuplicate = () => {
    console.log("Duplicate quote");
  };

  const handleConvertToInvoice = () => {
    console.log("Convert to invoice");
  };

  const handleSendToClient = () => {
    console.log("Send to client");
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleArchive = () => {
    console.log("Archive quote");
  };

  const handleDelete = () => {
    console.log("Delete quote");
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
