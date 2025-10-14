import { TemplateRenderer } from "@/app/components/documents/TemplateRenderer";
import { getDocumentById } from "@/lib/actions";
import { notFound } from "next/navigation";

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
      <TemplateRenderer document={document} type="QUOTE" />
    </div>
  );
}
