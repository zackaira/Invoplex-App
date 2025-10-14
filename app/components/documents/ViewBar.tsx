"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { DocumentWithRelations } from "./templates/types";

export function DocumentViewBar({
  document,
}: {
  document: DocumentWithRelations;
}) {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button asChild size="lg">
          <Link href={`/quote/${document.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Quote
          </Link>
        </Button>
      </div>
    </>
  );
}
