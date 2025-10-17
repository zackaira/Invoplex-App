/**
 * ============================================================================
 * DOCUMENT MODALS - BARREL EXPORT
 * ============================================================================
 *
 * Centralizes exports for all document-related modal components.
 *
 * Modals include:
 * - BusinessInfoVisibilityModal: Control which business info fields are visible
 * - Client modals: Add/edit clients
 * - Project modals: Create/manage projects
 *
 * Location: /app/components/documents/modals/index.ts
 */

export { BusinessInfoVisibilityModal } from "./BusinessInfoVisibilityModal";
// Note: BusinessInfoVisibility type is exported from ../types.ts

export { AddClientModal, ClientSelect } from "./clients";
export { CreateProjectModal, ProjectSelect } from "./projects";
