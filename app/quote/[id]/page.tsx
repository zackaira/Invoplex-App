import { TemplateRenderer } from "@/app/components/documents/TemplateRenderer";
import { getDocumentById } from "@/lib/actions";
import { notFound, redirect } from "next/navigation";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Redirect to quotes page if ID is missing or invalid
  if (!id || id.trim() === "") {
    redirect("/quotes");
  }

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
