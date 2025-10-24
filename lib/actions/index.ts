/**
 * Actions Index
 *
 * Central export point for all server actions
 */

// Client actions
export {
  getClientsByUserId,
  getClientsWithOutstanding,
  getClientById,
  createClientWithContact,
  updateClient,
  createContact,
  updateContact,
  deleteContact,
  setPrimaryContact,
} from "./clients";

// Document actions (quotes & invoices)
export {
  getQuotesByUserId,
  getInvoicesByUserId,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  deleteDocuments,
  saveDefaultBusinessFieldsVisibility,
  saveDefaultClientFieldsVisibility,
} from "./documents";

// Product actions
export { getSavedProducts, saveProduct, deleteProduct } from "./products";

// Project actions
export {
  getProjectsByUserId,
  getProjectsByClientId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  archiveProject,
  unarchiveProject,
} from "./projects";

// Settings & User actions (from settings.ts)
export {
  getFirstUser,
  getUserSettings,
  saveBusinessProfile,
  saveBrandSettings,
  saveFinancialSettings,
  saveQuoteSettings,
  saveInvoiceSettings,
  saveTemplateSettings,
  type ActionResult,
} from "./settings";
