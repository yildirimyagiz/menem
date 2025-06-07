import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const NUM_RECORDS_PER_MODEL = 10; // Default number of records to create per model

// --- Foundation/Lookup Models ---
export async function seedAgency() {
  const { faker } = await import("@faker-js/faker");

  for (let i = 0; i < 30; i++) {
    await prisma.agency.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        website: faker.internet.url(),
        logoUrl: faker.image.avatar(),
        status: "PENDING", // or randomly pick from ['PENDING', 'ACTIVE', 'SUSPENDED']
        isActive: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
        theme: faker.color.human(),
        externalId: faker.string.uuid(),
        integration: {}, // empty object for now
        settings: {}, // empty object for now
      },
    });
  }
}

export async function seedLocation() {
  const { faker } = await import("@faker-js/faker");
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.location.create({
      data: {
        country: faker.location.countryCode(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        coordinates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        district: faker.location.county(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} locations.`);
}

export async function seedCurrency() {
  const { faker } = await import("@faker-js/faker");
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1.0 },
    { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 0.92 },
    { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 0.79 },
    { code: "TRY", name: "Turkish Lira", symbol: "₺", exchangeRate: 32.0 },
  ];
  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: {
        ...currency,
        updatedAt: new Date(), // Add missing updatedAt
      },
    });
  }
  // Add some more random ones
  for (let i = 0; i < NUM_RECORDS_PER_MODEL - currencies.length; i++) {
    await prisma.currency.create({
      data: {
        code: faker.finance.currencyCode(),
        name: faker.finance.currencyName(),
        symbol: faker.finance.currencySymbol(),
        exchangeRate: faker.number.float({
          min: 0.1,
          max: 100,
          multipleOf: 0.01,
        }), // precision -> multipleOf
        isActive: faker.datatype.boolean(),
        updatedAt: new Date(), // Add missing updatedAt
      },
    });
  }
  console.log(
    `Seeded currencies (upserted ${currencies.length}, created ${Math.max(0, NUM_RECORDS_PER_MODEL - currencies.length)}).`,
  );
}

export async function seedLanguage() {
  const { faker } = await import("@faker-js/faker");
  const languages = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      isRTL: false,
      isActive: true,
    },
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      isRTL: false,
      isActive: true,
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      isRTL: false,
      isActive: true,
    },
    {
      code: "tr",
      name: "Turkish",
      nativeName: "Türkçe",
      isRTL: false,
      isActive: true,
    },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية",
      isRTL: true,
      isActive: true,
    },
  ];
  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: { updatedAt: new Date() }, // Ensure updatedAt is updated on upsert
      create: {
        ...lang,
        updatedAt: new Date(), // Add missing updatedAt
      },
    });
  }
  console.log(`Seeded ${languages.length} languages.`);
}

export async function seedPermission() {
  const { faker } = await import("@faker-js/faker");
  const permissions = [
    "read_property",
    "write_property",
    "delete_property",
    "manage_users",
    "access_reports",
  ];
  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: faker.lorem.sentence(),
        // Permissions don't have updatedAt in schema
      },
    });
  }
  console.log(`Seeded ${permissions.length} permissions.`);
}

export async function seedFacility() {
  const { faker } = await import("@faker-js/faker");
  const facilityTypes: any[] = [
    "RESIDENTIAL",
    "COMMERCIAL",
    "GYM",
    "SWIMMING_POOL",
    "PARK",
  ];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.facility.create({
      data: {
        name: faker.company.name() + " Facility",
        description: faker.lorem.sentence(),
        type: faker.helpers.arrayElement(facilityTypes),
        status: faker.helpers.arrayElement(["ACTIVE", "INACTIVE"]),
        icon: faker.image.urlPicsumPhotos({
          width: 50,
          height: 50,
        }), // imageUrl -> urlPicsumPhotos or similar
        logo: faker.image.urlPicsumPhotos({
          width: 100,
          height: 100,
        }), // imageUrl -> urlPicsumPhotos or similar
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} facilities.`);
}

// --- Core User/Identity Models ---
export async function seedUser() {
  const { faker } = await import("@faker-js/faker");
  const roles: any[] = ["USER", "ADMIN", "AGENT", "TENANT"];
  const userStatuses: any[] = ["ACTIVE", "INACTIVE", "SUSPENDED"];
  const agencies = await prisma.agency.findMany({ select: { id: true } });

  for (let i = 0; i < NUM_RECORDS_PER_MODEL * 2; i++) {
    // Create more users
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    await prisma.user.create({
      data: {
        email: faker.internet.email({
          firstName,
          lastName,
          allowSpecialCharacters: false,
        }),
        username: faker.internet.userName({ firstName, lastName }),
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        role: faker.helpers.arrayElement(roles),
        status: faker.helpers.arrayElement(userStatuses),
        isActive: faker.datatype.boolean(),
        emailVerified: faker.datatype.boolean() ? faker.date.past() : null,
        profilePicture: faker.image.avatar(),
        agencyId:
          agencies.length > 0 ? faker.helpers.arrayElement(agencies).id : null,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL * 2} users.`);
}

export async function seedAccount() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) {
    console.warn("Skipping seedAccount: No users found. Seed users first.");
    return;
  }
  const accountTypes: any[] = ["OAUTH", "EMAIL", "GOOGLE", "FACEBOOK"];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const user = faker.helpers.arrayElement(users);
    await prisma.account.create({
      data: {
        userId: user.id,
        type: faker.helpers.arrayElement(accountTypes),
        provider: faker.company
          .name()
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase(),
        providerAccountId: faker.string.uuid(),
        access_token: faker.string.alphanumeric(30),
        refresh_token: faker.string.alphanumeric(30),
        expires_at: faker.number.int({ min: 3600, max: 7200 }),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} accounts.`);
}

export async function seedSession() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) {
    console.warn("Skipping seedSession: No users found. Seed users first.");
    return;
  }
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const user = faker.helpers.arrayElement(users);
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: faker.string.uuid(),
        expires: faker.date.future(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} sessions.`);
}

export async function seedVerificationToken() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) {
    console.warn(
      "Skipping seedVerificationToken: No users found. Seed users first.",
    );
    return;
  }
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const user = faker.helpers.arrayElement(users);
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: faker.string.alphanumeric(32),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} verification tokens.`);
}

// --- Direct Dependents ---
export async function seedAgent() {
  const { faker } = await import("@faker-js/faker");
  const agencies = await prisma.agency.findMany({ select: { id: true } });
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  }); // For owner

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const agentName = faker.person.fullName();
    await prisma.agent.create({
      data: {
        name: agentName,
        email: faker.internet.email({
          firstName: agentName.split(" ")[0],
          lastName: agentName.split(" ")[1] || "Agent",
          allowSpecialCharacters: false,
        }),
        phoneNumber: faker.phone.number(),
        bio: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(["PENDING", "ACTIVE", "SUSPENDED"]),
        agencyId:
          agencies.length > 0 ? faker.helpers.arrayElement(agencies).id : null,
        ownerId: users.length > 0 ? faker.helpers.arrayElement(users).id : null,
        specialities: faker.helpers.arrayElements(
          ["RESIDENTIAL", "COMMERCIAL", "LUXURY"],
          faker.number.int({ min: 1, max: 3 }),
        ) as any[],
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} agents.`);
}

export async function seedTenant() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({
    where: { Tenant: null },
    select: { id: true, email: true, firstName: true, lastName: true },
  }); // Find users not yet tenants
  const properties = await prisma.property.findMany({ select: { id: true } });

  if (users.length === 0) {
    console.warn(
      "Skipping seedTenant: No available users found to be tenants. Seed users first or ensure some users are not already tenants.",
    );
    return;
  }
  if (properties.length === 0) {
    console.warn(
      "Skipping seedTenant: No properties found. Seed properties first.",
    );
    return;
  }

  const paymentStatuses: any[] = [
    "UNPAID",
    "PARTIALLY_PAID",
    "PAID",
    "OVERDUE",
  ];
  for (let i = 0; i < Math.min(NUM_RECORDS_PER_MODEL, users.length); i++) {
    const user = users[i]; // Use users sequentially to avoid conflicts on unique userId for Tenant
    const property = faker.helpers.arrayElement(properties);
    await prisma.tenant.create({
      data: {
        userId: user.id,
        firstName: user.firstName || faker.person.firstName(),
        lastName: user.lastName || faker.person.lastName(),
        email: user.email, // Use user's email
        phoneNumber: faker.phone.number(),
        leaseStartDate: faker.date.past({ years: 2 }),
        leaseEndDate: faker.date.future({ years: 1 }),
        paymentStatus: faker.helpers.arrayElement(paymentStatuses),
        propertyId: property.id,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(
    `Seeded ${Math.min(NUM_RECORDS_PER_MODEL, users.length)} tenants.`,
  );
}

export async function seedGuest() {
  const { faker } = await import("@faker-js/faker");
  const agencies = await prisma.agency.findMany({ select: { id: true } });
  const genders: any[] = ["MALE", "FEMALE"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.guest.create({
      data: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email({ allowSpecialCharacters: false }),
        nationality: faker.location.country(),
        passportNumber: faker.string.alphanumeric(10).toUpperCase(),
        gender: faker.helpers.arrayElement(genders),
        birthDate: faker.date.birthdate({ min: 18, max: 70, mode: "age" }),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.countryCode(),
        zipCode: faker.location.zipCode(),
        agencyId:
          agencies.length > 0 ? faker.helpers.arrayElement(agencies).id : null,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} guests.`);
}

export async function seedIncludedService() {
  const { faker } = await import("@faker-js/faker");
  const serviceNames = [
    "Wi-Fi",
    "Cleaning",
    "Parking",
    "Gym Access",
    "Pool Access",
  ];
  for (const name of serviceNames) {
    await prisma.includedService.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: faker.lorem.sentence(),
        icon: faker.image.urlPicsumPhotos({
          width: 50,
          height: 50,
        }), // imageUrl -> urlPicsumPhotos or similar
      },
    });
  }
  console.log(`Seeded ${serviceNames.length} included services.`);
}

export async function seedExtraCharge() {
  const { faker } = await import("@faker-js/faker");
  const chargeNames = [
    "Pet Fee",
    "Late Checkout",
    "Extra Bed",
    "Airport Transfer",
    "Breakfast",
  ];
  for (const name of chargeNames) {
    await prisma.extraCharge.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: faker.lorem.sentence(),
        icon: faker.image.urlPicsumPhotos({
          width: 50,
          height: 50,
        }), // imageUrl -> urlPicsumPhotos or similar
      },
    });
  }
  console.log(`Seeded ${chargeNames.length} extra charges.`);
}

export async function seedPhoto() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true }, take: 5 });
  const agencies = await prisma.agency.findMany({
    select: { id: true },
    take: 5,
  });
  const properties = await prisma.property.findMany({
    select: { id: true },
    take: 5,
  });
  const posts = await prisma.post.findMany({ select: { id: true }, take: 5 });
  const photoTypes: any[] = ["GALLERY", "COVER", "PROFILE", "DOCUMENT"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL * 2; i++) {
    // Create more photos
    await prisma.photo.create({
      data: {
        url: faker.image.urlLoremFlickr({ category: "city" }), // Using a more specific category
        type: faker.helpers.arrayElement(photoTypes),
        caption: faker.lorem.sentence(),
        alt: faker.lorem.words(3),
        featured: faker.datatype.boolean(),
        userId:
          users.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(users).id
            : null,
        agencyId:
          agencies.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(agencies).id
            : null,
        propertyId:
          properties.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(properties).id
            : null,
        postId:
          posts.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(posts).id
            : null,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL * 2} photos.`);
}

export async function seedHashtag() {
  const { faker } = await import("@faker-js/faker");
  const hashtagTypes: any[] = ["GENERAL", "PROPERTY", "AGENT"];
  const commonTags = ["luxury", "modern", "investment", "familyhome", "rental"];
  for (const tagName of commonTags) {
    await prisma.hashtag.upsert({
      where: { name: tagName },
      update: { usageCount: { increment: 1 } },
      create: {
        name: tagName,
        type: faker.helpers.arrayElement(hashtagTypes),
        description: faker.lorem.sentence(),
        usageCount: 1,
        updatedAt: new Date(), // Add missing updatedAt
      },
    });
  }
  for (let i = 0; i < NUM_RECORDS_PER_MODEL - commonTags.length; i++) {
    await prisma.hashtag.create({
      data: {
        name: faker.lorem.word() + faker.string.alphanumeric(3), // Ensure uniqueness
        type: faker.helpers.arrayElement(hashtagTypes),
        description: faker.lorem.sentence(),
        usageCount: faker.number.int({ min: 1, max: 100 }),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(
    `Seeded hashtags (upserted ${commonTags.length}, created ${Math.max(0, NUM_RECORDS_PER_MODEL - commonTags.length)}).`,
  );
}

export async function seedChannel() {
  const { faker } = await import("@faker-js/faker");
  const channelTypes: any[] = ["PUBLIC", "PRIVATE", "GROUP"];
  const channelCategories: any[] = ["AGENT", "AGENCY", "PROPERTY", "SYSTEM"];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.channel.create({
      data: {
        name: faker.lorem.words(3).replace(/ /g, "-"),
        type: faker.helpers.arrayElement(channelTypes),
        category: faker.helpers.arrayElement(channelCategories),
        description: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} channels.`);
}

// --- Main Business Models ---
export async function seedProperty() {
  const { faker } = await import("@faker-js/faker");
  const locations = await prisma.location.findMany({ select: { id: true } });
  const agents = await prisma.agent.findMany({ select: { id: true } });
  const users = await prisma.user.findMany({ select: { id: true } }); // For owner, seller, buyer
  const agencies = await prisma.agency.findMany({ select: { id: true } });
  const currencies = await prisma.currency.findMany({ select: { id: true } });

  if (locations.length === 0 || currencies.length === 0) {
    console.warn(
      "Skipping seedProperty: No locations or currencies found. Seed them first.",
    );
    return;
  }

  const propertyTypes: any[] = [
    "SingleFamily",
    "APARTMENT",
    "CONDO",
    "TOWNHOUSE",
  ];
  const propertyStatuses: any[] = [
    "AVAILABLE",
    "SOLD",
    "RENTED",
    "UNDER_CONTRACT",
  ];
  const propertyCategories: any[] = ["APARTMENT", "HOUSE", "VILLA", "OFFICE"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL * 2; i++) {
    // Create more properties
    await prisma.property.create({
      data: {
        title:
          faker.lorem
            .words(5)
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ") + " Property",
        description: faker.lorem.paragraphs(2),
        propertyType: faker.helpers.arrayElement(propertyTypes),
        propertyStatus: faker.helpers.arrayElement(propertyStatuses),
        category: faker.helpers.arrayElement(propertyCategories),
        locationId: faker.helpers.arrayElement(locations).id,
        size: faker.number.int({ min: 50, max: 500 }),
        bedrooms: faker.number.int({ min: 1, max: 6 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        yearBuilt: faker.number.int({
          min: 1950,
          max: new Date().getFullYear() - 1,
        }),
        marketValue: faker.number.float({
          min: 100000,
          max: 5000000,
          multipleOf: 0.01,
        }),
        currencyId: faker.helpers.arrayElement(currencies).id,
        agentId:
          agents.length > 0 ? faker.helpers.arrayElement(agents).id : null,
        ownerId: users.length > 0 ? faker.helpers.arrayElement(users).id : null,
        agencyId:
          agencies.length > 0 ? faker.helpers.arrayElement(agencies).id : null,
        isActive: faker.datatype.boolean(),
        featured: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
        // Add other fields as needed, e.g., features, amenities (arrays of enums)
        features: faker.helpers.arrayElements(
          ["FURNISHED", "BALCONY", "SMART_HOME"],
          faker.number.int({ min: 0, max: 3 }),
        ) as any[],
        amenities: faker.helpers.arrayElements(
          ["POOL", "GYM", "PARKING"],
          faker.number.int({ min: 0, max: 3 }),
        ) as any[],
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL * 2} properties.`);
}

export async function seedPricingRule() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });
  const currencies = await prisma.currency.findMany({ select: { id: true } });

  if (properties.length === 0 || currencies.length === 0) {
    console.warn(
      "Skipping seedPricingRule: No properties or currencies found. Seed them first.",
    );
    return;
  }

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.pricingRule.create({
      data: {
        name: faker.lorem.words(3) + " Rule",
        basePrice: faker.number.float({ min: 50, max: 1000, multipleOf: 0.01 }),
        propertyId: faker.helpers.arrayElement(properties).id,
        currencyId: faker.helpers.arrayElement(currencies).id,
        isActive: faker.datatype.boolean(),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} pricing rules.`);
}

export async function seedContract() {
  const { faker } = await import("@faker-js/faker");
  const tenants = await prisma.tenant.findMany({ select: { id: true } });
  const properties = await prisma.property.findMany({ select: { id: true } });
  const agencies = await prisma.agency.findMany({ select: { id: true } });

  if (
    tenants.length === 0 ||
    properties.length === 0 ||
    agencies.length === 0
  ) {
    console.warn(
      "Skipping seedContract: No tenants, properties, or agencies found. Seed them first.",
    );
    return;
  }
  const contractStatuses: any[] = ["ACTIVE", "DRAFT", "EXPIRED", "TERMINATED"];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.contract.create({
      data: {
        name: "Lease Agreement " + faker.string.alphanumeric(5),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(contractStatuses),
        startDate: faker.date.past({ years: 1 }),
        endDate: faker.date.future({ years: 1 }),
        tenantId: faker.helpers.arrayElement(tenants).id,
        propertyId: faker.helpers.arrayElement(properties).id,
        agencyId: faker.helpers.arrayElement(agencies).id,
        terms: {
          duration: "12 months",
          rent: faker.finance.amount({
            min: 500,
            max: 3000,
          }),
        },
        createdAt: faker.date.past(), // Contract model has `updatedAt DateTime` without `@updatedAt` so it needs to be set manually
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} contracts.`);
}

export async function seedReservation() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });
  const users = await prisma.user.findMany({ select: { id: true } }); // For userId (booker)
  const guests = await prisma.guest.findMany({ select: { id: true } }); // For guestId
  const currencies = await prisma.currency.findMany({ select: { id: true } });

  if (
    properties.length === 0 ||
    users.length === 0 ||
    guests.length === 0 ||
    currencies.length === 0
  ) {
    console.warn(
      "Skipping seedReservation: Prerequisites (properties, users, guests, currencies) not met.",
    );
    return;
  }

  const reservationStatuses: any[] = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ];
  const paymentStatuses: any[] = ["UNPAID", "PAID", "REFUNDED"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const startDate = faker.date.soon({ days: 30 });
    const endDate = faker.date.soon({ days: 7, refDate: startDate });
    await prisma.reservation.create({
      data: {
        propertyId: faker.helpers.arrayElement(properties).id,
        userId: faker.helpers.arrayElement(users).id,
        guestId: faker.helpers.arrayElement(guests).id,
        startDate,
        endDate,
        guests: faker.number.int({ min: 1, max: 5 }),
        status: faker.helpers.arrayElement(reservationStatuses),
        totalPrice: faker.number.float({
          min: 100,
          max: 2000,
          multipleOf: 0.01,
        }), // precision -> multipleOf
        currencyId: faker.helpers.arrayElement(currencies).id,
        paymentStatus: faker.helpers.arrayElement(paymentStatuses),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} reservations.`);
}

export async function seedEvent() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });
  const users = await prisma.user.findMany({ select: { id: true } }); // For createdById

  if (properties.length === 0 || users.length === 0) {
    console.warn(
      "Skipping seedEvent: No properties or users found. Seed them first.",
    );
    return;
  }
  const eventTypes: any[] = [
    "VIEWING",
    "OPEN_HOUSE",
    "VIRTUAL_TOUR",
    "INSPECTION",
  ];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.event.create({
      data: {
        propertyId: faker.helpers.arrayElement(properties).id,
        title: faker.lorem.words(3) + " Event",
        description: faker.lorem.sentence(),
        eventType: faker.helpers.arrayElement(eventTypes),
        scheduledAt: faker.date.future(),
        duration: faker.number.int({ min: 30, max: 120 }), // in minutes
        createdById: faker.helpers.arrayElement(users).id,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} events.`);
}

export async function seedTask() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true } }); // For createdById, assignedToId
  const properties = await prisma.property.findMany({ select: { id: true } });
  const agents = await prisma.agent.findMany({ select: { id: true } });
  const agencies = await prisma.agency.findMany({ select: { id: true } });

  if (users.length === 0) {
    console.warn("Skipping seedTask: No users found. Seed users first.");
    return;
  }

  const taskStatuses: any[] = ["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  const taskTypes: any[] = [
    "PROPERTY_MAINTENANCE",
    "LISTING_REVIEW",
    "CLIENT_FOLLOW_UP",
  ];
  const taskPriorities: any[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.task.create({
      data: {
        title: faker.lorem.sentence(5),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(taskStatuses),
        type: faker.helpers.arrayElement(taskTypes),
        priority: faker.helpers.arrayElement(taskPriorities),
        createdById: faker.helpers.arrayElement(users).id,
        assignedToId: faker.datatype.boolean()
          ? faker.helpers.arrayElement(users).id
          : null,
        propertyId:
          properties.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(properties).id
            : null,
        agentId:
          agents.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(agents).id
            : null,
        agencyId:
          agencies.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(agencies).id
            : null,
        dueDate: faker.datatype.boolean() ? faker.date.future() : null,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} tasks.`);
}

export async function seedReport() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true } }); // For generatedById
  const agencies = await prisma.agency.findMany({ select: { id: true } });

  if (users.length === 0) {
    console.warn("Skipping seedReport: No users found. Seed users first.");
    return;
  }

  const reportTypes: any[] = ["FINANCIAL", "PERFORMANCE", "MARKET_ANALYSIS"];
  const reportStatuses: any[] = ["GENERATED", "IN_PROGRESS", "COMPLETED"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.report.create({
      data: {
        title: faker.lorem.words(3) + " Report",
        reportType: faker.helpers.arrayElement(reportTypes),
        generatedById: faker.helpers.arrayElement(users).id,
        startDate: faker.date.past({ years: 1 }),
        endDate: faker.date.recent(),
        status: faker.helpers.arrayElement(reportStatuses),
        agencyId:
          agencies.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(agencies).id
            : null,
        data: {
          views: faker.number.int(1000),
          revenue: faker.finance.amount(),
        },
        createdAt: faker.date.past(), // Report model has `updatedAt DateTime` without `@updatedAt` so it needs to be set manually
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} reports.`);
}

export async function seedReview() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true } });
  const properties = await prisma.property.findMany({ select: { id: true } });
  const agents = await prisma.agent.findMany({ select: { id: true } });
  const agencies = await prisma.agency.findMany({ select: { id: true } });

  if (users.length === 0) {
    console.warn("Skipping seedReview: No users found. Seed users first.");
    return;
  }

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.review.create({
      data: {
        userId: faker.helpers.arrayElement(users).id,
        title: faker.lorem.sentence(4),
        content: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 1, max: 5 }),
        propertyId:
          properties.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(properties).id
            : null,
        agentId:
          agents.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(agents).id
            : null,
        agencyId:
          agencies.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(agencies).id
            : null,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} reviews.`);
}

export async function seedNotification() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true } });

  if (users.length === 0) {
    console.warn(
      "Skipping seedNotification: No users found. Seed users first.",
    );
    return;
  }

  const notificationTypes: any[] = [
    "MENTION",
    "TASK_ASSIGNED",
    "BOOKING_CONFIRMED",
    "SYSTEM_UPDATE",
  ];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.notification.create({
      data: {
        userId: faker.helpers.arrayElement(users).id,
        type: faker.helpers.arrayElement(notificationTypes),
        content: faker.lorem.sentence(),
        isRead: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} notifications.`);
}

export async function seedTaxRecord() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });

  if (properties.length === 0) {
    console.warn(
      "Skipping seedTaxRecord: No properties found. Seed properties first.",
    );
    return;
  }

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.taxRecord.create({
      data: {
        propertyId: faker.helpers.arrayElement(properties).id,
        year: new Date().getFullYear() - faker.number.int({ min: 0, max: 5 }),
        amount: faker.number.float({ min: 100, max: 10000, multipleOf: 0.01 }), // precision -> multipleOf
        percentage: faker.number.float({ min: 0.5, max: 5, multipleOf: 0.01 }), // precision -> multipleOf
        paid: faker.datatype.boolean(),
        dueDate: faker.date.future(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} tax records.`);
}

export async function seedMortgage() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });

  if (properties.length === 0) {
    console.warn(
      "Skipping seedMortgage: No properties found. Seed properties first.",
    );
    return;
  }
  const mortgageStatuses: any[] = ["ACTIVE", "PAID", "DEFAULTED"];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.mortgage.create({
      data: {
        propertyId: faker.helpers.arrayElement(properties).id,
        lender: faker.company.name() + " Bank",
        principal: faker.number.float({
          min: 50000,
          max: 1000000,
          multipleOf: 0.01,
        }), // precision -> multipleOf
        interestRate: faker.number.float({ min: 2, max: 8, multipleOf: 0.01 }), // precision -> multipleOf
        startDate: faker.date.past({ years: 5 }),
        status: faker.helpers.arrayElement(mortgageStatuses),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} mortgages.`);
}

export async function seedExpense() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });
  const agencies = await prisma.agency.findMany({ select: { id: true } });
  const currencies = await prisma.currency.findMany({ select: { id: true } });

  if (currencies.length === 0) {
    console.warn(
      "Skipping seedExpense: No currencies found. Seed currencies first.",
    );
    return;
  }

  const expenseTypes: any[] = ["MAINTENANCE", "UTILITIES", "TAX", "INSURANCE"];
  const expenseStatuses: any[] = ["PENDING", "PAID", "OVERDUE"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.expense.create({
      data: {
        type: faker.helpers.arrayElement(expenseTypes),
        amount: faker.number.float({ min: 20, max: 1000, multipleOf: 0.01 }), // precision -> multipleOf
        currencyId: faker.helpers.arrayElement(currencies).id,
        status: faker.helpers.arrayElement(expenseStatuses),
        propertyId:
          properties.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(properties).id
            : null,
        agencyId:
          agencies.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(agencies).id
            : null,
        dueDate: faker.datatype.boolean() ? faker.date.future() : null,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} expenses.`);
}

export async function seedDiscount() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });

  if (properties.length === 0) {
    console.warn(
      "Skipping seedDiscount: No properties found. Seed properties first.",
    );
    return;
  }

  const discountTypes: any[] = ["PERCENTAGE", "FIXED_AMOUNT", "SEASONAL"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.discount.create({
      data: {
        name: faker.lorem.words(2) + " Discount",
        code: faker.string.alphanumeric(8).toUpperCase(),
        value: faker.number.float({ min: 5, max: 50, multipleOf: 0.01 }), // Percentage or amount // precision -> multipleOf
        type: faker.helpers.arrayElement(discountTypes),
        propertyId: faker.helpers.arrayElement(properties).id,
        isActive: faker.datatype.boolean(),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} discounts.`);
}

export async function seedAnalytics() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true }, take: 5 });
  const properties = await prisma.property.findMany({
    select: { id: true },
    take: 5,
  });
  const analyticsTypes: any[] = ["LISTING_VIEW", "USER_ENGAGEMENT", "REVENUE"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const entityType = faker.helpers.arrayElement([
      "Property",
      "User",
      "General",
    ]);
    let entityId = faker.string.uuid();
    if (entityType === "Property" && properties.length > 0)
      entityId = faker.helpers.arrayElement(properties).id;
    if (entityType === "User" && users.length > 0)
      entityId = faker.helpers.arrayElement(users).id;

    await prisma.analytics.create({
      data: {
        entityId,
        entityType,
        type: faker.helpers.arrayElement(analyticsTypes),
        data: { page: faker.internet.url(), clicks: faker.number.int(100) },
        timestamp: faker.date.recent({ days: 30 }),
        propertyId:
          entityType === "Property"
            ? entityId
            : properties.length > 0 && faker.datatype.boolean()
              ? faker.helpers.arrayElement(properties).id
              : null,
        userId:
          entityType === "User"
            ? entityId
            : users.length > 0 && faker.datatype.boolean()
              ? faker.helpers.arrayElement(users).id
              : null,
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} analytics records.`);
}

export async function seedCommunicationLog() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true } });
  const agencies = await prisma.agency.findMany({ select: { id: true } });
  const channels = await prisma.channel.findMany({ select: { id: true } });

  if (users.length < 2) {
    // Need at least two users for sender/receiver
    console.warn(
      "Skipping seedCommunicationLog: Not enough users (need at least 2). Seed users first.",
    );
    return;
  }

  const communicationTypes: any[] = [
    "PROBLEM",
    "REQUEST",
    "INFORMATION",
    "FEEDBACK",
  ];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const [sender, receiver] = faker.helpers.arrayElements(users, 2);
    await prisma.communicationLog.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        type: faker.helpers.arrayElement(communicationTypes),
        content: faker.lorem.paragraph(),
        isRead: faker.datatype.boolean(),
        userId: faker.helpers.arrayElement([sender.id, receiver.id]),
        agencyId:
          agencies.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(agencies).id
            : null, // CommunicationLog model has `updatedAt DateTime` without `@updatedAt`
        channelId:
          channels.length > 0 && faker.datatype.boolean()
            ? faker.helpers.arrayElement(channels).id
            : null,
        timestamp: faker.date.recent({ days: 7 }),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} communication logs.`);
}

export async function seedTicket() {
  const { faker } = await import("@faker-js/faker");
  const ticketStatuses: any[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.ticket.create({
      data: {
        subject: faker.lorem.sentence(6),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(ticketStatuses),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
        closedAt: faker.datatype.boolean() ? faker.date.recent() : null,
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} tickets.`);
}

export async function seedPayment() {
  const { faker } = await import("@faker-js/faker");
  const tenants = await prisma.tenant.findMany({ select: { id: true } });
  const currencies = await prisma.currency.findMany({ select: { id: true } });

  if (tenants.length === 0 || currencies.length === 0) {
    console.warn(
      "Skipping seedPayment: No tenants or currencies found. Seed them first.",
    );
    return;
  }

  const paymentStatuses: any[] = ["UNPAID", "PAID", "REFUNDED", "OVERDUE"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.payment.create({
      data: {
        tenantId: faker.helpers.arrayElement(tenants).id,
        amount: faker.number.float({ min: 50, max: 2000, multipleOf: 0.01 }), // precision -> multipleOf
        currencyId: faker.helpers.arrayElement(currencies).id,
        paymentDate: faker.date.recent({ days: 30 }),
        dueDate: faker.date.between({
          from: faker.date.recent({ days: 60 }),
          to: faker.date.soon({ days: 30 }),
        }),
        status: faker.helpers.arrayElement(paymentStatuses),
        paymentMethod: faker.finance.transactionType(),
        stripePaymentIntentId: "pi_" + faker.string.alphanumeric(24),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} payments.`);
}

export async function seedSubscription() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true }, take: 5 });
  const agencies = await prisma.agency.findMany({
    select: { id: true },
    take: 5,
  });

  const subscriptionTiers: any[] = ["BASIC", "PRO", "ENTERPRISE"];
  const subscriptionStatuses: any[] = ["ACTIVE", "INACTIVE", "EXPIRED"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const isUserSubscription = faker.datatype.boolean();
    const entityId =
      isUserSubscription && users.length > 0
        ? faker.helpers.arrayElement(users).id
        : agencies.length > 0
          ? faker.helpers.arrayElement(agencies).id
          : faker.string.uuid();
    const entityType = isUserSubscription ? "User" : "Agency";

    await prisma.subscription.create({
      data: {
        entityId,
        entityType,
        tier: faker.helpers.arrayElement(subscriptionTiers),
        status: faker.helpers.arrayElement(subscriptionStatuses),
        startDate: faker.date.past({ years: 1 }),
        endDate: faker.date.future({ years: 1 }),
        userId: entityType === "User" ? entityId : null,
        agencyId: entityType === "Agency" ? entityId : null,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} subscriptions.`);
}

// --- Newly Added Models from Schema ---
export async function seedProvider() {
  const { faker } = await import("@faker-js/faker");
  const bookingSources: any[] = [
    "Direct",
    "Airbnb",
    "Booking",
    "Expedia",
    "Other",
    "Agency",
    "Provider",
  ];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    await prisma.provider.create({
      data: {
        name: faker.company.name() + " Provider",
        apiKey: faker.string.alphanumeric(32),
        apiSecret: faker.string.alphanumeric(32),
        baseUrl: faker.internet.url(),
        isActive: faker.datatype.boolean(),
        commission: faker.number.float({
          min: 0.01,
          max: 0.25,
          multipleOf: 0.01,
        }),
        source: faker.helpers.arrayElement(bookingSources),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} providers.`);
}

export async function seedMLConfiguration() {
  const { faker } = await import("@faker-js/faker");
  await prisma.mLConfiguration.upsert({
    where: { id: "singleton" },
    update: {
      enableAutoTagging: faker.datatype.boolean(),
      qualityThreshold: faker.number.float({
        min: 0.5,
        max: 0.95,
        multipleOf: 0.01,
      }),
      updatedAt: new Date(),
    },
    create: {
      id: "singleton",
      enableAutoTagging: faker.datatype.boolean(0.8),
      qualityThreshold: faker.number.float({
        min: 0.6,
        max: 0.85,
        multipleOf: 0.01,
      }),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });
  console.log("Upserted MLConfiguration.");
}

export async function seedAvailability() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({
    select: { id: true, bedrooms: true },
    take: 20,
  });
  const reservations = await prisma.reservation.findMany({
    select: { id: true, propertyId: true, startDate: true, endDate: true },
    take: 50,
  });
  const pricingRules = await prisma.pricingRule.findMany({
    select: {
      id: true,
      propertyId: true,
      basePrice: true,
      minNights: true,
      maxNights: true,
    },
    take: 30,
  });

  if (properties.length === 0) {
    console.warn(
      "Skipping seedAvailability: No properties found. Seed properties first.",
    );
    return;
  }

  let count = 0;
  for (const property of properties) {
    for (let i = 0; i < 5; i++) {
      // Create a few availability records per property
      const date = faker.date.soon({ days: 90 });
      const relevantPricingRule = pricingRules.find(
        (pr) => pr.propertyId === property.id,
      );
      const isBookedForDate = reservations.some(
        (res) =>
          res.propertyId === property.id &&
          date >= res.startDate &&
          date <= res.endDate,
      );

      try {
        await prisma.availability.create({
          data: {
            propertyId: property.id,
            date: date,
            isBlocked: faker.datatype.boolean(0.1), // 10% chance of being blocked
            isBooked: isBookedForDate,
            reservationId: isBookedForDate
              ? reservations.find(
                  (res) =>
                    res.propertyId === property.id &&
                    date >= res.startDate &&
                    date <= res.endDate,
                )?.id
              : null,
            pricingRuleId: relevantPricingRule?.id,
            totalUnits: property.bedrooms ?? 1,
            availableUnits: isBookedForDate ? 0 : (property.bedrooms ?? 1),
            bookedUnits: isBookedForDate ? (property.bedrooms ?? 1) : 0,
            blockedUnits: 0, // Can be enhanced later
            basePrice:
              relevantPricingRule?.basePrice ??
              faker.number.float({ min: 50, max: 500, multipleOf: 0.01 }),
            currentPrice:
              relevantPricingRule?.basePrice ??
              faker.number.float({ min: 50, max: 600, multipleOf: 0.01 }),
            minNights: relevantPricingRule?.minNights ?? 1,
            maxNights: relevantPricingRule?.maxNights ?? 30,
            maxGuests: (property.bedrooms ?? 1) * 2,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
        count++;
      } catch (e: any) {
        if (e.code === "P2002") {
          // Unique constraint violation
          // console.warn(`Skipping availability for property ${property.id} on ${date.toISOString().split('T')[0]} due to unique constraint.`);
        } else {
          console.error(
            `Error creating availability for property ${property.id}:`,
            e,
          );
        }
      }
    }
  }
  console.log(`Seeded ${count} availability records.`);
}

export async function seedCommissionRule() {
  const { faker } = await import("@faker-js/faker");
  const providers = await prisma.provider.findMany({ select: { id: true } });
  if (providers.length === 0) {
    console.warn(
      "Skipping seedCommissionRule: No providers found. Seed providers first.",
    );
    return;
  }
  const ruleTypes: any[] = [
    "SEASONAL",
    "VOLUME",
    "PROPERTY_TYPE",
    "LOCATION_BASED",
  ];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const provider = faker.helpers.arrayElement(providers);
    const ruleType = faker.helpers.arrayElement(ruleTypes);
    try {
      await prisma.commissionRule.create({
        data: {
          providerId: provider.id,
          ruleType: ruleType,
          startDate: faker.date.past(),
          endDate: faker.date.future(),
          commission: faker.number.float({
            min: 0.01,
            max: 0.2,
            multipleOf: 0.001,
          }),
          minVolume: faker.datatype.boolean()
            ? faker.number.int({ min: 100, max: 1000 })
            : null,
          maxVolume: faker.datatype.boolean()
            ? faker.number.int({ min: 1001, max: 10000 })
            : null,
          conditions: { category: faker.commerce.department() },
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      });
    } catch (e: any) {
      if (e.code === "P2002") {
        // Unique constraint violation
        // console.warn(`Skipping commission rule for provider ${provider.id} and type ${ruleType} due to unique constraint.`);
      } else {
        console.error(
          `Error creating commission rule for provider ${provider.id}:`,
          e,
        );
      }
    }
  }
  console.log(`Attempted to seed ${NUM_RECORDS_PER_MODEL} commission rules.`);
}

export async function seedComplianceRecord() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({
    select: { id: true },
    take: 5,
  });
  const agents = await prisma.agent.findMany({ select: { id: true }, take: 5 });
  const agencies = await prisma.agency.findMany({
    select: { id: true },
    take: 5,
  });
  const reservations = await prisma.reservation.findMany({
    select: { id: true },
    take: 5,
  });

  const complianceTypes: any[] = [
    "DATA_PROTECTION",
    "FINANCIAL_REGULATION",
    "PROPERTY_LAW",
  ];
  const complianceStatuses: any[] = ["PENDING", "APPROVED", "REJECTED"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const entityType = faker.helpers.arrayElement([
      "Property",
      "Agent",
      "Agency",
      "Reservation",
    ]);
    let entityId: string | null = null;
    let propertyId: string | null = null;
    let agentId: string | null = null;
    let agencyId: string | null = null;
    let reservationId: string | null = null;

    if (entityType === "Property" && properties.length > 0) {
      entityId = propertyId = faker.helpers.arrayElement(properties).id;
    } else if (entityType === "Agent" && agents.length > 0) {
      entityId = agentId = faker.helpers.arrayElement(agents).id;
    } else if (entityType === "Agency" && agencies.length > 0) {
      entityId = agencyId = faker.helpers.arrayElement(agencies).id;
    } else if (entityType === "Reservation" && reservations.length > 0) {
      entityId = reservationId = faker.helpers.arrayElement(reservations).id;
    } else {
      entityId = faker.string.uuid(); // Fallback
    }

    await prisma.complianceRecord.create({
      data: {
        entityId: entityId,
        entityType: entityType,
        type: faker.helpers.arrayElement(complianceTypes),
        status: faker.helpers.arrayElement(complianceStatuses),
        documentUrl: faker.internet.url(),
        expiryDate: faker.date.future(),
        notes: faker.lorem.sentence(),
        isVerified: faker.datatype.boolean(),
        propertyId,
        agentId,
        agencyId,
        reservationId,
        createdAt: faker.date.past(),
        updatedAt: new Date(), // Manual updatedAt
      },
    });
  }
  console.log(`Seeded ${NUM_RECORDS_PER_MODEL} compliance records.`);
}

export async function seedIncrease() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });
  const tenants = await prisma.tenant.findMany({
    select: { id: true, propertyId: true },
  });
  const users = await prisma.user.findMany({ select: { id: true } }); // For proposedBy
  const contracts = await prisma.contract.findMany({
    select: { id: true, propertyId: true, tenantId: true },
  });

  if (properties.length === 0 || tenants.length === 0 || users.length === 0) {
    console.warn(
      "Skipping seedIncrease: Prerequisites (properties, tenants, users) not met.",
    );
    return;
  }
  const increaseStatuses: any[] = ["PENDING", "ACCEPTED", "REJECTED"];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const tenant = faker.helpers.arrayElement(tenants);
    const property = properties.find((p) => p.id === tenant.propertyId);
    if (!property) continue;

    const relevantContract = contracts.find(
      (c) => c.propertyId === property.id && c.tenantId === tenant.id,
    );

    await prisma.increase.create({
      data: {
        propertyId: property.id,
        tenantId: tenant.id,
        proposedBy: faker.helpers.arrayElement(users).id,
        oldRent: faker.number.float({ min: 500, max: 3000, multipleOf: 0.01 }),
        newRent: faker.number.float({ min: 600, max: 3500, multipleOf: 0.01 }),
        effectiveDate: faker.date.future(),
        status: faker.helpers.arrayElement(increaseStatuses),
        contractId: relevantContract?.id,
        createdAt: faker.date.past(),
        updatedAt: new Date(), // Manual updatedAt
      },
    });
  }
  console.log(`Seeded (up to) ${NUM_RECORDS_PER_MODEL} increases.`);
}

export async function seedOffer() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({ select: { id: true } });
  const users = await prisma.user.findMany({ select: { id: true } }); // For guestId
  const reservations = await prisma.reservation.findMany({
    select: { id: true, propertyId: true },
    where: { Offer: null },
  }); // Find reservations without an offer
  const increases = await prisma.increase.findMany({
    select: { id: true, propertyId: true },
    where: { Offer: null },
  }); // Find increases without an offer

  if (properties.length === 0 || users.length === 0) {
    console.warn(
      "Skipping seedOffer: Prerequisites (properties, users) not met.",
    );
    return;
  }

  const offerTypes: any[] = ["STANDARD", "PROMOTIONAL", "LAST_MINUTE"];
  const offerStatuses: any[] = ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"];

  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const property = faker.helpers.arrayElement(properties);
    const guestUser = faker.helpers.arrayElement(users);
    const basePrice = faker.number.float({
      min: 100,
      max: 2000,
      multipleOf: 0.01,
    });
    const discountRate = faker.datatype.boolean()
      ? faker.number.float({ min: 0.05, max: 0.3, multipleOf: 0.01 })
      : null;
    const finalPrice = discountRate
      ? basePrice * (1 - discountRate)
      : basePrice;

    const relevantReservation = reservations.find(
      (r) => r.propertyId === property.id,
    );
    const relevantIncrease = increases.find(
      (inc) => inc.propertyId === property.id,
    );

    try {
      await prisma.offer.create({
        data: {
          propertyId: property.id,
          guestId: guestUser.id,
          offerType: faker.helpers.arrayElement(offerTypes),
          status: faker.helpers.arrayElement(offerStatuses),
          basePrice,
          discountRate,
          finalPrice,
          startDate: faker.date.soon({ days: 30 }),
          endDate: faker.date.soon({ days: 60 }),
          reservationId: relevantReservation?.id,
          increaseId: relevantIncrease?.id,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      });
      // If reservation/increase was used, remove it from the pool to respect unique constraint
      if (relevantReservation)
        reservations.splice(reservations.indexOf(relevantReservation), 1);
      if (relevantIncrease)
        increases.splice(increases.indexOf(relevantIncrease), 1);
    } catch (e: any) {
      if (e.code === "P2002") {
        // console.warn(`Skipping offer due to unique constraint on reservationId or increaseId.`);
      } else {
        console.error(`Error creating offer for property ${property.id}:`, e);
      }
    }
  }
  console.log(`Attempted to seed ${NUM_RECORDS_PER_MODEL} offers.`);
}

// --- Join/Link Tables & Many-to-Many ---
export async function seedPropertyHashtag() {
  const { faker } = await import("@faker-js/faker");
  const properties = await prisma.property.findMany({
    select: { id: true },
    take: 20,
  });
  const hashtags = await prisma.hashtag.findMany({
    select: { id: true },
    take: 20,
  });

  if (properties.length === 0 || hashtags.length === 0) {
    console.warn(
      "Skipping seedPropertyHashtag: No properties or hashtags found.",
    );
    return;
  }

  let count = 0;
  for (const property of properties) {
    if (faker.datatype.boolean(0.7)) {
      // 70% chance to add hashtags
      const numHashtags = faker.number.int({ min: 1, max: 3 });
      const selectedHashtags = faker.helpers.arrayElements(
        hashtags,
        numHashtags,
      );
      if (selectedHashtags.length > 0) {
        await prisma.property.update({
          where: { id: property.id },
          data: {
            Hashtag: {
              connect: selectedHashtags.map((h) => ({ id: h.id })),
            },
          },
        });
        count++;
      }
    }
  }
  console.log(`Seeded Property-Hashtag connections for ${count} properties.`);
}

export async function seedPost() {
  const { faker } = await import("@faker-js/faker");

  // Fetch at least one user and agency for relations (if available)
  const user = await prisma.user.findFirst();
  const agency = await prisma.agency.findFirst();
  const hashtags = await prisma.hashtag.findMany({ select: { id: true } });

  if (!user) {
    console.warn("Skipping seedPost: No user found. Seed users first.");
    return;
  }

  for (let i = 0; i < 30; i++) {
    // Build data object step-by-step to avoid undefined properties
    const data: any = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      slug: faker.helpers.slugify(
        faker.lorem.words(3) + "-" + faker.string.uuid(),
      ),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    };
    data.userId = user.id; // User is required for Post
    if (agency) data.agencyId = agency.id;
    if (hashtags.length > 0 && faker.datatype.boolean()) {
      data.hashtagId = faker.helpers.arrayElement(hashtags).id;
    }

    await prisma.post.create({ data });
  }
  console.log(`Seeded 30 posts.`);
}

export async function seedPostHashtag() {
  // This function might be redundant if Post.hashtagId is set during seedPost.
  // However, if it's meant to ensure posts have hashtags or update them:
  const { faker } = await import("@faker-js/faker");
  const posts = await prisma.post.findMany({
    where: { hashtagId: null },
    select: { id: true },
    take: 20,
  });
  const hashtags = await prisma.hashtag.findMany({
    select: { id: true },
    take: 20,
  });

  if (posts.length === 0 || hashtags.length === 0) {
    console.warn(
      "Skipping seedPostHashtag: No posts without hashtags or no hashtags found.",
    );
    return;
  }

  let count = 0;
  for (const post of posts) {
    if (faker.datatype.boolean(0.5)) {
      // 50% chance to add a hashtag
      await prisma.post.update({
        where: { id: post.id },
        data: {
          hashtagId: faker.helpers.arrayElement(hashtags).id,
        },
      });
      count++;
    }
  }
  console.log(`Assigned hashtags to ${count} posts.`);
}

export async function seedUserPermission() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true }, take: 20 });
  const permissions = await prisma.permission.findMany({
    select: { id: true },
  });

  if (users.length === 0 || permissions.length === 0) {
    console.warn("Skipping seedUserPermission: No users or permissions found.");
    return;
  }

  let count = 0;
  for (const user of users) {
    const numPermissions = faker.number.int({
      min: 1,
      max: Math.min(3, permissions.length),
    });
    const selectedPermissions = faker.helpers.arrayElements(
      permissions,
      numPermissions,
    );
    if (selectedPermissions.length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          Permission: {
            connect: selectedPermissions.map((p) => ({ id: p.id })),
          },
        },
      });
      count++;
    }
  }
  console.log(`Assigned permissions to ${count} users.`);
}

export async function seedEventAttendees() {
  const { faker } = await import("@faker-js/faker");
  const events = await prisma.event.findMany({
    select: { id: true },
    take: 20,
  });
  const users = await prisma.user.findMany({ select: { id: true }, take: 50 }); // More users to pick from

  if (events.length === 0 || users.length === 0) {
    console.warn("Skipping seedEventAttendees: No events or users found.");
    return;
  }

  let count = 0;
  for (const event of events) {
    const numAttendees = faker.number.int({
      min: 1,
      max: Math.min(5, users.length),
    });
    const selectedAttendees = faker.helpers.arrayElements(users, numAttendees);
    if (selectedAttendees.length > 0) {
      await prisma.event.update({
        where: { id: event.id },
        data: {
          attendees: { connect: selectedAttendees.map((u) => ({ id: u.id })) },
        },
      });
      count++;
    }
  }
  console.log(`Added attendees to ${count} events.`);
}

export async function seedFavorite() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true }, take: 20 });
  const properties = await prisma.property.findMany({
    select: { id: true },
    take: 20,
  });

  if (users.length === 0 || properties.length === 0) {
    console.warn("Skipping seedFavorite: No users or properties found.");
    return;
  }

  let count = 0;
  for (let i = 0; i < NUM_RECORDS_PER_MODEL * 2; i++) {
    // Create more favorites
    const user = faker.helpers.arrayElement(users);
    const property = faker.helpers.arrayElement(properties);
    try {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          propertyId: property.id,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      });
      count++;
    } catch (e: any) {
      if (e.code === "P2002") {
        // Unique constraint violation
        // console.warn(`Skipping favorite for user ${user.id} and property ${property.id} due to unique constraint.`);
      } else {
        console.error(
          `Error creating favorite for user ${user.id} and property ${property.id}:`,
          e,
        );
      }
    }
  }
  console.log(`Seeded ${count} favorites.`);
}

export async function seedMention() {
  const { faker } = await import("@faker-js/faker");
  const users = await prisma.user.findMany({ select: { id: true }, take: 10 });
  const tasks = await prisma.task.findMany({ select: { id: true }, take: 10 });
  const properties = await prisma.property.findMany({
    select: { id: true },
    take: 10,
  });
  const agencies = await prisma.agency.findMany({
    select: { id: true },
    take: 5,
  });

  if (users.length < 2) {
    // Need at least a mentioner and a mentioned
    console.warn("Skipping seedMention: Not enough users. Seed users first.");
    return;
  }
  const mentionTypes: any[] = ["USER", "PROPERTY", "TASK"];
  for (let i = 0; i < NUM_RECORDS_PER_MODEL; i++) {
    const [mentionedById, mentionedToId] = faker.helpers.arrayElements(
      users,
      2,
    );
    const type = faker.helpers.arrayElement(mentionTypes);
    try {
      await prisma.mention.create({
        data: {
          mentionedById: mentionedById.id,
          mentionedToId: mentionedToId.id,
          type: type,
          taskId:
            type === "TASK" && tasks.length > 0
              ? faker.helpers.arrayElement(tasks).id
              : null,
          propertyId:
            type === "PROPERTY" && properties.length > 0
              ? faker.helpers.arrayElement(properties).id
              : null,
          content: faker.lorem.sentence(),
          isRead: faker.datatype.boolean(),
          agencyId:
            agencies.length > 0 && faker.datatype.boolean()
              ? faker.helpers.arrayElement(agencies).id
              : null,
          userId: mentionedToId.id, // As per schema, seems to be the mentioned user
          createdAt: faker.date.past(),
          updatedAt: new Date(), // Manual updatedAt
        },
      });
    } catch (e: any) {
      if (e.code === "P2002") {
        // console.warn(`Skipping mention due to unique constraint.`);
      } else {
        console.error(`Error creating mention:`, e);
      }
    }
  }
  console.log(`Attempted to seed ${NUM_RECORDS_PER_MODEL} mentions.`);
}
// ...add other join tables as needed

// --- Main orchestrator ---
export async function main() {
  await seedAgency();
  await seedLocation();
  await seedCurrency();
  await seedLanguage();
  await seedPermission();
  await seedFacility();
  await seedProvider();
  await seedMLConfiguration();
  console.log("--- Foundation/Lookup Models Seeded ---");

  await seedUser();
  await seedAccount();
  await seedSession();
  await seedVerificationToken();
  console.log("--- Core User/Identity Models Seeded ---");
  await seedAgent();
  await seedTenant();
  await seedGuest();
  await seedIncludedService();
  await seedExtraCharge();
  await seedPhoto();
  await seedHashtag();
  await seedChannel();
  console.log("--- Direct Dependents Seeded ---");

  await seedProperty();
  await seedPricingRule();
  await seedContract();
  await seedReservation();
  await seedEvent();
  await seedTask();
  await seedReport();
  await seedReview();
  await seedNotification();
  await seedTaxRecord();
  await seedMortgage();
  await seedExpense();
  await seedDiscount();
  await seedAnalytics();
  await seedCommunicationLog();
  await seedTicket();
  await seedPayment();
  await seedSubscription();
  await seedIncrease();
  await seedOffer();
  await seedAvailability();
  await seedComplianceRecord();
  await seedCommissionRule();
  console.log("--- Main Business Models Seeded ---");

  await seedPropertyHashtag();
  await seedPost(); // seedPost might assign hashtagId, or seedPostHashtag can do it.
  await seedPostHashtag();
  await seedUserPermission();
  await seedEventAttendees();
  await seedFavorite();
  await seedMention();
  // ...add other join tables as needed
  console.log("--- Join/Link Tables & Many-to-Many Seeded ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
