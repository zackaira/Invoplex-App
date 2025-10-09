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
    <div className="flex justify-between items-center border-b px-6 py-4">
      <div>
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div>
        <Button asChild size="lg">
          <Link href={`/quote/${document.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Quote
          </Link>
        </Button>
      </div>
    </div>
  );
}
