import { faker } from "@faker-js/faker";
import {
  AccountType,
  AgentSpecialities, // Added for Agent seeding
  AnalyticsType,
  BookingSource,
  BuildingClass,
  ChannelCategory,
  ChannelType,
  CommissionRuleType,
  CommunicationType,
  ComplianceStatus,
  ComplianceType,
  ContactMethod,
  ContractStatus,
  DiscountType,
  EnergyRating,
  EventType,
  ExpenseStatus,
  ExpenseType,
  FacilityStatus,
  FacilityType,
  Gender,
  HashtagType,
  IncreaseStatus,
  ListingType,
  MentionType,
  MortgageStatus,
  NotificationType,
  OfferStatus,
  OfferType,
  OwnershipCategory,
  OwnershipType,
  PaymentStatus,
  PhotoType,
  PropertyAmenities, // Imported directly
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures, // Imported directly
  PropertyStatus,
  PropertyType,
  ReportStatus,
  ReportType,
  ReservationStatus,
  Role,
  SharedStatus, // Corrected: AgencyStatus and AgentStatus are SharedStatus
  SubscriptionStatus,
  SubscriptionTier,
  TaskPriority,
  TaskStatus,
  TaskType,
  TicketStatus,
  UserStatus,
  // Prisma doesn't export enums directly to db object, so we use them from @prisma/client
} from "@prisma/client";

import { db } from "../src"; // Assuming PrismaClient is exported as db

// Helper to get a random element or undefined if array is empty or only has nulls
function getRandomElement<T>(arr: (T | null | undefined)[]): T | undefined {
  const validElements = arr.filter((item) => item != null) as T[];
  if (validElements.length === 0) return undefined;
  return faker.helpers.arrayElement(validElements);
}

async function main() {
  console.log("Starting seeding process...");

  // --- Seed Locations ---
  const locationsSeeded = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      try {
        return await db.location.create({
          data: {
            country: faker.location.countryCode(),
            city: faker.location.city(),
            district: faker.datatype.boolean()
              ? faker.location.county()
              : undefined,
            address: faker.location.streetAddress(),
            postalCode: faker.location.zipCode(),
            coordinates: {
              lat: faker.location.latitude(),
              lng: faker.location.longitude(),
            },
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating location:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${locationsSeeded.length} locations. Total locations in DB: ${await db.location.count()}`,
  );

  // --- Seed Agencies ---
  const agenciesSeeded = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      try {
        return await db.agency.create({
          data: {
            id: faker.string.uuid(),
            name: faker.company.name(),
            description: faker.lorem.paragraph(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            address: faker.location.streetAddress(),
            website: faker.internet.url(),
            logoUrl: faker.image.urlLoremFlickr({ category: "business" }),
            status: faker.helpers.arrayElement(Object.values(SharedStatus)), // Corrected
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            settings: { theme: faker.color.rgb() },
            theme: faker.color.rgb(),
            externalId: faker.string.uuid(),
            // ownerId will be set after users are created
          },
        });
      } catch (e) {
        console.error("Error creating agency:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${agenciesSeeded.length} agencies. Total agencies in DB: ${await db.agency.count()}`,
  );

  // --- Seed Users ---
  const usersSeeded = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      try {
        const location = getRandomElement(locationsSeeded);
        const agency = getRandomElement(agenciesSeeded);

        return await db.user.create({
          data: {
            id: faker.string.uuid(),
            username: faker.internet.userName(),
            name: faker.person.fullName(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            profilePicture: faker.image.avatar(),
            image: faker.image.avatar(),
            role: faker.helpers.arrayElement(Object.values(Role)),
            type: faker.helpers.arrayElement(Object.values(AccountType)),
            isActive: faker.datatype.boolean(),
            lastLogin: faker.date.recent(),
            emailVerified: faker.datatype.boolean() ? new Date() : undefined,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            locale: faker.location.countryCode(),
            timezone: faker.location.timeZone(),
            preferences: {
              theme: faker.helpers.arrayElement(["dark", "light"]),
              notifications: faker.datatype.boolean(),
            },
            agencyId: agency?.id,
            status: faker.helpers.arrayElement(Object.values(UserStatus)),
            locationId: location?.id,
          },
        });
      } catch (e) {
        console.error("Error creating user:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${usersSeeded.length} users. Total users in DB: ${await db.user.count()}`,
  );

  // Update Agency owners
  for (const agency of agenciesSeeded) {
    const owner = getRandomElement(usersSeeded);
    if (owner) {
      try {
        await db.agency.update({
          where: { id: agency.id },
          data: { ownerId: owner.id },
        });
      } catch (e) {
        console.error(`Error updating agency owner for ${agency.id}:`, e);
      }
    }
  }
  console.log("Updated agency owners.");

  // --- Seed Agents ---
  const agentsSeeded = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      try {
        const agency = getRandomElement(agenciesSeeded);
        const ownerUser = getRandomElement(usersSeeded);
        if (!agency) {
          console.warn("Skipping agent creation as no agency was found.");
          return null;
        }

        return await db.agent.create({
          data: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            address: faker.location.streetAddress(),
            website: faker.internet.url(),
            logoUrl: faker.image.avatar(),
            status: faker.helpers.arrayElement(Object.values(SharedStatus)), // Corrected
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            agencyId: agency.id,
            specialities: faker.helpers.arrayElements(
              Object.values(AgentSpecialities), // Added specialities
              faker.number.int({ min: 0, max: 3 }),
            ),
            settings: {
              commissionRate: faker.number.float({
                min: 0.01,
                max: 0.2,
                multipleOf: 0.01,
              }),
            },
            externalId: faker.string.uuid(),
            ownerId: ownerUser?.id,
            lastActive: faker.date.recent(),
          },
        });
      } catch (e) {
        console.error("Error creating agent:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${agentsSeeded.length} agents. Total agents in DB: ${await db.agent.count()}`,
  );

  // --- Seed Providers ---
  const providersSeeded = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      try {
        return await db.provider.create({
          data: {
            id: faker.string.uuid(),
            name: faker.company.name(),
            apiKey: faker.string.alphanumeric(32),
            apiSecret: faker.string.alphanumeric(32),
            baseUrl: faker.internet.url(),
            isActive: faker.datatype.boolean(),
            commission: Number(faker.finance.amount(1, 25, 2)),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            deletedAt: faker.datatype.boolean()
              ? faker.date.future()
              : undefined,
            source: faker.helpers.arrayElement(Object.values(BookingSource)),
          },
        });
      } catch (e) {
        console.error("Error creating provider:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${providersSeeded.length} providers. Total providers in DB: ${await db.provider.count()}`,
  );

  // --- Seed Currencies ---
  const currenciesSeeded = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      try {
        const code = faker.finance.currencyCode();
        // Attempt to find if currency with this code already exists
        const existingCurrency = await db.currency.findUnique({
          where: { code },
        });
        if (existingCurrency) {
          console.warn(
            `Currency with code ${code} already exists. Skipping creation.`,
          );
          return existingCurrency; // Return existing one to be part of the seeded array
        }
        return await db.currency.create({
          data: {
            id: faker.string.uuid(),
            code: code,
            name: faker.finance.currencyName(),
            symbol: faker.finance.currencySymbol(),
            exchangeRate: faker.number.float({
              min: 0.1,
              max: 100,
              multipleOf: 0.0001,
            }),
            isActive: faker.datatype.boolean(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        // This catch might be redundant if findUnique handles P2002, but good for other errors
        console.error("Error creating currency:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created/Fetched ${currenciesSeeded.length} currencies. Total currencies in DB: ${await db.currency.count()}`,
  );

  // --- Seed Facilities ---
  const facilitiesSeeded = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      try {
        const location = getRandomElement(locationsSeeded);
        return await db.facility.create({
          data: {
            name: faker.company.name() + " Facility",
            description: faker.lorem.sentence(),
            icon: faker.image.urlPicsumPhotos(),
            logo: faker.image.urlPicsumPhotos(),
            locationId: location?.id,
            type: faker.helpers.arrayElement(Object.values(FacilityType)),
            status: faker.helpers.arrayElement(Object.values(FacilityStatus)),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating facility:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${facilitiesSeeded.length} facilities. Total facilities in DB: ${await db.facility.count()}`,
  );

  // --- Seed IncludedServices ---
  const includedServicesSeeded = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      try {
        const facility = getRandomElement(facilitiesSeeded);
        return await db.includedService.create({
          data: {
            name: faker.commerce.productName() + " Service",
            description: faker.lorem.sentence(),
            icon: faker.image.urlPicsumPhotos(),
            logo: faker.image.urlPicsumPhotos(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            facilityId: facility?.id,
          },
        });
      } catch (e) {
        console.error("Error creating includedService:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${includedServicesSeeded.length} includedServices. Total includedServices: ${await db.includedService.count()}`,
  );

  // --- Seed ExtraCharges ---
  const extraChargesSeeded = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      try {
        const facility = getRandomElement(facilitiesSeeded);
        return await db.extraCharge.create({
          data: {
            name: faker.commerce.productName() + " Charge",
            description: faker.lorem.sentence(),
            icon: faker.image.urlPicsumPhotos(),
            logo: faker.image.urlPicsumPhotos(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            facilityId: facility?.id,
          },
        });
      } catch (e) {
        console.error("Error creating extraCharge:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${extraChargesSeeded.length} extraCharges. Total extraCharges: ${await db.extraCharge.count()}`,
  );

  // --- Seed Properties ---
  const propertiesSeeded = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      try {
        const location = getRandomElement(locationsSeeded);
        const agent = getRandomElement(agentsSeeded);
        const owner = getRandomElement(usersSeeded);
        const seller = getRandomElement(usersSeeded);
        const buyer = getRandomElement(usersSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const currency = getRandomElement(currenciesSeeded);

        if (!location) {
          console.warn("Skipping property creation as no location was found.");
          return null;
        }
        if (!currency) {
          console.warn("Skipping property creation as no currency was found.");
          return null;
        }

        return await db.property.create({
          data: {
            id: faker.string.uuid(),
            propertyNumber: faker.string.uuid(),
            title: faker.lorem.words(5),
            description: faker.lorem.paragraphs(2),
            propertyType: faker.helpers.arrayElement(
              Object.values(PropertyType),
            ),
            propertyStatus: faker.helpers.arrayElement(
              Object.values(PropertyStatus),
            ),
            category: faker.helpers.arrayElement(
              Object.values(PropertyCategory),
            ),
            locationId: location.id,
            size: faker.number.float({ min: 30, max: 1000, multipleOf: 0.1 }),
            bedrooms: faker.number.int({ min: 0, max: 10 }),
            bathrooms: faker.number.int({ min: 1, max: 7 }),
            floors: faker.number.int({ min: 1, max: 50 }),
            yearBuilt: faker.number.int({
              min: 1800,
              max: new Date().getFullYear(),
            }),
            condition: faker.helpers.arrayElement(
              Object.values(PropertyCondition),
            ),
            features: faker.helpers.arrayElements(
              Object.values(PropertyFeatures),
              faker.number.int({ min: 0, max: 5 }),
            ),
            amenities: faker.helpers.arrayElements(
              Object.values(PropertyAmenities),
              faker.number.int({ min: 0, max: 5 }),
            ),
            buildingClass: faker.helpers.arrayElement(
              Object.values(BuildingClass),
            ),
            energyRating: faker.helpers.arrayElement(
              Object.values(EnergyRating),
            ),
            parkingSpaces: faker.number.int({ min: 0, max: 10 }),
            listingType: faker.helpers.arrayElement(Object.values(ListingType)),
            ownershipType: faker.helpers.arrayElement(
              Object.values(OwnershipType),
            ),
            ownershipCategory: faker.helpers.arrayElement(
              Object.values(OwnershipCategory),
            ),
            contactMethod: faker.helpers.arrayElement(
              Object.values(ContactMethod),
            ),
            contactEmail: faker.internet.email(),
            contactPhone: faker.phone.number(),
            isActive: faker.datatype.boolean(),
            featured: faker.datatype.boolean(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            agentId: agent?.id,
            ownerId: owner?.id,
            sellerId: seller?.id,
            buyerId: buyer?.id,
            agencyId: agency?.id,
            currencyId: currency.id,
            facilityId: getRandomElement(facilitiesSeeded)?.id,
            includedServiceId: getRandomElement(includedServicesSeeded)?.id,
            extraChargeId: getRandomElement(extraChargesSeeded)?.id,
            marketValue: Number(faker.finance.amount(50000, 5000000, 2)),
            taxValue: Number(faker.finance.amount(40000, 4000000, 2)),
            insuranceValue: Number(faker.finance.amount(0, 1000000, 2)),
            mortgageEligible: faker.datatype.boolean(),
            titleDeedNumber: faker.datatype.boolean()
              ? faker.string.alphanumeric(10)
              : undefined,
            titleDeedDate: faker.datatype.boolean()
              ? faker.date.past()
              : undefined,
          },
        });
      } catch (e) {
        console.error("Error creating property:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${propertiesSeeded.length} properties. Total properties in DB: ${await db.property.count()}`,
  );

  // --- Seed Guests ---
  const guestsSeeded = await Promise.all(
    Array.from({ length: 70 }).map(async () => {
      try {
        const agency = getRandomElement(agenciesSeeded);
        return await db.guest.create({
          data: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            phone: faker.phone.number(),
            image: faker.image.avatar(),
            nationality: faker.location.country(),
            passportNumber: faker.string.alphanumeric(10),
            gender: faker.helpers.arrayElement(Object.values(Gender)),
            birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.countryCode(),
            zipCode: faker.location.zipCode(),
            email: faker.internet.email(),
            agencyId: agency?.id,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating guest:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${guestsSeeded.length} guests. Total guests in DB: ${await db.guest.count()}`,
  );

  // --- Seed Photos ---
  const photosSeeded = await Promise.all(
    Array.from({ length: 200 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        const property = getRandomElement(propertiesSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const agent = getRandomElement(agentsSeeded);

        return await db.photo.create({
          data: {
            id: faker.string.uuid(),
            url: faker.image.urlLoremFlickr({ category: "city" }),
            type: faker.helpers.arrayElement(Object.values(PhotoType)),
            caption: faker.lorem.sentence(),
            alt: faker.lorem.words(3),
            src: faker.image.urlLoremFlickr({ category: "nature" }),
            featured: faker.datatype.boolean(),
            width: faker.number.int({ min: 600, max: 1920 }), // Corrected
            height: faker.number.int({ min: 400, max: 1080 }), // Corrected
            fileSize: faker.number.int({ min: 10000, max: 5000000 }),
            mimeType: "image/jpeg",
            dominantColor: faker.color.rgb(),
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: user?.id,
            propertyId: property?.id,
            agencyId: agency?.id,
            agentId: agent?.id,
          },
        });
      } catch (e) {
        console.error("Error creating photo:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${photosSeeded.length} photos. Total photos in DB: ${await db.photo.count()}`,
  );

  // --- Seed Posts ---
  const postsSeeded = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const agent = getRandomElement(agentsSeeded);
        if (!user) {
          console.warn("Skipping post creation as no user was found.");
          return null;
        }

        return await db.post.create({
          data: {
            id: faker.string.uuid(),
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3),
            slug: faker.helpers.slugify(faker.lorem.words(5).toLowerCase()),
            userId: user.id,
            agencyId: agency?.id,
            agentId: agent?.id,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating post:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${postsSeeded.length} posts. Total posts in DB: ${await db.post.count()}`,
  );

  // Update Photos with postId
  for (const photo of photosSeeded) {
    if (!photo.postId && faker.datatype.boolean(0.3)) {
      const randomPost = getRandomElement(postsSeeded);
      if (randomPost) {
        try {
          await db.photo.update({
            where: { id: photo.id },
            data: { postId: randomPost.id },
          });
        } catch (e) {
          console.error(
            `Error updating photo ${photo.id} with postId ${randomPost.id}:`,
            e,
          );
        }
      }
    }
  }
  console.log("Updated photos with postIds where applicable.");

  // --- Seed Favorites ---
  const favoritesSeeded = await Promise.all(
    Array.from({ length: 150 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        const property = getRandomElement(propertiesSeeded);
        if (!user || !property) return null;

        return await db.favorite.create({
          data: {
            userId: user.id,
            propertyId: property.id,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        if (e.code === "P2002") return null;
        console.error("Error creating favorite:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${favoritesSeeded.length} favorites. Total favorites in DB: ${await db.favorite.count()}`,
  );

  // --- Seed Tenants ---
  const tenantsSeeded = await Promise.all(
    Array.from({ length: 60 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        const property = getRandomElement(propertiesSeeded);
        if (!user || !property) return null;

        // Check if a tenant already exists for this user
        const existingTenantForUser = await db.tenant.findUnique({
          where: { userId: user.id },
        });
        if (existingTenantForUser) {
          console.warn(`Tenant already exists for user ${user.id}. Skipping.`);
          return null;
        }
        // Check if a tenant already exists for this email (if different from user's email)
        const tenantEmail = faker.internet.email();
        const existingTenantForEmail = await db.tenant.findUnique({
          where: { email: tenantEmail },
        });
        if (existingTenantForEmail) {
          console.warn(
            `Tenant already exists for email ${tenantEmail}. Skipping.`,
          );
          return null;
        }

        return await db.tenant.create({
          data: {
            id: faker.string.uuid(),
            userId: user.id,
            firstName: user.firstName || faker.person.firstName(),
            lastName: user.lastName || faker.person.lastName(),
            email: tenantEmail, // Use a new email for tenant to avoid conflict with user email if user is not unique
            phoneNumber: user.phoneNumber || faker.phone.number(),
            leaseStartDate: faker.date.past(),
            leaseEndDate: faker.date.future(),
            paymentStatus: faker.helpers.arrayElement(
              Object.values(PaymentStatus),
            ),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            propertyId: property.id,
          },
        });
      } catch (e) {
        if (e.code === "P2002") {
          console.warn(
            `Skipping tenant creation due to unique constraint: ${e.message}`,
          );
          return null;
        }
        console.error("Error creating tenant:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${tenantsSeeded.length} tenants. Total tenants in DB: ${await db.tenant.count()}`,
  );

  // --- Seed Tasks ---
  const tasksSeeded = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      try {
        const createdBy = getRandomElement(usersSeeded);
        const assignedTo = getRandomElement(usersSeeded);
        const property = getRandomElement(propertiesSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const agent = getRandomElement(agentsSeeded);
        const facility = getRandomElement(facilitiesSeeded);
        const includedService = getRandomElement(includedServicesSeeded);
        const extraCharge = getRandomElement(extraChargesSeeded);

        return await db.task.create({
          data: {
            id: faker.string.uuid(),
            title: faker.lorem.words(4),
            description: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(Object.values(TaskStatus)),
            type: faker.helpers.arrayElement(Object.values(TaskType)),
            priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
            createdById: createdBy?.id,
            assignedToId: assignedTo?.id,
            propertyId: property?.id,
            agencyId: agency?.id,
            agentId: agent?.id,
            facilityId: facility?.id,
            includedServiceId: includedService?.id,
            extraChargeId: extraCharge?.id,
            dueDate: faker.datatype.boolean() ? faker.date.future() : undefined,
            completedAt: faker.datatype.boolean()
              ? faker.date.recent()
              : undefined,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating task:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${tasksSeeded.length} tasks. Total tasks in DB: ${await db.task.count()}`,
  );

  // --- Seed PricingRules ---
  const pricingRulesSeeded = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        const currency = getRandomElement(currenciesSeeded);
        if (!property || !currency) return null;

        return await db.pricingRule.create({
          data: {
            id: faker.string.uuid(),
            name: faker.commerce.productName() + " Pricing Rule",
            description: faker.lorem.sentence(),
            basePrice: Number(faker.finance.amount(50, 1000, 2)),
            strategy: faker.helpers.arrayElement([
              "FIXED",
              "PERCENTAGE_ADJUSTMENT",
              "DYNAMIC",
            ]),
            startDate: faker.date.past(),
            endDate: faker.date.future(),
            minNights: faker.number.int({ min: 1, max: 7 }),
            maxNights: faker.number.int({ min: 7, max: 30 }),
            isActive: faker.datatype.boolean(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            propertyId: property.id,
            currencyId: currency.id,
            weekdayPrices: {
              mon: Number(faker.finance.amount(50, 150, 0)),
              tue: Number(faker.finance.amount(50, 150, 0)),
            },
            taxRules: { vat: 0.2, cityTax: 5.0 },
            discountRules: { earlyBirdDays: 30, earlyBirdDiscount: 0.1 },
          },
        });
      } catch (e) {
        console.error("Error creating pricingRule:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${pricingRulesSeeded.length} pricingRules. Total pricingRules: ${await db.pricingRule.count()}`,
  );

  // --- Seed Subscriptions ---
  const subscriptionsSeeded = await Promise.all(
    Array.from({ length: 70 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const agent = getRandomElement(agentsSeeded);
        const pricingRule = getRandomElement(pricingRulesSeeded);

        let entityIdVal = faker.string.uuid();
        let entityTypeVal = "USER"; // Default
        let userIdVal = user?.id;
        let agencyIdVal = agency?.id;
        let agentIdVal = agent?.id;

        const choice = faker.helpers.arrayElement(["user", "agency", "agent"]);
        if (choice === "user" && user) {
          entityIdVal = user.id;
          entityTypeVal = "USER";
          userIdVal = user.id;
          agencyIdVal = undefined;
          agentIdVal = undefined;
        } else if (choice === "agency" && agency) {
          entityIdVal = agency.id;
          entityTypeVal = "AGENCY";
          agencyIdVal = agency.id;
          userIdVal = undefined;
          agentIdVal = undefined;
        } else if (choice === "agent" && agent) {
          entityIdVal = agent.id;
          entityTypeVal = "AGENT";
          agentIdVal = agent.id;
          agencyIdVal = agent.agencyId; // Agent belongs to an agency
          userIdVal = undefined;
        } else {
          // Fallback if chosen entity is not available
          if (user) {
            entityIdVal = user.id;
            entityTypeVal = "USER";
            userIdVal = user.id;
          } else if (agency) {
            entityIdVal = agency.id;
            entityTypeVal = "AGENCY";
            agencyIdVal = agency.id;
          } else if (agent) {
            entityIdVal = agent.id;
            entityTypeVal = "AGENT";
            agentIdVal = agent.id;
            agencyIdVal = agent.agencyId;
          } else {
            // If still no entity, skip this subscription
            console.warn(
              "Skipping subscription creation as no valid entity (user, agency, or agent) was found.",
            );
            return null;
          }
        }

        return await db.subscription.create({
          data: {
            id: faker.string.uuid(),
            entityId: entityIdVal,
            entityType: entityTypeVal,
            tier: faker.helpers.arrayElement(Object.values(SubscriptionTier)),
            status: faker.helpers.arrayElement(
              Object.values(SubscriptionStatus),
            ),
            startDate: faker.date.past(),
            endDate: faker.date.future(),
            features: faker.lorem.words(5).split(" "),
            isAutoRenew: faker.datatype.boolean(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            agencyId: agencyIdVal,
            agentId: agentIdVal,
            userId: userIdVal,
            paymentMethod: faker.finance.transactionType(),
            paymentStatus: faker.helpers.arrayElement(
              Object.values(PaymentStatus),
            ),
            pricingRuleId: pricingRule?.id,
          },
        });
      } catch (e) {
        console.error("Error creating subscription:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${subscriptionsSeeded.length} subscriptions. Total subscriptions: ${await db.subscription.count()}`,
  );

  // --- Seed Sessions ---
  const sessionsSeeded = await Promise.all(
    Array.from({ length: 80 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        if (!user) return null;
        return await db.session.create({
          data: {
            id: faker.string.uuid(),
            sessionToken: faker.string.alphanumeric(32),
            userId: user.id,
            expires: faker.date.future(),
          },
        });
      } catch (e) {
        console.error("Error creating session:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${sessionsSeeded.length} sessions. Total sessions in DB: ${await db.session.count()}`,
  );

  // --- Seed Mortgages ---
  const mortgagesSeeded = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        if (!property) return null;
        return await db.mortgage.create({
          data: {
            propertyId: property.id,
            lender: faker.company.name(),
            principal: Number(faker.finance.amount(50000, 2000000, 2)),
            interestRate: faker.number.float({
              min: 1,
              max: 8,
              precision: 0.01,
            }),
            startDate: faker.date.past(),
            endDate: faker.datatype.boolean() ? faker.date.future() : undefined,
            status: faker.helpers.arrayElement(Object.values(MortgageStatus)),
            notes: faker.lorem.sentence(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating mortgage:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${mortgagesSeeded.length} mortgages. Total mortgages in DB: ${await db.mortgage.count()}`,
  );

  // --- Seed Reviews ---
  const reviewsSeeded = await Promise.all(
    Array.from({ length: 120 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        const property = getRandomElement(propertiesSeeded);
        const agent = getRandomElement(agentsSeeded);
        const agency = getRandomElement(agenciesSeeded);

        if (!user) return null;

        return await db.review.create({
          data: {
            id: faker.string.uuid(),
            userId: user.id,
            propertyId: property?.id,
            agentId: agent?.id,
            agencyId: agency?.id,
            title: faker.lorem.words(4),
            content: faker.lorem.sentences(3),
            rating: faker.number.int({ min: 1, max: 5 }),
            isEdited: faker.datatype.boolean(0.1),
            helpfulCount: faker.number.int({ min: 0, max: 100 }),
            notHelpfulCount: faker.number.int({ min: 0, max: 20 }),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating review:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${reviewsSeeded.length} reviews. Total reviews in DB: ${await db.review.count()}`,
  );

  // --- Seed Reservations ---
  const reservationsSeeded = await Promise.all(
    Array.from({ length: 150 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        const property = getRandomElement(propertiesSeeded);
        const guest = getRandomElement(guestsSeeded);
        const currency = getRandomElement(currenciesSeeded);
        const agent = getRandomElement(agentsSeeded);
        const pricingRule = getRandomElement(
          pricingRulesSeeded.filter((pr) => pr?.propertyId === property?.id),
        );
        const provider = getRandomElement(providersSeeded);

        if (!user || !property || !guest || !currency) return null;
        const startDate = faker.date.soon({ days: 30 });
        const endDate = faker.date.soon({
          days: 30 + faker.number.int({ min: 1, max: 14 }),
          refDate: startDate,
        });

        return await db.reservation.create({
          data: {
            id: faker.string.uuid(),
            propertyId: property.id,
            userId: user.id,
            agentId: agent?.id,
            startDate: startDate,
            endDate: endDate,
            guests: faker.number.int({
              min: 1,
              max: property.bedrooms ? property.bedrooms * 2 : 4,
            }),
            status: faker.helpers.arrayElement(
              Object.values(ReservationStatus),
            ),
            totalPrice: Number(faker.finance.amount(50, 2000, 2)),
            currencyId: currency.id,
            paymentStatus: faker.helpers.arrayElement(
              Object.values(PaymentStatus),
            ),
            specialRequests: faker.datatype.boolean()
              ? faker.lorem.sentence()
              : undefined,
            checkInTime: faker.datatype.boolean()
              ? faker.date.soon()
              : undefined,
            checkOutTime: faker.datatype.boolean()
              ? faker.date.soon()
              : undefined,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            pricingRuleId: pricingRule?.id,
            agencyId:
              property.agencyId ||
              agent?.agencyId ||
              getRandomElement(agenciesSeeded)?.id,
            guestId: guest.id,
            providerId: provider?.id,
          },
        });
      } catch (e) {
        console.error("Error creating reservation:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${reservationsSeeded.length} reservations. Total reservations: ${await db.reservation.count()}`,
  );

  // --- Seed TaxRecords ---
  const taxRecordsSeeded = await Promise.all(
    propertiesSeeded.map(async (property) => {
      try {
        if (!property) return null;
        return await db.taxRecord.create({
          data: {
            propertyId: property.id,
            year:
              new Date().getFullYear() - faker.number.int({ min: 0, max: 3 }),
            amount: Number(faker.finance.amount(100, 10000, 2)),
            percentage: faker.number.float({
              min: 0.5,
              max: 5,
              precision: 0.01,
            }),
            paid: faker.datatype.boolean(),
            dueDate: faker.date.future(),
            paidDate: faker.datatype.boolean()
              ? faker.date.recent()
              : undefined,
            notes: faker.lorem.sentence(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating taxRecord:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${taxRecordsSeeded.length} taxRecords. Total taxRecords: ${await db.taxRecord.count()}`,
  );

  // --- Seed Events ---
  const eventsSeeded = await Promise.all(
    Array.from({ length: 70 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        const createdBy = getRandomElement(usersSeeded);
        if (!property || !createdBy) return null;

        return await db.event.create({
          data: {
            id: faker.string.uuid(),
            propertyId: property.id,
            title: faker.lorem.words(3),
            description: faker.lorem.sentence(),
            eventType: faker.helpers.arrayElement(Object.values(EventType)),
            scheduledAt: faker.date.future(),
            duration: faker.number.int({ min: 30, max: 180 }),
            createdById: createdBy.id,
            isActive: faker.datatype.boolean(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            attendees: {
              // Added attendees
              connect: faker.helpers.arrayElements(
                usersSeeded.filter(Boolean).map((u) => ({ id: u.id })),
                faker.number.int({ min: 0, max: 5 }),
              ),
            },
          },
        });
      } catch (e) {
        console.error("Error creating event:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${eventsSeeded.length} events. Total events in DB: ${await db.event.count()}`,
  );

  // --- Seed Reports ---
  const reportsSeeded = await Promise.all(
    Array.from({ length: 40 }).map(async () => {
      try {
        const generatedBy = getRandomElement(usersSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const facility = getRandomElement(facilitiesSeeded);
        const includedService = getRandomElement(includedServicesSeeded);
        const extraCharge = getRandomElement(extraChargesSeeded);
        const provider = getRandomElement(providersSeeded);

        if (!generatedBy) return null;

        return await db.report.create({
          data: {
            id: faker.string.uuid(),
            title: faker.lorem.words(4) + " Report",
            reportType: faker.helpers.arrayElement(Object.values(ReportType)),
            generatedById: generatedBy.id,
            startDate: faker.date.past({ years: 1 }),
            endDate: faker.date.recent(),
            entityId: faker.datatype.boolean()
              ? getRandomElement(propertiesSeeded)?.id
              : getRandomElement(agenciesSeeded)?.id,
            entityType: faker.datatype.boolean() ? "Property" : "Agency",
            totalRevenue: Number(faker.finance.amount(1000, 100000, 2)),
            totalBookings: faker.number.int({ min: 10, max: 500 }),
            averagePrice: Number(faker.finance.amount(50, 500, 2)),
            occupancyRate: faker.number.float({
              min: 0.3,
              max: 0.95,
              precision: 0.01,
            }),
            fileUrl: faker.internet.url(),
            description: faker.lorem.sentence(),
            data: { details: faker.lorem.paragraph() },
            status: faker.helpers.arrayElement(Object.values(ReportStatus)),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            agencyId: agency?.id,
            facilityId: facility?.id,
            includedServiceId: includedService?.id,
            extraChargeId: extraCharge?.id,
            providerId: provider?.id,
          },
        });
      } catch (e) {
        console.error("Error creating report:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${reportsSeeded.length} reports. Total reports in DB: ${await db.report.count()}`,
  );

  // Update reports with reservationIds
  for (const report of reportsSeeded) {
    if (!report) continue;
    const numReservations = faker.number.int({ min: 0, max: 10 });
    const selectedReservations = faker.helpers.arrayElements(
      reservationsSeeded.filter(Boolean),
      numReservations,
    );
    if (selectedReservations.length > 0) {
      try {
        await db.report.update({
          where: { id: report.id },
          data: { reservationIds: selectedReservations.map((r) => r.id) },
        });
      } catch (e) {
        console.error(
          `Error updating report ${report.id} with reservationIds:`,
          e,
        );
      }
    }
  }
  console.log("Updated reports with reservationIds.");

  // --- Seed Offers ---
  const offersSeeded = await Promise.all(
    Array.from({ length: 60 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        const guestUser = getRandomElement(
          usersSeeded.filter((u) => u?.role === "GUEST" || u?.role === "USER"),
        );
        const reservation = getRandomElement(
          reservationsSeeded.filter((r) => r?.propertyId === property?.id),
        );

        if (!property || !guestUser) return null;
        const basePrice = Number(faker.finance.amount(100, 3000, 2));
        const discountRate = faker.number.float({
          min: 0,
          max: 0.5,
          precision: 0.01,
        });

        return await db.offer.create({
          data: {
            id: faker.string.uuid(),
            offerType: faker.helpers.arrayElement(Object.values(OfferType)),
            status: faker.helpers.arrayElement(Object.values(OfferStatus)),
            basePrice: basePrice,
            discountRate: discountRate,
            finalPrice: basePrice * (1 - discountRate),
            guestId: guestUser.id,
            startDate: faker.date.soon({ days: 15 }),
            endDate: faker.date.soon({
              days: 45,
              refDate: faker.date.soon({ days: 15 }),
            }),
            specialRequirements: faker.datatype.boolean()
              ? faker.lorem.sentence()
              : undefined,
            notes: faker.datatype.boolean()
              ? faker.lorem.sentence()
              : undefined,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            reservationId: faker.datatype.boolean(0.7)
              ? reservation?.id
              : undefined,
            propertyId: property.id,
          },
        });
      } catch (e) {
        console.error("Error creating offer:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${offersSeeded.length} offers. Total offers in DB: ${await db.offer.count()}`,
  );

  // --- Seed Payments ---
  const paymentsSeeded = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      try {
        const tenant = getRandomElement(tenantsSeeded);
        const currency = getRandomElement(currenciesSeeded);
        if (!tenant || !currency) return null;

        return await db.payment.create({
          data: {
            id: faker.string.uuid(),
            tenantId: tenant.id,
            amount: Number(faker.finance.amount(50, 5000, 2)),
            currencyId: currency.id,
            paymentDate: faker.date.past(),
            dueDate: faker.date.soon(),
            status: faker.helpers.arrayElement(Object.values(PaymentStatus)),
            paymentMethod: faker.helpers.arrayElement([
              "CREDIT_CARD",
              "BANK_TRANSFER",
              "PAYPAL",
              "CASH",
            ]),
            reference: faker.finance.transactionDescription(),
            notes: faker.datatype.boolean()
              ? faker.lorem.sentence()
              : undefined,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            stripePaymentIntentId: faker.datatype.boolean()
              ? `pi_${faker.string.alphanumeric(24)}`
              : undefined,
            stripeClientSecret: faker.datatype.boolean()
              ? `pi_${faker.string.alphanumeric(24)}_secret_${faker.string.alphanumeric(24)}`
              : undefined,
          },
        });
      } catch (e) {
        console.error("Error creating payment:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${paymentsSeeded.length} payments. Total payments in DB: ${await db.payment.count()}`,
  );

  // --- Seed Permissions ---
  const permissionNames = [
    "view_dashboard",
    "edit_settings",
    "manage_users",
    "manage_properties",
    "manage_bookings",
  ];
  const permissionsSeeded = await Promise.all(
    permissionNames.map(async (name) => {
      try {
        return await db.permission.upsert({
          where: { name },
          update: {},
          create: {
            id: faker.string.uuid(),
            name: name,
            description: `Allows ${name.replace("_", " ")}`,
          },
        });
      } catch (e) {
        console.error("Error creating/upserting permission:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created/Fetched ${permissionsSeeded.length} permissions. Total permissions: ${await db.permission.count()}`,
  );

  // Assign permissions to users
  for (const user of usersSeeded) {
    if (!user) continue;
    let permsToConnect: { id: string }[] = [];
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      permsToConnect = permissionsSeeded.map((p) => ({ id: p.id }));
    } else if (user.role === "AGENT" || user.role === "AGENCY_ADMIN") {
      permsToConnect = permissionsSeeded
        .filter(
          (p) => p.name.includes("properties") || p.name.includes("bookings"),
        )
        .map((p) => ({ id: p.id }));
    }
    if (permsToConnect.length > 0) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: { Permission: { connect: permsToConnect } },
        });
      } catch (e) {
        console.error(`Error assigning permissions to user ${user.id}:`, e);
      }
    }
  }
  console.log("Assigned permissions to users.");

  // --- Seed Languages ---
  const languageData = [
    { code: "en", name: "English", nativeName: "English", isRTL: false },
    { code: "es", name: "Spanish", nativeName: "Español", isRTL: false },
    { code: "fr", name: "French", nativeName: "Français", isRTL: false },
    { code: "ar", name: "Arabic", nativeName: "العربية", isRTL: true },
    { code: "de", name: "German", nativeName: "Deutsch", isRTL: false },
  ];
  const languagesSeeded = await Promise.all(
    languageData.map(async (lang) => {
      try {
        const agency = getRandomElement(agenciesSeeded);
        return await db.language.upsert({
          where: { code: lang.code },
          update: { agencyId: agency?.id, isActive: faker.datatype.boolean() },
          create: {
            id: faker.string.uuid(),
            ...lang,
            isActive: faker.datatype.boolean(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            agencyId: agency?.id,
          },
        });
      } catch (e) {
        console.error("Error creating/upserting language:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created/Fetched ${languagesSeeded.length} languages. Total languages: ${await db.language.count()}`,
  );

  // --- Seed Mentions ---
  const mentionsSeeded = await Promise.all(
    Array.from({ length: 80 }).map(async () => {
      try {
        const mentionedBy = getRandomElement(usersSeeded);
        const mentionedTo = getRandomElement(usersSeeded);
        const task = getRandomElement(tasksSeeded);
        const property = getRandomElement(propertiesSeeded);
        const agency = getRandomElement(agenciesSeeded);

        if (!mentionedBy || !mentionedTo || mentionedBy.id === mentionedTo.id)
          return null;

        const type = faker.helpers.arrayElement(Object.values(MentionType));
        let relatedTaskId, relatedPropertyId;
        if (type === "TASK" && task) relatedTaskId = task.id;
        if (type === "PROPERTY" && property) relatedPropertyId = property.id;

        return await db.mention.create({
          data: {
            id: faker.string.uuid(),
            mentionedById: mentionedBy.id,
            mentionedToId: mentionedTo.id,
            type: type,
            taskId: relatedTaskId,
            propertyId: relatedPropertyId,
            content: faker.lorem.sentence(),
            isRead: faker.datatype.boolean(0.3),
            agencyId: agency?.id,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            userId: mentionedTo.id,
          },
        });
      } catch (e) {
        if (e.code === "P2002") {
          console.warn(
            `Skipping mention creation due to unique constraint: ${e.message}`,
          );
          return null;
        }
        console.error("Error creating mention:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${mentionsSeeded.length} mentions. Total mentions in DB: ${await db.mention.count()}`,
  );

  // --- Seed Discounts ---
  const discountsSeeded = await Promise.all(
    Array.from({ length: 40 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        const pricingRule = getRandomElement(
          pricingRulesSeeded.filter((pr) => pr?.propertyId === property?.id),
        );
        if (!property) return null;

        return await db.discount.create({
          data: {
            id: faker.string.uuid(),
            name: faker.commerce.productName() + " Discount",
            description: faker.lorem.sentence(),
            code: faker.datatype.boolean()
              ? faker.string.alphanumeric(8).toUpperCase()
              : undefined,
            value: faker.number.float({ min: 5, max: 50, precision: 0.01 }),
            type: faker.helpers.arrayElement(Object.values(DiscountType)),
            startDate: faker.date.past(),
            endDate: faker.date.future(),
            maxUsage: faker.number.int({ min: 10, max: 1000 }),
            currentUsage: faker.number.int({ min: 0, max: 10 }),
            isActive: faker.datatype.boolean(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            propertyId: property.id,
            pricingRuleId: pricingRule?.id,
          },
        });
      } catch (e) {
        console.error("Error creating discount:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${discountsSeeded.length} discounts. Total discounts in DB: ${await db.discount.count()}`,
  );

  // --- Seed Analytics ---
  const analyticsSeeded = await Promise.all(
    Array.from({ length: 200 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        const user = getRandomElement(usersSeeded);
        const agent = getRandomElement(agentsSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const reservation = getRandomElement(reservationsSeeded);
        const task = getRandomElement(tasksSeeded);

        let entityIdVal =
          property?.id ||
          agent?.id ||
          agency?.id ||
          user?.id ||
          reservation?.id ||
          task?.id ||
          faker.string.uuid();
        let entityTypeVal = "UNKNOWN";
        if (property) entityTypeVal = "Property";
        else if (agent) entityTypeVal = "Agent";
        else if (agency) entityTypeVal = "Agency";
        else if (user) entityTypeVal = "User";
        else if (reservation) entityTypeVal = "Reservation";
        else if (task) entityTypeVal = "Task";

        return await db.analytics.create({
          data: {
            id: faker.string.uuid(),
            entityId: entityIdVal,
            entityType: entityTypeVal,
            type: faker.helpers.arrayElement(Object.values(AnalyticsType)),
            data: { page: faker.internet.url(), referer: faker.internet.url() },
            timestamp: faker.date.recent({ days: 30 }),
            propertyId: property?.id,
            userId: user?.id,
            agentId: agent?.id,
            agencyId: agency?.id,
            reservationId: reservation?.id,
            taskId: task?.id,
          },
        });
      } catch (e) {
        console.error("Error creating analytics:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${analyticsSeeded.length} analytics. Total analytics: ${await db.analytics.count()}`,
  );

  // --- Seed Availability ---
  const availabilitiesSeeded = await Promise.all(
    propertiesSeeded.flatMap((property) => {
      if (!property) return [];
      return Array.from({ length: faker.number.int({ min: 30, max: 90 }) }).map(
        async (_, i) => {
          try {
            const date = faker.date.soon({
              days: 90,
              refDate: new Date(new Date().setDate(new Date().getDate() + i)),
            });
            const pricingRule = getRandomElement(
              pricingRulesSeeded.filter((pr) => pr?.propertyId === property.id),
            );
            const reservationForDate = getRandomElement(
              reservationsSeeded.filter(
                (r) =>
                  r?.propertyId === property.id &&
                  r.startDate <= date &&
                  r.endDate >= date,
              ),
            );

            return await db.availability.create({
              data: {
                date: date,
                isBlocked: faker.datatype.boolean(0.1),
                isBooked: !!reservationForDate,
                propertyId: property.id,
                reservationId: reservationForDate?.id,
                pricingRuleId: pricingRule?.id,
                totalUnits: property.bedrooms || 1,
                availableUnits: reservationForDate ? 0 : property.bedrooms || 1,
                bookedUnits: reservationForDate ? property.bedrooms || 1 : 0,
                blockedUnits: 0,
                basePrice:
                  pricingRule?.basePrice ||
                  Number(faker.finance.amount(50, 500, 2)),
                currentPrice:
                  pricingRule?.basePrice ||
                  Number(faker.finance.amount(50, 500, 2)),
                minNights: pricingRule?.minNights || 1,
                maxNights: pricingRule?.maxNights || 30,
                maxGuests: (property.bedrooms || 1) * 2,
                createdAt: faker.date.past(),
                updatedAt: new Date(),
              },
            });
          } catch (e) {
            if (e.code === "P2002") {
              console.warn(
                `Skipping availability for property ${property.id} on date ${Date.toISOString().split("T")[0]} due to unique constraint.`,
              );
              return null;
            }
            console.error("Error creating availability:", e);
            return null;
          }
        },
      );
    }),
  ).then(
    (results) =>
      results.flat().filter((r) => r !== null) as NonNullable<
        (typeof results)[0]
      >[],
  );
  console.log(
    `Created ${availabilitiesSeeded.length} availabilities. Total availabilities: ${await db.availability.count()}`,
  );

  // --- Seed Verification Tokens ---
  const verificationTokensSeeded = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        if (!user) return null;
        return await db.verificationToken.create({
          data: {
            id: faker.string.uuid(),
            userId: user.id,
            token: faker.string.uuid(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating verificationToken:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${verificationTokensSeeded.length} verificationTokens. Total verificationTokens: ${await db.verificationToken.count()}`,
  );

  // --- Seed Channels ---
  const channelsSeeded = await Promise.all(
    Array.from({ length: 15 }).map(async () => {
      try {
        return await db.channel.create({
          data: {
            cuid: faker.string.uuid(),
            name: faker.lorem.word() + " Channel",
            type: faker.helpers.arrayElement(Object.values(ChannelType)),
            category: faker.helpers.arrayElement(
              Object.values(ChannelCategory),
            ),
            description: faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating channel:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${channelsSeeded.length} channels. Total channels in DB: ${await db.channel.count()}`,
  );

  // --- Seed Tickets ---
  const ticketsSeeded = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      try {
        return await db.ticket.create({
          data: {
            cuid: faker.string.uuid(),
            subject: faker.lorem.sentence(5),
            description: faker.lorem.paragraph(),
            status: faker.helpers.arrayElement(Object.values(TicketStatus)),
            createdAt: new Date(),
            updatedAt: new Date(),
            closedAt: faker.datatype.boolean()
              ? faker.date.recent()
              : undefined,
          },
        });
      } catch (e) {
        console.error("Error creating ticket:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${ticketsSeeded.length} tickets. Total tickets in DB: ${await db.ticket.count()}`,
  );

  // --- Seed Contracts ---
  const contractsSeeded = await Promise.all(
    Array.from({ length: 40 }).map(async () => {
      try {
        const tenant = getRandomElement(tenantsSeeded);
        const property = getRandomElement(propertiesSeeded);
        const agency = getRandomElement(agenciesSeeded);
        if (!tenant || !property || !agency) return null;

        return await db.contract.create({
          data: {
            id: faker.string.uuid(),
            name: `Contract for ${property.title} with ${tenant.firstName}`,
            description: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(Object.values(ContractStatus)),
            startDate: faker.date.past({ years: 1 }),
            endDate: faker.date.future({ years: 1 }),
            tenantId: tenant.id,
            propertyId: property.id,
            agencyId: agency.id,
            terms: {
              clauses: [faker.lorem.paragraph(), faker.lorem.paragraph()],
            },
            metadata: { version: "1.0" },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating contract:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${contractsSeeded.length} contracts. Total contracts: ${await db.contract.count()}`,
  );

  // --- Seed Communication Logs ---
  const communicationLogsSeeded = await Promise.all(
    Array.from({ length: 150 }).map(async () => {
      try {
        const sender = getRandomElement(usersSeeded);
        const receiver = getRandomElement(usersSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const channel = getRandomElement(channelsSeeded);
        const ticket = getRandomElement(ticketsSeeded);

        if (!sender || !receiver || sender.id === receiver.id) return null;

        return await db.communicationLog.create({
          data: {
            id: faker.string.uuid(),
            senderId: sender.id,
            receiverId: receiver.id,
            type: faker.helpers.arrayElement(Object.values(CommunicationType)),
            content: faker.lorem.paragraph(),
            entityId: faker.datatype.boolean()
              ? getRandomElement(propertiesSeeded)?.id
              : undefined,
            entityType: faker.datatype.boolean() ? "Property" : undefined,
            metadata: { ip: faker.internet.ip() },
            isRead: faker.datatype.boolean(0.6),
            readAt: faker.datatype.boolean() ? faker.date.recent() : undefined,
            deliveredAt: faker.date.recent(),
            userId: sender.id,
            agencyId: agency?.id,
            channelId: channel?.id,
            ticketId: ticket?.id,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating communicationLog:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${communicationLogsSeeded.length} communicationLogs. Total communicationLogs: ${await db.communicationLog.count()}`,
  );

  // --- Seed Compliance Records ---
  const complianceRecordsSeeded = await Promise.all(
    Array.from({ length: 60 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        const agent = getRandomElement(agentsSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const reservation = getRandomElement(reservationsSeeded);

        let entityIdVal =
          property?.id ||
          agent?.id ||
          agency?.id ||
          reservation?.id ||
          faker.string.uuid();
        let entityTypeVal = "Property";
        if (property) entityTypeVal = "Property";
        else if (agent) entityTypeVal = "Agent";
        else if (agency) entityTypeVal = "Agency";
        else if (reservation) entityTypeVal = "Reservation";

        return await db.complianceRecord.create({
          data: {
            id: faker.string.uuid(),
            entityId: entityIdVal,
            entityType: entityTypeVal,
            type: faker.helpers.arrayElement(Object.values(ComplianceType)),
            status: faker.helpers.arrayElement(Object.values(ComplianceStatus)),
            documentUrl: faker.internet.url(),
            expiryDate: faker.date.future({ years: 2 }),
            notes: faker.lorem.sentence(),
            isVerified: faker.datatype.boolean(),
            propertyId: property?.id,
            agentId: agent?.id,
            agencyId: agency?.id,
            reservationId: reservation?.id,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating complianceRecord:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${complianceRecordsSeeded.length} complianceRecords. Total complianceRecords: ${await db.complianceRecord.count()}`,
  );

  // --- Seed Commission Rules ---
  const commissionRulesSeeded = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      try {
        const provider = getRandomElement(providersSeeded);
        if (!provider) return null;

        return await db.commissionRule.create({
          data: {
            providerId: provider.id,
            ruleType: faker.helpers.arrayElement(
              Object.values(CommissionRuleType),
            ),
            startDate: faker.date.past(),
            endDate: faker.date.future(),
            commission: faker.number.float({
              min: 0.01,
              max: 0.25,
              precision: 0.001,
            }),
            minVolume: faker.datatype.boolean()
              ? faker.number.int({ min: 1000, max: 10000 })
              : undefined,
            maxVolume: faker.datatype.boolean()
              ? faker.number.int({ min: 10000, max: 100000 })
              : undefined,
            conditions: {
              region: faker.location.countryCode(),
              productType: "Booking",
            },
          },
        });
      } catch (e) {
        console.error("Error creating commissionRule:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${commissionRulesSeeded.length} commissionRules. Total commissionRules: ${await db.commissionRule.count()}`,
  );

  // --- Seed Accounts ---
  const accountsSeeded = await Promise.all(
    usersSeeded.map(async (user) => {
      try {
        if (!user) return null;
        return await db.account.create({
          data: {
            userId: user.id,
            type:
              user.type ||
              faker.helpers.arrayElement(Object.values(AccountType)),
            provider: faker.company.name().split(" ")[0],
            providerAccountId: faker.string.uuid(),
            refresh_token: faker.datatype.boolean()
              ? faker.string.uuid()
              : undefined,
            access_token: faker.datatype.boolean()
              ? faker.string.uuid()
              : undefined,
            expires_at: faker.datatype.boolean()
              ? faker.number.int({ min: 3600, max: 7200 })
              : undefined,
            token_type: faker.datatype.boolean() ? "Bearer" : undefined,
            scope: faker.datatype.boolean() ? "read write" : undefined,
            id_token: faker.datatype.boolean()
              ? faker.string.uuid()
              : undefined,
            session_state: faker.datatype.boolean()
              ? faker.string.uuid()
              : undefined,
            createdAt: user.createdAt,
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        if (e.code === "P2002") {
          console.warn(
            `Skipping account for user ${user?.id} due to unique constraint.`,
          );
          return null;
        }
        console.error("Error creating account:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${accountsSeeded.length} accounts. Total accounts in DB: ${await db.account.count()}`,
  );

  // --- Seed Hashtags ---
  const hashtagsSeeded = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      try {
        const createdBy = getRandomElement(usersSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const name =
          faker.lorem.word().toLowerCase() + faker.lorem.word().toLowerCase();
        return await db.hashtag.upsert({
          where: { name },
          update: { usageCount: { increment: 1 } },
          create: {
            id: faker.string.uuid(),
            name: name,
            type: faker.helpers.arrayElement(Object.values(HashtagType)),
            description: faker.lorem.sentence(),
            usageCount: 1,
            relatedTags: faker.helpers.arrayElements(
              [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
              faker.number.int({ min: 0, max: 3 }),
            ),
            createdById: createdBy?.id,
            agencyId: agency?.id,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.error("Error creating/upserting hashtag:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created/Updated ${hashtagsSeeded.length} hashtags. Total hashtags in DB: ${await db.hashtag.count()}`,
  );

  // Link Hashtags to Posts and Properties
  for (const post of postsSeeded) {
    if (!post) continue;
    const numHashtags = faker.number.int({ min: 0, max: 3 });
    const selectedHashtags = faker.helpers.arrayElements(
      hashtagsSeeded.filter(Boolean),
      numHashtags,
    );
    if (selectedHashtags.length > 0) {
      try {
        await db.post.update({
          where: { id: post.id },
          data: {
            Hashtag: { connect: selectedHashtags.map((h) => ({ id: h.id })) },
          },
        });
      } catch (e) {
        console.error(`Error linking hashtags to post ${post.id}:`, e);
      }
    }
  }
  for (const property of propertiesSeeded) {
    if (!property) continue;
    const numHashtags = faker.number.int({ min: 0, max: 3 });
    const selectedHashtags = faker.helpers.arrayElements(
      hashtagsSeeded.filter(Boolean),
      numHashtags,
    );
    if (selectedHashtags.length > 0) {
      try {
        await db.property.update({
          where: { id: property.id },
          data: {
            Hashtag: { connect: selectedHashtags.map((h) => ({ id: h.id })) },
          },
        });
      } catch (e) {
        console.error(`Error linking hashtags to property ${property.id}:`, e);
      }
    }
  }
  console.log("Linked hashtags to posts and properties.");

  // --- Seed Increases ---
  const increasesSeeded = await Promise.all(
    Array.from({ length: 25 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        const tenant = getRandomElement(
          tenantsSeeded.filter((t) => t?.propertyId === property?.id),
        );
        const proposedBy = getRandomElement(
          usersSeeded.filter(
            (u) => u?.role === "AGENT" || u?.role === "AGENCY_ADMIN",
          ),
        );
        const contract = getRandomElement(
          contractsSeeded.filter(
            (c) => c?.propertyId === property?.id && c?.tenantId === tenant?.id,
          ),
        );

        if (!property || !tenant || !proposedBy) return null;

        const oldRent = Number(faker.finance.amount(500, 3000, 2));
        return await db.increase.create({
          data: {
            id: faker.string.uuid(),
            propertyId: property.id,
            tenantId: tenant.id,
            proposedBy: proposedBy.id,
            oldRent: oldRent,
            newRent:
              oldRent *
              faker.number.float({ min: 1.05, max: 1.2, precision: 0.01 }),
            effectiveDate: faker.date.future(),
            status: faker.helpers.arrayElement(Object.values(IncreaseStatus)),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            contractId: contract?.id,
          },
        });
      } catch (e) {
        console.error("Error creating increase:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${increasesSeeded.length} increases. Total increases in DB: ${await db.increase.count()}`,
  );

  // Link Increases to Offers
  for (const offer of offersSeeded) {
    if (!offer) continue;
    if (faker.datatype.boolean(0.2)) {
      const increase = getRandomElement(
        increasesSeeded.filter(
          (i) => i && !i.Offer && i.propertyId === offer.propertyId,
        ),
      );
      if (increase) {
        try {
          await db.offer.update({
            where: { id: offer.id },
            data: { increaseId: increase.id },
          });
          await db.increase.update({
            // Also update the increase to link back to the offer
            where: { id: increase.id },
            data: { Offer: { connect: { id: offer.id } } },
          });
        } catch (e) {
          console.error(
            `Error linking increase ${increase.id} to offer ${offer.id}:`,
            e,
          );
        }
      }
    }
  }
  console.log("Linked increases to offers where applicable.");

  // --- Seed Notifications ---
  const notificationsSeeded = await Promise.all(
    Array.from({ length: 150 }).map(async () => {
      try {
        const user = getRandomElement(usersSeeded);
        const tenant = getRandomElement(tenantsSeeded);
        const agency = getRandomElement(agenciesSeeded);
        const review = getRandomElement(reviewsSeeded);
        const agent = getRandomElement(agentsSeeded);

        if (!user) return null;

        let entityIdVal, entityTypeVal;
        const randomEntityType = faker.helpers.arrayElement([
          "TASK",
          "BOOKING",
          "REVIEW",
          "PROPERTY_ALERT",
          "SYSTEM",
        ]);
        switch (randomEntityType) {
          case "TASK":
            entityIdVal = getRandomElement(tasksSeeded)?.id;
            entityTypeVal = "Task";
            break;
          case "BOOKING":
            entityIdVal = getRandomElement(reservationsSeeded)?.id;
            entityTypeVal = "Reservation";
            break;
          case "REVIEW":
            entityIdVal = review?.id;
            entityTypeVal = "Review";
            break;
          case "PROPERTY_ALERT":
            entityIdVal = getRandomElement(propertiesSeeded)?.id;
            entityTypeVal = "Property";
            break;
          default:
            entityIdVal = faker.string.uuid();
            entityTypeVal = "System";
        }

        return await db.notification.create({
          data: {
            id: faker.string.uuid(),
            userId: user.id,
            type: faker.helpers.arrayElement(Object.values(NotificationType)),
            content: faker.lorem.sentence(),
            entityId: entityIdVal,
            entityType: entityTypeVal,
            isRead: faker.datatype.boolean(0.4),
            tenantId: tenant?.id,
            agencyId: agency?.id,
            createdAt: faker.date.past(),
            reviewId: entityTypeVal === "Review" ? entityIdVal : review?.id, // Link if it's a review notification
            agentId: agent?.id,
          },
        });
      } catch (e) {
        console.error("Error creating notification:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${notificationsSeeded.length} notifications. Total notifications: ${await db.notification.count()}`,
  );

  // --- Seed Expenses ---
  const expensesSeeded = await Promise.all(
    Array.from({ length: 70 }).map(async () => {
      try {
        const property = getRandomElement(propertiesSeeded);
        const tenant = getRandomElement(
          tenantsSeeded.filter((t) => t?.propertyId === property?.id),
        );
        const agency = getRandomElement(agenciesSeeded);
        const currency = getRandomElement(currenciesSeeded);
        const facility = getRandomElement(facilitiesSeeded);
        const includedService = getRandomElement(includedServicesSeeded);
        const extraCharge = getRandomElement(extraChargesSeeded);

        if (!currency) return null;

        return await db.expense.create({
          data: {
            id: faker.string.uuid(),
            propertyId: property?.id,
            tenantId: tenant?.id,
            agencyId: agency?.id,
            type: faker.helpers.arrayElement(Object.values(ExpenseType)),
            amount: Number(faker.finance.amount(10, 1000, 2)),
            currencyId: currency.id,
            dueDate: faker.datatype.boolean() ? faker.date.future() : undefined,
            paidDate: faker.datatype.boolean()
              ? faker.date.recent()
              : undefined,
            status: faker.helpers.arrayElement(Object.values(ExpenseStatus)),
            notes: faker.lorem.sentence(),
            createdAt: faker.date.past(),
            updatedAt: new Date(),
            facilityId: facility?.id,
            includedServiceId: includedService?.id,
            extraChargeId: extraCharge?.id,
          },
        });
      } catch (e) {
        console.error("Error creating expense:", e);
        return null;
      }
    }),
  ).then(
    (results) =>
      results.filter((r) => r !== null) as NonNullable<(typeof results)[0]>[],
  );
  console.log(
    `Created ${expensesSeeded.length} expenses. Total expenses in DB: ${await db.expense.count()}`,
  );

  console.log("Seeding process completed.");
}

main()
  .then(async () => {
    await db.$disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    console.log("Disconnected from database due to error.");
    process.exit(1);
  });
