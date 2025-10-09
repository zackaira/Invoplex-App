import {
  PrismaClient,
  DocumentType,
  DocumentStatus,
  PaymentMethod,
  ProductType,
} from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding the database...");

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.documentItem.deleteMany();
  await prisma.document.deleteMany();
  await prisma.product.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.client.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.businessProfile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create 3 Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "zack@kairaweb.com",
        name: "Zack Viljoen",
        emailVerified: new Date(),
        image: "https://i.pravatar.cc/150?img=1",
      },
    }),
    prisma.user.create({
      data: {
        email: "jane.smith@example.com",
        name: "Jane Smith",
        emailVerified: new Date(),
        image: "https://i.pravatar.cc/150?img=5",
      },
    }),
    prisma.user.create({
      data: {
        email: "mike.wilson@example.com",
        name: "Mike Wilson",
        emailVerified: new Date(),
        image: "https://i.pravatar.cc/150?img=12",
      },
    }),
  ]);

  console.log("✓ Created 3 users");

  // For each user, create business profile, settings, clients, etc.
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(`\nSeeding data for ${user.name}...`);

    // Create Business Profile
    const businessNames = [
      "TechSolutions Inc.",
      "Creative Designs Co.",
      "Consulting Experts LLC",
    ];
    await prisma.businessProfile.create({
      data: {
        userId: user.id,
        businessName: businessNames[i],
        email: user.email,
        phone: `+1 (555) ${100 + i}00-${1000 + i}`,
        website: `https://www.${businessNames[i]
          .toLowerCase()
          .replace(/\s+/g, "")}.com`,
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          businessNames[i]
        )}&size=200`,
        address: `${100 + i * 10} Business Street`,
        city: ["New York", "Los Angeles", "Chicago"][i],
        state: ["NY", "CA", "IL"][i],
        zipCode: `1000${i}`,
        country: "USA",
        taxId: `TAX-${1000 + i}-${2000 + i}`,
        registrationNumber: `REG-${3000 + i}`,
      },
    });

    // Create User Settings
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        quotePrefix: "Q",
        quoteNextNumber: 21,
        quoteValidityDays: 30,
        quoteDefaultTerms:
          "This quote is valid for 30 days from the date of issue.",
        quoteDefaultNotes:
          "Thank you for considering our services. Please contact us if you have any questions.",
        invoicePrefix: "INV",
        invoiceNextNumber: 21,
        invoiceDefaultDueDays: 30,
        invoiceDefaultTerms:
          "Payment is due within 30 days. Late payments may incur additional fees.",
        invoiceDefaultNotes: "Thank you for your business!",
        defaultTaxRate: 8.5,
        defaultCurrency: "USD",
      },
    });

    // Create 4 Clients for each user
    const clientNames = [
      [
        "Acme Corporation",
        "Global Tech Industries",
        "StartUp Ventures",
        "Enterprise Solutions",
      ],
      [
        "Creative Studios",
        "Marketing Masters",
        "Design Dynamics",
        "Brand Builders",
      ],
      [
        "Financial Services Co.",
        "Investment Group",
        "Business Analytics",
        "Data Solutions",
      ],
    ];

    const clients = await Promise.all(
      clientNames[i].map((name, idx) =>
        prisma.client.create({
          data: {
            userId: user.id,
            name: name,
            email: `contact@${name.toLowerCase().replace(/\s+/g, "")}.com`,
            phone: `+1 (555) ${200 + idx}00-${4000 + idx}`,
            website: `https://www.${name
              .toLowerCase()
              .replace(/\s+/g, "")}.com`,
            address: `${500 + idx * 50} Client Avenue`,
            city: ["Boston", "Seattle", "Austin", "Denver"][idx],
            state: ["MA", "WA", "TX", "CO"][idx],
            zipCode: `${20000 + idx * 100}`,
            country: "USA",
            currency: "USD",
            taxId: `CLT-${5000 + idx}`,
          },
        })
      )
    );

    console.log(`✓ Created ${clients.length} clients`);

    // Create 2-3 Contacts per Client
    for (const client of clients) {
      const contactCount = 2 + Math.floor(Math.random() * 2); // 2-3 contacts
      const firstNames = [
        "Alex",
        "Sarah",
        "Michael",
        "Emily",
        "David",
        "Lisa",
        "Robert",
        "Jennifer",
      ];
      const lastNames = [
        "Johnson",
        "Williams",
        "Brown",
        "Davis",
        "Miller",
        "Wilson",
        "Moore",
        "Taylor",
      ];
      const positions = [
        "CEO",
        "CFO",
        "Accounting Manager",
        "Operations Director",
        "Project Manager",
      ];

      for (let c = 0; c < contactCount; c++) {
        await prisma.contact.create({
          data: {
            clientId: client.id,
            name: `${
              firstNames[Math.floor(Math.random() * firstNames.length)]
            } ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            email: `contact${c + 1}@${client.name
              .toLowerCase()
              .replace(/\s+/g, "")}.com`,
            phone: `+1 (555) ${300 + c}00-${6000 + c}`,
            position: positions[Math.floor(Math.random() * positions.length)],
            isPrimary: c === 0,
          },
        });
      }
    }

    console.log("✓ Created contacts for all clients");

    // Create 10 Products for each user
    const productData = [
      {
        name: "Web Development",
        description: "Full-stack web application development",
        price: 150,
        type: ProductType.SERVICE,
      },
      {
        name: "Mobile App Development",
        description: "iOS and Android mobile applications",
        price: 175,
        type: ProductType.SERVICE,
      },
      {
        name: "UI/UX Design",
        description: "User interface and experience design services",
        price: 125,
        type: ProductType.SERVICE,
      },
      {
        name: "SEO Optimization",
        description: "Search engine optimization services",
        price: 100,
        type: ProductType.SERVICE,
      },
      {
        name: "Cloud Hosting",
        description: "Managed cloud hosting service (monthly)",
        price: 500,
        type: ProductType.SERVICE,
      },
      {
        name: "Database Setup",
        description: "Database design and implementation",
        price: 200,
        type: ProductType.SERVICE,
      },
      {
        name: "API Integration",
        description: "Third-party API integration services",
        price: 180,
        type: ProductType.SERVICE,
      },
      {
        name: "Code Review",
        description: "Professional code review and optimization",
        price: 90,
        type: ProductType.SERVICE,
      },
      {
        name: "Training Session",
        description: "Technical training and workshops",
        price: 250,
        type: ProductType.SERVICE,
      },
      {
        name: "Maintenance Package",
        description: "Monthly maintenance and support",
        price: 400,
        type: ProductType.SERVICE,
      },
    ];

    const products = await Promise.all(
      productData.map((prod) =>
        prisma.product.create({
          data: {
            userId: user.id,
            name: prod.name,
            description: prod.description,
            unitPrice: prod.price,
            type: prod.type,
            isActive: true,
          },
        })
      )
    );

    console.log(`✓ Created ${products.length} products`);

    // Get all contacts for this user's clients
    const allContacts = await prisma.contact.findMany({
      where: {
        client: {
          userId: user.id,
        },
      },
    });

    // Create 10 Quotes
    const quoteStatuses = [
      DocumentStatus.DRAFT,
      DocumentStatus.SENT,
      DocumentStatus.VIEWED,
      DocumentStatus.APPROVED,
      DocumentStatus.CONVERTED,
    ];
    for (let q = 0; q < 10; q++) {
      const client = clients[q % clients.length];
      const contactsForClient = allContacts.filter(
        (c) => c.clientId === client.id
      );
      const contact = contactsForClient[0];

      const issueDate = new Date();
      issueDate.setDate(issueDate.getDate() - (90 - q * 7)); // Spread over last 90 days

      const validUntil = new Date(issueDate);
      validUntil.setDate(validUntil.getDate() + 30);

      const itemCount = 2 + Math.floor(Math.random() * 4); // 2-5 items
      let subtotal = 0;
      const items = [];

      for (let it = 0; it < itemCount; it++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = 1 + Math.floor(Math.random() * 10);
        const amount = quantity * parseFloat(product.unitPrice.toString());
        subtotal += amount;

        items.push({
          description: `${product.name} - ${product.description}`,
          quantity: quantity,
          unitPrice: product.unitPrice,
          amount: amount,
          order: it,
        });
      }

      const taxRate = 8.5;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      await prisma.document.create({
        data: {
          documentNumber: `Q-${String(q + 1).padStart(3, "0")}`,
          type: DocumentType.QUOTE,
          status: quoteStatuses[q % quoteStatuses.length],
          userId: user.id,
          clientId: client.id,
          contactId: contact?.id,
          issueDate: issueDate,
          validUntil: validUntil,
          currency: "USD",
          subtotal: subtotal,
          taxRate: taxRate,
          taxAmount: taxAmount,
          discount: 0,
          total: total,
          amountPaid: 0,
          amountDue: total,
          notes:
            "Thank you for considering our proposal. We look forward to working with you.",
          terms: "This quote is valid for 30 days from the date of issue.",
          items: {
            create: items,
          },
        },
      });
    }

    console.log("✓ Created 10 quotes");

    // Create 10 Invoices with payments
    const invoiceStatuses = [
      DocumentStatus.SENT,
      DocumentStatus.VIEWED,
      DocumentStatus.PARTIAL,
      DocumentStatus.PAID,
      DocumentStatus.OVERDUE,
    ];
    for (let inv = 0; inv < 10; inv++) {
      const client = clients[inv % clients.length];
      const contactsForClient = allContacts.filter(
        (c) => c.clientId === client.id
      );
      const contact = contactsForClient[0];

      const issueDate = new Date();
      issueDate.setDate(issueDate.getDate() - (60 - inv * 5)); // Spread over last 60 days

      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);

      const itemCount = 2 + Math.floor(Math.random() * 5); // 2-6 items
      let subtotal = 0;
      const items = [];

      for (let it = 0; it < itemCount; it++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = 1 + Math.floor(Math.random() * 8);
        const amount = quantity * parseFloat(product.unitPrice.toString());
        subtotal += amount;

        items.push({
          description: `${product.name} - ${product.description}`,
          quantity: quantity,
          unitPrice: product.unitPrice,
          amount: amount,
          order: it,
        });
      }

      const taxRate = 8.5;
      const taxAmount = (subtotal * taxRate) / 100;
      const discount = inv % 3 === 0 ? subtotal * 0.1 : 0; // 10% discount on every 3rd invoice
      const total = subtotal + taxAmount - discount;

      const status = invoiceStatuses[inv % invoiceStatuses.length];
      let amountPaid = 0;

      if (status === DocumentStatus.PAID) {
        amountPaid = total;
      } else if (status === DocumentStatus.PARTIAL) {
        amountPaid = total * 0.5; // 50% paid
      }

      const invoice = await prisma.document.create({
        data: {
          documentNumber: `INV-${String(inv + 1).padStart(3, "0")}`,
          type: DocumentType.INVOICE,
          status: status,
          userId: user.id,
          clientId: client.id,
          contactId: contact?.id,
          issueDate: issueDate,
          dueDate: dueDate,
          currency: "USD",
          subtotal: subtotal,
          taxRate: taxRate,
          taxAmount: taxAmount,
          discount: discount,
          total: total,
          amountPaid: amountPaid,
          amountDue: total - amountPaid,
          notes:
            "Thank you for your business! Please remit payment by the due date.",
          terms:
            "Payment is due within 30 days. Late payments may incur additional fees.",
          items: {
            create: items,
          },
        },
      });

      // Create payment records for paid/partial invoices
      if (status === DocumentStatus.PAID) {
        const paymentMethods = [
          PaymentMethod.BANK_TRANSFER,
          PaymentMethod.CREDIT_CARD,
          PaymentMethod.CHECK,
          PaymentMethod.STRIPE,
        ];
        const paymentDate = new Date(issueDate);
        paymentDate.setDate(paymentDate.getDate() + 15);

        await prisma.payment.create({
          data: {
            documentId: invoice.id,
            amount: total,
            paymentDate: paymentDate,
            method: paymentMethods[inv % paymentMethods.length],
            reference: `PAY-${String(inv + 1).padStart(4, "0")}`,
            notes: "Payment received in full. Thank you!",
          },
        });
      } else if (status === DocumentStatus.PARTIAL) {
        // Create 2 partial payments
        const payment1Date = new Date(issueDate);
        payment1Date.setDate(payment1Date.getDate() + 10);

        const payment2Date = new Date(issueDate);
        payment2Date.setDate(payment2Date.getDate() + 20);

        await prisma.payment.create({
          data: {
            documentId: invoice.id,
            amount: total * 0.3,
            paymentDate: payment1Date,
            method: PaymentMethod.BANK_TRANSFER,
            reference: `PAY-${String(inv + 1).padStart(4, "0")}-1`,
            notes: "First partial payment received.",
          },
        });

        await prisma.payment.create({
          data: {
            documentId: invoice.id,
            amount: total * 0.2,
            paymentDate: payment2Date,
            method: PaymentMethod.CREDIT_CARD,
            reference: `PAY-${String(inv + 1).padStart(4, "0")}-2`,
            notes: "Second partial payment received.",
          },
        });
      }
    }

    console.log("✓ Created 10 invoices with payment records");
  }

  console.log("\n✅ Seeding completed successfully!");
  console.log("\nSummary:");
  console.log("- 3 users created");
  console.log("- 3 business profiles created");
  console.log("- 3 user settings created");
  console.log("- 12 clients created (4 per user)");
  console.log("- 24-36 contacts created (2-3 per client)");
  console.log("- 30 products created (10 per user)");
  console.log("- 30 quotes created (10 per user)");
  console.log("- 30 invoices created (10 per user)");
  console.log("- Payment records created for paid/partial invoices");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
