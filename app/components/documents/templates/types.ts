import { Prisma } from "@/app/generated/prisma";

export type DocumentWithRelations = Prisma.DocumentGetPayload<{
  include: {
    client: true;
    contact: true;
    items: true;
    payments: true;
  };
}>;

export interface TemplateProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onOpenProjectModal?: () => void;
  onOpenClientModal?: () => void;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  preview: string;
  category?: string;
  isPremium: boolean;
  price?: number;
  features?: string[];
  tier?: "FREE" | "PRO" | "PREMIUM";
}

export interface Template {
  metadata: TemplateMetadata;
  component: React.ComponentType<TemplateProps>;
  pdfComponent?: React.ComponentType<TemplateProps>;
  containerClassName?: string;
}
