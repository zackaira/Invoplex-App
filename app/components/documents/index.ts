/**
 * ============================================================================
 * DOCUMENTS - MAIN BARREL EXPORT
 * ============================================================================
 *
 * This is the main entry point for the documents system.
 *
 * FOLDER STRUCTURE:
 * ├── types.ts               - TypeScript types and interfaces
 * ├── registry.ts            - Template registration and management
 * ├── TemplateRenderer.tsx   - Main document renderer
 * ├── hooks/                 - Shared hooks for document logic
 * ├── bars/                  - View/Edit bars for documents
 * ├── modals/                - All modal components
 * ├── items/                 - Line items table components
 * └── templates/             - Template designs (classic, modern, etc.)
 *     ├── classic/           - Classic template components
 *     └── modern/            - Modern template components
 *
 * HOW TO ADD A NEW TEMPLATE:
 * 1. Create a new folder in /templates/ (e.g., /templates/elegant/)
 * 2. Create template components following the existing structure
 * 3. Register your template in registry.ts
 * 4. Done! It will automatically appear in the template selector
 *
 * Location: /app/components/documents/index.ts
 */

// ============================================================================
// CORE EXPORTS
// ============================================================================

// Main renderer component
export { TemplateRenderer } from "./TemplateRenderer";

// Types and interfaces
export * from "./types";

// Template registry
export * from "./registry";

// ============================================================================
// SUB-MODULE EXPORTS
// ============================================================================

// Hooks
export * from "./hooks";

// Bars (View/Edit bars)
export * from "./bars";

// Modals
export * from "./modals";
