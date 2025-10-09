# Template System Implementation

## ✅ What's Been Created

### Core Template System

- **`/app/components/templates/types.ts`** - TypeScript types and interfaces for templates
- **`/app/components/templates/registry.ts`** - Template registry with helper functions
- **`/app/components/templates/TemplateRenderer.tsx`** - Main component that renders selected template

### Classic Template (Default)

- **`/app/components/templates/classic/ClassicTemplate.tsx`** - Main template component
- **`/app/components/templates/classic/ClassicHeader.tsx`** - Header with business/client info
- **`/app/components/templates/classic/ClassicItems.tsx`** - Line items table
- **`/app/components/templates/classic/ClassicFooter.tsx`** - Totals, notes, and terms

### Integration

- **Updated `DocumentsView.tsx`** - Now uses TemplateRenderer
- **Works with existing quote page** - `/app/quote/[id]/page.tsx` already integrated

## 🚀 How It Works

### For Users

1. Users view quotes/invoices with the Classic template by default
2. Later: Users can select templates in Settings
3. Later: Users can purchase premium templates

### For You (Developer)

1. **To add a new template:**

   ```typescript
   // 1. Create template folder: /app/components/templates/modern/
   // 2. Create ModernTemplate.tsx component
   // 3. Register in registry.ts:

   modern: {
     metadata: {
       id: "modern",
       name: "Modern",
       description: "Clean design",
       preview: "/templates/modern-preview.png",
       isPremium: false,
       tier: "FREE",
     },
     component: ModernTemplate,
   }
   ```

2. **To make a template premium:**
   ```typescript
   {
     isPremium: true,
     price: 9.99,
     tier: "PRO",
     features: ["Custom colors", "Advanced layouts"],
   }
   ```

## 📋 Next Steps

### Phase 1: Database Schema (When Ready)

```prisma
model UserSettings {
  // Add to existing model:
  selectedTemplateId  String  @default("classic")
}

// New model for premium templates:
model TemplatePurchase {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  templateId  String
  price       Decimal  @db.Decimal(10, 2)
  status      PurchaseStatus @default(COMPLETED)
  purchasedAt DateTime @default(now())

  @@unique([userId, templateId])
}
```

### Phase 2: Settings Page

- Create template selector UI
- Show preview cards for each template
- Allow users to select default template
- Show "locked" state for premium templates

### Phase 3: Premium Templates & Payments

- Implement Stripe checkout for template purchases
- Add webhook handler for payment confirmation
- Create template access control functions
- Add "Unlock" buttons for premium templates

### Phase 4: PDF Generation

Choose one approach:

- **Option A:** Puppeteer (reuses React components, full CSS)
- **Option B:** React-PDF (lighter, needs separate components)

Create:

- `/lib/pdf-generator.ts` - PDF generation utility
- `/app/api/documents/[id]/pdf/route.ts` - API endpoint
- Add "Download PDF" button to quote/invoice pages

### Phase 5: Additional Templates

Create more templates:

- Modern (FREE)
- Minimal (FREE)
- Business Pro (PREMIUM $9.99)
- Elegant (PREMIUM $14.99)

## 📁 File Structure

```
app/components/templates/
├── README.md                    ✅ Created
├── types.ts                     ✅ Created
├── registry.ts                  ✅ Created
├── TemplateRenderer.tsx         ✅ Created
└── classic/                     ✅ Created
    ├── ClassicTemplate.tsx
    ├── ClassicHeader.tsx
    ├── ClassicItems.tsx
    └── ClassicFooter.tsx

public/templates/                ✅ Created (empty)
└── [preview images go here]

app/components/DocumentsView.tsx ✅ Updated

# Later:
lib/
├── template-access.ts          ⏳ For premium templates
└── pdf-generator.ts            ⏳ For PDF generation

app/api/
├── templates/purchase/         ⏳ Stripe checkout
└── webhooks/stripe/            ⏳ Payment webhooks
```

## 🔧 Current Status

### Working Now ✅

- Template system architecture is in place
- Classic template renders quotes and invoices
- Quote detail page uses template system
- Easy to add new templates

### To Implement Later ⏳

- Template selector in settings
- Premium template purchases
- PDF generation
- Additional template designs
- Template preview images

## 🎨 Design Notes

The Classic template includes:

- Professional header with business and client info
- Clean table layout for line items
- Comprehensive footer with totals, discounts, tax
- Payment history for invoices
- Notes and terms sections
- Responsive design with Tailwind CSS

## ⚠️ Known Issues

- TypeScript linter may show module resolution errors temporarily (cache issue, will resolve)
- Preview images need to be created and added to `/public/templates/`
- Template selection in settings not yet implemented

## 💡 Tips for Creating New Templates

1. **Follow the Classic pattern** - Use similar component structure
2. **Use shadcn/ui components** - For consistency
3. **Make it print-friendly** - Consider PDF output from the start
4. **Test with different data** - Long descriptions, many items, etc.
5. **Keep branding consistent** - Match your app's design language

## 🤑 Monetization Strategy

Suggested pricing:

- **FREE**: Classic, Simple, Minimal (2-3 templates)
- **PRO ($9.99)**: Modern Pro, Business, Creative
- **PREMIUM ($14.99)**: Elegant, Luxury, Designer
- **BUNDLE ($24.99)**: All Pro templates (save $10)
