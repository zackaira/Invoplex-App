# Document Templates System

This directory contains the template system for quotes and invoices.

## Structure

```
templates/
├── types.ts              # TypeScript types and interfaces
├── registry.ts           # Template registry and helper functions
├── TemplateRenderer.tsx  # Main renderer component
└── [template-name]/      # Individual template folders
    ├── [TemplateName]Template.tsx
    ├── [TemplateName]Header.tsx
    ├── [TemplateName]Items.tsx
    └── [TemplateName]Footer.tsx
```

## Adding a New Template

1. Create a new folder with your template name (e.g., `modern/`)
2. Create the template components following the naming pattern
3. Import and register it in `registry.ts`

Example:

```typescript
// In registry.ts
import { ModernTemplate } from "./modern/ModernTemplate";

export const templateRegistry: Record<string, Template> = {
  // ... existing templates
  modern: {
    metadata: {
      id: "modern",
      name: "Modern",
      description: "Clean, contemporary design",
      preview: "/templates/modern-preview.png",
      isPremium: false,
      tier: "FREE",
    },
    component: ModernTemplate,
  },
};
```

## Available Templates

### Classic (FREE)

Traditional professional layout with clean design

## Premium Templates

To create a premium template, set `isPremium: true` and add a price:

```typescript
{
  metadata: {
    id: "elegant",
    name: "Elegant",
    isPremium: true,
    price: 14.99,
    tier: "PREMIUM",
    features: ["Premium typography", "Luxury styling"],
  },
  component: ElegantTemplate,
}
```

## Usage

Templates are automatically rendered through the `DocumentView` component:

```typescript
<DocumentView
  document={document}
  type="QUOTE"
  templateId="classic" // Optional, defaults to "classic"
/>
```
