# Shared Document Components

This directory contains reusable components and utilities for building document templates (quotes and invoices).

## Structure

```
shared/
├── hooks/
│   ├── useDocumentCalculations.ts  # Calculation logic for totals, tax, etc.
│   └── useDocumentItems.ts         # Logic for adding/editing/removing items
├── DocumentItemsTable.tsx          # Base component for items table
├── DocumentTotals.tsx              # Base component for totals section
├── utils.ts                        # Utility functions (status colors, formatting)
└── index.ts                        # Barrel exports
```

## Core Concepts

### Separation of Concerns

The shared components follow a clear separation:

- **Logic**: Handled by hooks and base components
- **Presentation**: Provided by templates via render props

This allows each template to have its own unique design while reusing the same business logic.

## Components

### DocumentItemsTable

Handles all logic for managing line items:

- Adding new items
- Editing item fields (description, quantity, price)
- Removing items
- Auto-calculating amounts and totals

**Usage:**

```tsx
<DocumentItemsTable
  document={document}
  isEditable={isEditable}
  onUpdate={onUpdate}
  renderHeader={() => <YourHeaderDesign />}
  renderRow={({ item, isEditable, currency, onUpdate, onRemove }) => (
    <YourRowDesign />
  )}
  renderFooter={(onAdd) => <YourAddButtonDesign />}
/>
```

### DocumentTotals

Handles calculation logic for:

- Subtotal
- Tax (with dynamic tax rate updates)
- Discount
- Total
- Amount paid/due (for invoices)

**Usage:**

```tsx
<DocumentTotals
  document={document}
  type={type}
  isEditable={isEditable}
  onUpdate={onUpdate}
  render={({ document, isEditable, onTaxUpdate, onDiscountUpdate }) => (
    <YourTotalsDesign />
  )}
/>
```

## Hooks

### useDocumentCalculations

Pure calculation functions:

```ts
const { calculateTotals, calculateItemAmount } = useDocumentCalculations();

// Calculate all totals
const totals = calculateTotals(items, taxRate, discount, amountPaid);

// Calculate single item amount
const amount = calculateItemAmount(quantity, unitPrice);
```

### useDocumentItems

Item management functions:

```ts
const { updateItem, addItem, removeItem } = useDocumentItems(
  document,
  onUpdate
);

// These functions handle all the calculation logic automatically
updateItem(itemId, "quantity", "5");
addItem();
removeItem(itemId);
```

## Utilities

```ts
import { getStatusColor, formatDate, formatCurrency } from "./utils";

// Get Tailwind classes for status badge
const className = getStatusColor("PAID");

// Format dates consistently
const formatted = formatDate(new Date());

// Format currency values
const price = formatCurrency(1234.56, "USD");
```

## Creating New Templates

To create a new template:

1. **Create template directory**:

   ```
   templates/
   └── your-template/
       ├── YourTemplateHeader.tsx
       ├── YourTemplateItems.tsx
       ├── YourTemplateFooter.tsx
       └── YourTemplate.tsx
   ```

2. **Use shared components with your design**:

   ```tsx
   import { DocumentItemsTable, DocumentTotals } from "../../shared";

   export function YourTemplateItems({ document, isEditable, onUpdate }) {
     return (
       <DocumentItemsTable
         document={document}
         isEditable={isEditable}
         onUpdate={onUpdate}
         renderHeader={() => <div>Your Custom Header</div>}
         renderRow={({ item, isEditable, currency, onUpdate, onRemove }) => (
           <div>Your Custom Row Design</div>
         )}
         renderFooter={(onAdd) => <button onClick={onAdd}>Add</button>}
       />
     );
   }
   ```

3. **Register your template**:

   ```ts
   // templates/registry.ts
   import { YourTemplate } from "./your-template/YourTemplate";

   export const templateRegistry = {
     // ...
     yourTemplate: {
       metadata: {
         id: "your-template",
         name: "Your Template Name",
         description: "Description of your template",
         preview: "/templates/your-preview.png",
         isPremium: false,
         tier: "FREE",
       },
       component: YourTemplate,
     },
   };
   ```

## Examples

See the existing templates for reference:

- **Classic Template**: Traditional table-based design
- **Modern Template**: Gradient header, card-based items layout

Both templates use the same shared logic but have completely different presentations!
