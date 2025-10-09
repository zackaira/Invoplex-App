import { DocumentView } from "@/app/components/DocumentView";
import { getDocumentById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await getDocumentById(id, "QUOTE");

  if (!document) {
    return notFound();
  }

  return (
    <div className="relative">
      <DocumentView document={document} type="QUOTE" />
    </div>
  );
}
