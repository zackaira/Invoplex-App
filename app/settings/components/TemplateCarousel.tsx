"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAllTemplates } from "@/app/components/documents/templates/registry";
import { TemplateCarouselItem } from "./TemplateCarouselItem";

interface TemplateCarouselProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export function TemplateCarousel({
  selectedTemplate,
  onTemplateSelect,
}: TemplateCarouselProps) {
  const templates = getAllTemplates();

  return (
    <div className="flex items-center justify-center px-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-2xl"
      >
        <CarouselContent>
          {templates.map((template) => (
            <CarouselItem
              key={template.metadata.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <TemplateCarouselItem
                template={template}
                isSelected={selectedTemplate === template.metadata.id}
                onSelect={onTemplateSelect}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
